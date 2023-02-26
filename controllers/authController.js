const bcrypt = require('bcrypt');
const User = require('../models/User');
const { generateToken } = require('../utils/generateToken');
const { validateUserLogin } = require('../validations/userValidation');

// @desc Login user with email and password
// @route Post /api/auth/login
// @Access Public
const loginUser = async (req, res, next) => {
  try {
    // Validation
    const { error } = validateUserLogin(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    let { email, password } = req.body;

    email = email.toLowerCase();
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // check if the password is correct
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).send({ message: 'Invalid email or password' });
    }

    // check if user is not verified
    if (!user.isVerified) {
      return res.status(401).json({
        message: 'Account is not verified',
        isVerified: user.isVerified,
        email: user.email,
      });
    }

    // generate a JSON Web Token
    const token = generateToken(
      user._id,
      user.firstName,
      user.lastName,
      user.role,
      user.isAdmin
    );

    res.status(200).json({
      token: token,
    });
  } catch (error) {
    next(error);
  }
};

module.exports.loginUser = loginUser;
