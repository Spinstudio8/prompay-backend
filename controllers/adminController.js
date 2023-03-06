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
      wallet: req.user.wallet,
    });
  } catch (err) {
    next(err);
  }
};

// @desc Admin get admin users
// @route GET /api/admin/admin-users
// @access Private/Admin
const getAdminUsers = async (req, res, next) => {
  try {
    const admins = await User.find({ isAdmin: true }).select('-password -__v');

    res.json(admins);
  } catch (error) {
    next(error);
  }
};

module.exports.getOverview = getOverview;
module.exports.getAdminUsers = getAdminUsers;
