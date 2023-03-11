const User = require('../models/User');
const {
  sendProblemToSupport,
} = require('../nodemailer/problem-report-message');
const { validateProblemReport } = require('../validations/supportValidation');

// @desc Post user problem report
// @route GET /api/support/report-problem
// @access Private/Admin
const postUserProblem = async (req, res, next) => {
  try {
    const { error } = validateProblemReport(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'Invalid user' });
    }

    const messageData = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      location: user.location,
      joined: new Date(user.createdAt).toDateString(),
      area: req.body.area,
      details: req.body.details,
    };

    await sendProblemToSupport(messageData);

    res.json({ message: 'Ticket sent successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports.postUserProblem = postUserProblem;
