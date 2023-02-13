const Joi = require('joi');

function validate(question) {
  const schema = Joi.object({
    question: Joi.string().min(2).required().label('Question'),
    options: Joi.array()
      .length(4)
      .items(Joi.string())
      .required()
      .label('Options'),
    answer: Joi.number().integer().min(0).max(3).required().label('Answer'),
  });

  return schema.validate(question);
}

module.exports = validate;
