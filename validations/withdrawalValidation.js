const Joi = require('joi');

// Define the enum values
const typeEnum = ['bank'];

function validateWithdrawal(info) {
  const schema = Joi.object({
    type: Joi.string()
      .valid(...typeEnum)
      .required()
      .label('Withdrawal type'),
    bankName: Joi.string().min(2).max(50).required().label('Bank name'),
    accountNumber: Joi.string()
      .min(10)
      .max(10)
      .required()
      .label('Account number'),
    accountName: Joi.string().min(2).max(50).required().label('Account name'),
    amount: Joi.number().integer().required().label('Amount'),
  });

  return schema.validate(info);
}

// Define the enum values
const actionsEnum = ['successful', 'failed', 'pending'];

function validateWithdrawalAction(info) {
  const schema = Joi.object({
    action: Joi.string()
      .valid(...actionsEnum)
      .required()
      .label('Withdrawal action'),
  });

  return schema.validate(info);
}

module.exports.validateWithdrawal = validateWithdrawal;
module.exports.validateWithdrawalAction = validateWithdrawalAction;
