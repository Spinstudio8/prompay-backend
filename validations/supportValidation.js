const Joi = require('joi');

function validateProblemReport(body) {
  const schema = Joi.object({
    area: Joi.string().required().label('Area'),
    details: Joi.string().min(30).max(1000).required().label('Details'),
  });

  return schema.validate(body);
}

module.exports.validateProblemReport = validateProblemReport;
