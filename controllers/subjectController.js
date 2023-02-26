const Subject = require('../models/Subject');

// @desc Get all subjects
// @route GET /api/subjects
// @access Private
const getSubjects = async (req, res, next) => {
  try {
    const subjects = await Subject.find({});

    res.json(subjects);
  } catch (err) {
    next(err);
  }
};

module.exports.getSubjects = getSubjects;
