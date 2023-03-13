const User = require('../models/User');
const Question = require('../models/Question');
const Assessment = require('../models/Assessment');
const Transaction = require('../models/Transaction');
const Payment = require('../models/Payment');
const Setting = require('../models/Setting');
const validateAssessment = require('../validations/assessmentValidation');
const { conn } = require('../db');
const cors = require('../utils/cors');

/*
const currentAssessment = {
  questions: questions,
  startTime: Date.now(),
  endTime: Date.now() + 3600000 + 60000, // 3,600,000 milliseconds = 1hour + 2min
  nextAssessmentTime: Date.now() + 86400000, // 86,400,000 = 24hour
}
*/

// @desc Start assessment by getting assessment questions
// @route Get /api/assessment/start
// @access Private
const startAssessment = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    let currentAssessment = user.currentAssessment;
    // check if user have an assessment to complete
    if (user.hasAssessment && currentAssessment.endTime > Date.now()) {
      // set a new start time
      currentAssessment.startTime = Date.now();
      user.currentAssessment = currentAssessment;
      await user.save();

      return res.json({
        startTime: currentAssessment.startTime,
        endTime: currentAssessment.endTime,
        questions: currentAssessment.questions,
      });
    }

    // get next assessment time
    const nextAssessmentTime = currentAssessment?.nextAssessmentTime
      ? currentAssessment.nextAssessmentTime
      : 0;
    // Send questions only if next assessment time has elapsed
    if (Date.now() > nextAssessmentTime) {
      const settings = await Setting.findOne({
        setting: 'assessment settings',
      });
      if (!settings) {
        return res.status(403).json({
          message: 'Settings error.',
        });
      }
      const totalQuestions = parseInt(settings.data.totalQuestions) || 50;
      const questions = await Question.aggregate([
        { $sample: { size: totalQuestions } },
        {
          $lookup: {
            from: 'subjects',
            localField: 'subject',
            foreignField: '_id',
            as: 'subject',
          },
        },
        { $unwind: '$subject' },
        { $addFields: { subject: '$subject' } },
        { $project: { answer: 0, __v: 0 } },
      ]);

      currentAssessment = {
        questions: questions,
        startTime: Date.now(),
        endTime: Date.now() + 3600000, // 3,600,000 milliseconds = 1hour
        nextAssessmentTime: Date.now() + 86400000, // 86,400,000 = 24hour
      };
      user.currentAssessment = currentAssessment;
      user.hasAssessment = true;
      await user.save();

      currentAssessment.nextAssessmentTime = undefined;
      console.log(currentAssessment);
      res.json(currentAssessment);
    } else {
      res.status(403).json({
        message: 'Sorry, you can only have assessment once in a day.',
      });
    }
  } catch (error) {
    next(error);
  }
};

// [
//   { question: '27ge8yw7ee98w99ew', answer: 1, subject: 'yyw673262yg3g287' },
//   { question: '27ge8yw7ee98339ew', answer: 2, subject: 'yyw673262113g287' },
//   { question: '27ge8yw7ee98229ew', answer: 0, subject: 'yyw673262233g287' },
//   { question: '27ge8yw7ee98wr9ew', answer: 1, subject: 'yyw673262453g287' },
//   { question: '27ge8yw7ee98ww9ew', answer: 3, subject: 'yyw673262893g287' },
// ];

// @desc Submit and compute assessment result
// @route Post /api/assessment/submit
// @Access Private
const submitAndCompute = async (req, res, next) => {
  const session = await conn.startSession();

  try {
    session.startTransaction();

    const { error } = validateAssessment(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // Get assessment settings
    const settings = await Setting.findOne({
      setting: 'assessment settings',
    });
    if (!settings) {
      return res.status(403).json({
        message: 'Settings error.',
      });
    }
    const pricePerQuestion = settings.data.pricePerQuestion || 10;

    const user = await User.findById(req.user._id);
    // if assessment end time has elapsed
    if (
      user.hasAssessment &&
      Date.now() > user.currentAssessment.endTime + 480000 // + 8 minutes more
    ) {
      return res
        .status(400)
        .json({ message: "Timeout! Couldn't submit assessment." });
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

    // console.log(score);
    // return res.json(score);

    // Save the assessment, payment data and transaction data to the database
    const paymentAmount = score * parseInt(pricePerQuestion);
    const assessment = new Assessment({
      user: req.user._id,
      answers: assessmentData,
      score: score,
      amountEarned: paymentAmount,
    });
    await assessment.save({ session });

    // record transaction only if user win money
    if (paymentAmount > 0) {
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
      user.totalScore += score;
      user.wallet += paymentAmount;
      user.transactions.push(transaction._id);
      user.payments.push(payment._id);
    }

    user.assessments.push(assessment._id);
    user.hasAssessment = false;
    await user.save({ session });

    await session.commitTransaction();
    // Set the CORS headers
    // res.set('Access-Control-Allow-Origin', '*');
    // res.set('Access-Control-Allow-Methods', 'POST');
    // res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    res.status(201).json({
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

module.exports.startAssessment = startAssessment;
module.exports.submitAndCompute = submitAndCompute;
