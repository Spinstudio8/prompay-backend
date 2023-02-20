const Joi = require('joi');

function validateWithdrawal(info) {
  const schema = Joi.object({
    type: Joi.string().min(2).max(50).required().label('Withdrawal type'),
    bankName: Joi.string().min(2).max(50).required().label('Bank name'),
    accountNumber: Joi.string()
      .min(10)
      .max(10)
      .required()
      .label('Account number'),
    accountName: Joi.string().min(2).max(50).required().label('Account name'),
    amount: Joi.number().integer().min(2000).required().label('Amount'),
  });

  return schema.validate(info);
}

function validateWithdrawalAction(info) {
  const schema = Joi.object({
    action: Joi.string().required().label('Withdrawal type'),
  });

  return schema.validate(info);
}

module.exports.validateWithdrawal = validateWithdrawal;
module.exports.validateWithdrawalAction = validateWithdrawalAction;
