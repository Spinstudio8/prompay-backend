const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

function validate(question) {
  const schema = Joi.object({
    subject: Joi.objectId().required().label('Subject'),
    description: Joi.string().min(2).required().label('Description'),
    question: Joi.string().min(2).required().label('Question'),
    options: Joi.array()
      .length(4)
      .items(Joi.string())
      .required()
      .label('Options'),
    answer: Joi.number().integer().min(0).max(3).required().label('Answer'),
    questionPlainText: Joi.string()
      .min(2)
      .required()
      .label('Question plain text'),
  });

  return schema.validate(question);
}

module.exports = validate;
