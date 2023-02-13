const User = require('../models/User');
const { sendCode } = require('../nodemailer/verificationMessage');
const { generateToken } = require('../utils/generateToken');
const {
  validateUserProfile,
  validateUserSignup,
} = require('../validations/userValidation');

// @desc Signup user
// @route Post /api/users/signup
// @Access Public
const signupUser = async (req, res, next) => {
  try {
    let { firstName, lastName, email, phone, birthDay, gender, password } =
      req.body;

    // Validation
    const { error } = validateUserSignup({
      firstName,
      lastName,
      email,
      phone,
      birthDay,
      gender,
      password,
    });
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    email = email.toLowerCase();
    // check if a user with the same email already exists
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exist' });
    }

    // hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    // generate the verification code (4 digits)
    const verificationCode = Math.floor(1000 + Math.random() * 9000);
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
      verificationCodeExpiration: '5 minutes',
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

// @desc Verify user code
// @route Post /api/users/verify
// @Access Public
const verifyCode = async (req, res, next) => {
  try {
    const { email, verificationCode } = req.body;

    const user = await User.findOne({
      email: email,
      verificationCode: verificationCode,
      verificationCodeExpiration: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: 'Invalid code. Request a new code.' });
    }

    user.isVerified = true;
    user.verificationCode = undefined;
    user.verificationCodeExpiration = undefined;

    await user.save();

    res.json({ message: 'Verification successful.' });
  } catch (err) {
    next(err);
  }
};

// @desc Get user profile
// @route GET /api/users/:id/profile
// @access Private
const getUserProfile = async (req, res) => {
  const user = await User.findById(req.params.id).select('-password -__v');

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
      res.status(400);
      return res.status(400).json({ message: error.details[0].message });
    }

    const user = await User.findById(req.params.id);

    if (user) {
      user.firstName = req.body.firstName;
      user.lastName = req.body.lastName;

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

// @desc Get all users
// @route GET /api/users
// @access Private/Admin
const getUsers = async (req, res, next) => {
  try {
    const pageSize = 10;
    const page = Number(req.query.pageNumber) || 1;

    const count = await User.countDocuments({});
    const users = await User.find({})
      .select('-password -isAdmin -__v')
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    serialNumbers = [];
    let number = 1;
    for (let i = 0; i < users.length; i++) {
      // give each user sequencial number
      serialNumbers.push(number + pageSize * (page - 1));
      number = number + 1;
    }

    res.json({
      serialNumbers,
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

// @desc Get user by ID
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

// @desc Update user by ID
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
module.exports.verifyCode = verifyCode;
module.exports.getUserProfile = getUserProfile;
module.exports.updateUserProfile = updateUserProfile;
module.exports.getUsers = getUsers;
module.exports.deleteUser = deleteUser;
module.exports.getUserById = getUserById;
module.exports.updateUserById = updateUserById;
