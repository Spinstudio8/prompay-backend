const Joi = require('joi');

function validateResetPassword(password) {
  const schema = Joi.object({
    currentPassword: Joi.string().required().label('Current password'),
    newPassword: Joi.string()
      .min(10)
      .max(16)
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
      )
      .required()
      .label('New password'),
  });

  return schema.validate(password);
}

module.exports.validateResetPassword = validateResetPassword;
