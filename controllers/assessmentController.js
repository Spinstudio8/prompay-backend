const User = require('../models/User');
const Question = require('../models/Question');
const Assessment = require('../models/Assessment');
const Transaction = require('../models/Transaction');
const Payment = require('../models/Payment');
const validateAssessment = require('../validations/assessmentValidation');
const { conn } = require('../db');

// [
//   { question: '27ge8yw7ee98w99ew', answer: 1, subject: 'yyw673262yg3g287' },
//   { question: '27ge8yw7ee98339ew', answer: 2, subject: 'yyw673262113g287' },
//   { question: '27ge8yw7ee98229ew', answer: 0, subject: 'yyw673262233g287' },
//   { question: '27ge8yw7ee98wr9ew', answer: 1, subject: 'yyw673262453g287' },
//   { question: '27ge8yw7ee98ww9ew', answer: 3, subject: 'yyw673262893g287' },
// ];

// @desc Submit and
// @route Post /api/assessment/submit
// @Access Public
const submitAndCompute = async (req, res, next) => {
  const session = await conn.startSession();

  try {
    session.startTransaction();

    const { error } = validateAssessment(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const assessmentData = req.body.assessmentData;
    const totalQuestion = assessmentData.length;

    // Calculate the score for the assessment
    let score = 0;
    for (const answer of assessmentData) {
      const question = await Question.findById(answer.question).session(
        session
      );
      if (question?.answer == answer.answer) {
        score += 1;
        answer.correct = true;
      } else {
        answer.correct = false;
      }
    }

    // Save the assessment, payment data and transaction data to the database
    const reward = 10; // 10 Naira per question
    const paymentAmount = score * reward;
    const assessment = new Assessment({
      user: req.user._id,
      answers: assessmentData,
      score: score,
      amountEarned: paymentAmount,
    });
    await assessment.save({ session });

    const payment = new Payment({
      user: req.user._id,
      amount: paymentAmount,
      type: 'payment from prompay',
      status: 'successful',
      assessment: assessment._id,
    });
    await payment.save({ session });

    const transaction = new Transaction({
      user: req.user._id,
      amount: paymentAmount,
      type: 'payment from prompay',
      status: 'successful',
    });
    await transaction.save({ session });

    // Update the user's score and wallet balance
    const user = await User.findById(req.user._id);
    user.totalScore += score;
    user.wallet += paymentAmount;
    user.assessments.push(assessment._id);
    user.transactions.push(transaction._id);
    user.payments.push(payment._id);
    await user.save({ session });

    await session.commitTransaction();
    res.status(200).json({
      message: 'Assessment submitted successfully',
      score,
      totalQuestion,
    });
  } catch (err) {
    console.error(err);
    await session.abortTransaction();
    next(err);
  } finally {
    session.endSession();
  }
};

module.exports.submitAndCompute = submitAndCompute;
