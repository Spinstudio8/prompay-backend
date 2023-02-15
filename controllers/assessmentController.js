const User = require('../models/User');
const Question = require('../models/Question');
const Assessment = require('../models/Assessment');
const Payment = require('../models/Payment');
const validateAssessment = require('../validations/assessmentValidation');

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
  try {
    const { error } = validateAssessment(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const assessmentData = req.body.assessmentData;

    // Calculate the score for the assessment
    let score = 0;
    for (const answer of assessmentData) {
      const question = await Question.findById(answer.questionId);
      if (question?.answer === answer.answer) {
        score += 1;
        answer.correct = true;
      } else {
        answer.correct = false;
      }
    }

    // Save the assessment and payment data to the database
    const reward = 10; // 10 Naira per question
    const paymentAmount = score * reward;
    const assessment = new Assessment({
      user: req.user._id,
      answers: assessmentData,
      score: score,
      amountEarned: paymentAmount,
    });
    await assessment.save();

    const payment = new Payment({
      user: req.user._id,
      amount: paymentAmount,
      type: 'payment from prompay',
      status: 'successful',
      assessment: assessment._id,
    });
    await payment.save();

    // Update the user's points and wallet balance
    const user = await User.findById(req.user._id);
    user.totalScore += score;
    user.wallet += paymentAmount;
    user.assessments.push(assessment._id);
    await user.save();

    res
      .status(200)
      .json({ message: 'Assessment submitted successfully', score: score });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

module.exports.submitAndCompute = submitAndCompute;
