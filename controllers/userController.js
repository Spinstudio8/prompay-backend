const bcrypt = require('bcrypt');
const User = require('../models/User');
const Assessment = require('../models/Assessment');
const Subject = require('../models/Subject');
const { sendCode } = require('../nodemailer/verificationMessage');
const generateCode = require('../utils/generateCode');
const { generateToken } = require('../utils/generateToken');
const {
  validateUserProfile,
  validateUserSignup,
  validateEmail,
  adminValidateUserProfile,
} = require('../validations/userValidation');
const {
  sendSuccessfulVerificationMessage,
} = require('../nodemailer/successfulVerification');

// @desc Signup user
// @route Post /api/users/signup
// @Access Public
const signupUser = async (req, res, next) => {
  try {
    // Validation
    const { error } = validateUserSignup(req.body);
    if (error) {
      // if it is the regex pattern
      if (error.details[0].context?.regex) {
        return res.status(400).json({
          message:
            'Password must contain at least one uppercase, lowercase, number and special character',
        });
      }

      return res.status(400).json({ message: error.details[0].message });
    }

    let { firstName, lastName, email, phone, birthDay, gender, password } =
      req.body;

    email = email.toLowerCase();
    // check if a user with the same email already exists
    let existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exist' });
    }

    // check if a user with the same phone number already exists
    existingUser = await User.findOne({ phone: phone });
    if (existingUser) {
      return res.status(400).json({ message: 'Phone number taken' });
    }

    // hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // generate the verification code (4 digits)
    const verificationCode = generateCode();
    const verificationCodeExpiration = Date.now() + 300000; // current time + 5m (300,000ms)

    // create a new user
    const user = new User({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      phone,
      birthDay,
      gender,
      verificationCode,
      verificationCodeExpiration,
    });

    await user.save();

    await sendCode({
      lastName,
      email,
      verificationCode,
      verificationCodeExpiration: '5 minutes',
    });

    res.status(201).json({
      message: 'Verification code sent successfully',
      email,
      verificationCodeExpiration: 300000, // 300,000ms = '5 minutes'
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

// @desc Resend user verification code
// @route Post /api/users/resend-verification-code
// @Access Public
const resendVerificationCode = async (req, res, next) => {
  try {
    const { error } = validateEmail(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // generate the verification code (4 digits)
    const verificationCode = generateCode();
    const verificationCodeExpiration = Date.now() + 300000; // current time + 5m (300,000ms)

    user.verificationCode = verificationCode;
    user.verificationCodeExpiration = verificationCodeExpiration;
    await user.save();

    await sendCode({
      lastName: user.lastName,
      email: user.email,
      verificationCode,
      verificationCodeExpiration: '5 minutes',
    });

    res.status(201).json({
      message: 'Verification code sent successfully',
      email: user.email,
      verificationCodeExpiration: 300000, // 300,000ms = '5 minutes'
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

// @desc Verify user code
// @route Post /api/users/verify-code
// @Access Public
const verifyCode = async (req, res, next) => {
  try {
    const email = req.body.email;
    const { error } = validateEmail({ email });
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const user = await User.findOne({
      email: email,
      verificationCode: req.body.verificationCode,
      verificationCodeExpiration: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: 'Invalid code. Click resend below.' });
    }

    user.isVerified = true;
    user.verificationCode = undefined;
    user.verificationCodeExpiration = undefined;

    await user.save();

    await sendSuccessfulVerificationMessage({
      lastName: user.lastName,
      email: user.email,
    });

    res.json({ message: 'Verification successful.' });
  } catch (err) {
    next(err);
  }
};

// @desc Get user profile
// @route GET /api/users/:id/profile
// @access Private
const getUserProfile = async (req, res) => {
  const user = await User.findById(req.params.id).select(
    '-password -__v -currentAssessment'
  );

  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// @desc Update user profile
// @route Patch /api/users/:id/profile
// @access Private
const updateUserProfile = async (req, res, next) => {
  try {
    const { error } = validateUserProfile(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const user = await User.findById(req.params.id);

    if (user) {
      user.firstName = req.body.firstName;
      user.lastName = req.body.lastName;
      user.location = req.body.location;

      const updatedUser = await user.save();

      const token = generateToken({
        id: updatedUser._id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        role: updatedUser.role,
      });

      res.json({
        _id: updatedUser._id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        role: updatedUser.role,
        token: token,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc Get user dashboard
// @route GET /api/users/:id/dashboard
// @access Private
const getUserDashboard = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password -hasAuthority -__v -isAdmin -currentAssessment')
      .populate('assessments');
    console.log(user);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const scoreInSubject = {};

    // find all subject and initialize score to zero for all subjects
    const subjects = await Subject.find({}).select(
      '_id score title description'
    );
    for (const subject of subjects) {
      scoreInSubject[subject._id] = 0;
    }

    // check correct score for each subject then add the score
    for (const assessment of user.assessments) {
      for (const answer of assessment.answers) {
        if (answer.correct) {
          scoreInSubject[answer.subject] = scoreInSubject[answer.subject] + 1;
        }
      }
    }

    // record the score for each subject in subjects array
    for (const subject of subjects) {
      subject.score = scoreInSubject[subject._id];
      console.log(scoreInSubject[subject._id]);
    }

    console.log(subjects);

    user.assessments = user.assessments.length;
    res.json({
      subjects: subjects,
      assessmentsTaken: user.assessments.length,
      wallet: user.wallet,
      totalScore: user.totalScore,
      firstName: user.firstName,
      lastName: user.lastName,
    });
  } catch (err) {
    next(err);
  }
};

// @desc Get user wallet information
// @route GET /api/users/:id/wallet
// @access Private
const getUserWallet = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate(['transactions', 'payment']);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      wallet: user.wallet,
      transactions: user.transactions,
      payments: user.payments,
    });
  } catch (err) {
    next(err);
  }
};

// @desc Get all users
// @route GET /api/users?pageSize=10&pageNumber=1
// @access Private/Admin
const getUsers = async (req, res, next) => {
  try {
    const pageSize = Number(req.query.pageSize) || 10;
    const page = Number(req.query.pageNumber) || 1;

    const count = await User.countDocuments({});
    const users = await User.find({})
      .select('-password -__v')
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({
      users,
      page,
      pages: Math.ceil(count / pageSize),
    });
  } catch (error) {
    next(error);
  }
};

// @desc Delete user
// @route DELETE /api/users/:id/delete
// @access Private/Admin
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      await user.remove();
      res.json({ message: 'User successfuly removed' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc Admin get user by ID
// @route GET /api/users/:id
// @access Private/Admin
const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password -__v');

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc Admin update user by ID
// @route Patch /api/users/:id
// @access Private/Admin
const updateUserById = async (req, res, next) => {
  try {
    const { error } = adminValidateUserProfile(req.body);
    if (error) {
      res.status(400).json({ message: error.details[0].message });
    }

    const user = await User.findById(req.params.id);

    if (user) {
      user.firstName = req.body.firstName;
      user.lastName = req.body.lastName;
      user.role = req.body.role;
      user.isAdmin = req.body.isAdmin;
      user.hasAuthority = req.body.hasAuthority;
      user.gender = req.body.gender;
      user.location = req.body.location;

      const updatedUser = await user.save();
      user.password = '';

      res.json(updatedUser);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    next(err);
  }
};

module.exports.signupUser = signupUser;
module.exports.resendVerificationCode = resendVerificationCode;
module.exports.verifyCode = verifyCode;
module.exports.getUserProfile = getUserProfile;
module.exports.updateUserProfile = updateUserProfile;
module.exports.getUserDashboard = getUserDashboard;
module.exports.getUserWallet = getUserWallet;
module.exports.getUsers = getUsers;
module.exports.deleteUser = deleteUser;
module.exports.getUserById = getUserById;
module.exports.updateUserById = updateUserById;
