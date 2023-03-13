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

function validateSettings(data, settings) {
  if (settings === 'withdrawal settings') {
    const schema = Joi.object({
      minWithdrawal: Joi.number()
        .integer()
        .min(1)
        .required()
        .label('Minimum withdrawal'),
      maxWithdrawal: Joi.number()
        .integer()
        .min(1)
        .required()
        .label('Maximum withdrawal'),
    });

    return schema.validate(data);
  }

  if (settings === 'assessment settings') {
    const schema = Joi.object({
      totalQuestions: Joi.number()
        .integer()
        .min(1)
        .required()
        .label('Total questions'),
      pricePerQuestion: Joi.number()
        .integer()
        .min(1)
        .required()
        .label('Price per question'),
      assessmentTime: Joi.number()
        .integer()
        .min(1)
        .required()
        .label('Assessment Time'),
    });

    return schema.validate(data);
  }
}

module.exports.validateResetPassword = validateResetPassword;
module.exports.validateSettings = validateSettings;
