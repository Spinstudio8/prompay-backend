const jwt = require('jsonwebtoken');

const generateToken = (id, firstName, lastName, role) => {
  return jwt.sign({ id, firstName, lastName, role }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });
};

module.exports.generateToken = generateToken;
