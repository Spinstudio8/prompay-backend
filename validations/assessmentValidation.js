const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

function validateAssessment(assessment) {
  const schema = Joi.object({
    assessmentData: Joi.array()
      .items(
        Joi.object({
          question: Joi.objectId().required(),
          subject: Joi.objectId().required(),
          answer: Joi.number().integer().min(0).max(4).required(),
        })
      )
      .required()
      .label('Assessment data'),
  });

  return schema.validate(assessment);
}

module.exports = validateAssessment;
