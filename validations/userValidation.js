const Joi = require('joi');

// Define the enum values
const genderEnum = ['male', 'female'];

function validateUserSignup(user) {
  const schema = Joi.object({
    firstName: Joi.string().min(2).max(50).required().label('First name'),
    lastName: Joi.string().min(2).max(50).required().label('Last name'),
    email: Joi.string().max(50).required().email().label('Email'),
    phone: Joi.string().required().label('Phone'),
    location: Joi.string().max(50).required().label('Location'),
    birthDay: Joi.date().min().required().label('Birth day'),
    gender: Joi.string()
      .valid(...genderEnum)
      .required()
      .label('Gender'),
    password: Joi.string()
      .min(10)
      .max(16)
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
      )
      .required()
      .label('Password'),
  });

  return schema.validate(user);
}

function validateUserBirthDay(dateString) {
  const timestamp = 473040000000; // timestamp for 15 years

  let birthDayInMillis = new Date(dateString).getTime();

  birthDayInMillis = Date.now() - birthDayInMillis;

  if (birthDayInMillis >= timestamp) {
    return null;
  } else {
    return 'You must be 15 years or older';
  }
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

function validatePassword(password) {
  const schema = Joi.object({
    password: Joi.string()
      .min(10)
      .max(16)
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
      )
      .required()
      .label('Password'),
  });

  return schema.validate(password);
}

function validateUserProfile(user) {
  const schema = Joi.object({
    firstName: Joi.string().min(2).max(50).required().label('First name'),
    lastName: Joi.string().min(2).max(50).required().label('Last name'),
    location: Joi.string().min(0).max(50).label('Location'),
  });

  return schema.validate(user);
}

function adminValidateUserProfile(user) {
  const schema = Joi.object({
    firstName: Joi.string().min(2).max(50).required().label('First name'),
    lastName: Joi.string().min(2).max(50).required().label('Last name'),
    role: Joi.string().min(2).required().label('Role'),
    gender: Joi.string()
      .valid(...genderEnum)
      .required()
      .label('Gender'),
    location: Joi.string().min(0).max(50).label('Location'),
    isAdmin: Joi.boolean().required().label('Is Admin'),
    hasAuthority: Joi.boolean().required().label('Has Authority'),
  });

  return schema.validate(user);
}

module.exports.validateUserSignup = validateUserSignup;
module.exports.validateUserBirthDay = validateUserBirthDay;
module.exports.validateUserLogin = validateUserLogin;
module.exports.validateEmail = validateEmail;
module.exports.validatePassword = validatePassword;
module.exports.validateUserProfile = validateUserProfile;
module.exports.adminValidateUserProfile = adminValidateUserProfile;
