const Joi = require('joi');

function validateUserSignup(user) {
  const schema = Joi.object({
    firstName: Joi.string().min(2).max(50).required().label('First name'),
    lastName: Joi.string().min(2).max(50).required().label('Last name'),
    email: Joi.string().max(50).required().email().label('Email'),
    phone: Joi.string().required().label('Phone'),
    birthDay: Joi.date().required().label('Birth day'),
    gender: Joi.string().required().label('Gender'),
    password: Joi.string().min(10).max(16).required().label('Password'),
  });

  return schema.validate(user);
}

function validateUserLogin(user) {
  const schema = Joi.object({
    email: Joi.string().required().email().label('Email'),
    password: Joi.string().required().label('Password'),
  });

  return schema.validate(user);
}

function validateEmail(email) {
  const schema = Joi.object({
    email: Joi.string().required().email().label('Email'),
  });

  return schema.validate(email);
}

function validateUserProfile(user) {
  const schema = Joi.object({
    firstName: Joi.string().min(2).max(50).required().label('First name'),
    lastName: Joi.string().min(2).max(50).required().label('Last name'),
  });

  return schema.validate(user);
}

function adminValidateUserProfile(user) {
  const schema = Joi.object({
    firstName: Joi.string().min(2).max(50).required().label('First name'),
    lastName: Joi.string().min(2).max(50).required().label('Last name'),
    role: Joi.string().min(2).required().label('Role'),
  });

  return schema.validate(user);
}

module.exports.validateUserSignup = validateUserSignup;
module.exports.validateUserLogin = validateUserLogin;
module.exports.validateEmail = validateEmail;
module.exports.validateUserProfile = validateUserProfile;
module.exports.adminValidateUserProfile = adminValidateUserProfile;
