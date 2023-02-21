const Withdrawal = require('../models/Withdrawal');
const Assessment = require('../models/Assessment');
const User = require('../models/User');
const Question = require('../models/Question');

// @desc Get application overview
// @route GET /api/admin/overview
// @access Private/Admin
const getOverview = async (req, res, next) => {
  try {
    const successfulWithdrawals = await Withdrawal.find({
      status: 'successful',
    });
    const pendingWithdrawals = await Withdrawal.find({ status: 'pending' });
    const questions = await Question.countDocuments({});
    const users = await User.countDocuments({});
    const assessments = await Assessment.countDocuments({});

    let sumOfSuccessfulWithdrawals = 0;
    let sumOfPendingWithdrawals = 0;
    successfulWithdrawals.forEach((withdrawal) => {
      sumOfSuccessfulWithdrawals += withdrawal.amount;
    });
    pendingWithdrawals.forEach((withdrawal) => {
      sumOfPendingWithdrawals += withdrawal.amount;
    });

    res.json({
      totalPaidOut: sumOfSuccessfulWithdrawals,
      totalQuestions: questions,
      totalTestTaken: assessments,
      totalUsers: users,
      weeklyPayable: sumOfPendingWithdrawals,
      wallet: 0,
    });
  } catch (err) {
    next(err);
  }
};

module.exports.getOverview = getOverview;
