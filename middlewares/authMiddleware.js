const jwt = require('jsonwebtoken');
const User = require('../models/User');

const jwt_secret = process.env.JWT_SECRET;

// jwt token will be sent as bearer
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, jwt_secret);

      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        throw new Error('Invalid user');
      }

      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: 'Not auhtorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not auhtorized, token failed' });
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin && req.user.hasAuthority) {
    next();
  } else {
    res.status(401).json({ message: 'Not auhtorized as an admin' });
  }
};

module.exports.protect = protect;
module.exports.admin = admin;
