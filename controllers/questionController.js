const Question = require('../models/Question');
const User = require('../models/User');
const validate = require('../validations/questionValidation');

// @desc Add a new Question
// @route Post /api/questions
// @access private/admin
const addQuestion = async (req, res, next) => {
  try {
    const {
      subject,
      description,
      question,
      options,
      answer,
      questionPlainText,
    } = req.body;

    // Validate Question
    const { error } = validate({
      subject,
      description,
      question,
      options,
      answer: parseInt(answer),
      questionPlainText,
    });
    if (error) {
      return res.status(400).json({ message: 'You must complete all fields' });
    }

    const questionExists = await Question.findOne({ questionPlainText });
    if (questionExists) {
      return res.status(400).json({ message: 'Question already exists' });
    }

    const questionObject = new Question({
      question,
      options,
      answer: parseInt(answer),
      subject,
      description,
      questionPlainText,
    });

    await questionObject.save();

    res.status(201).json({ message: 'Question added successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc Edit Question
// @route Patch /api/questions/:id/edit
// @access private/admin
const editQuestion = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { question, options, answer, description } = req.body;

    // Validate Question
    const { error } = validate({
      question,
      options,
      answer: parseInt(answer),
      description,
    });
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const questionObject = await Question.findById(id);
    if (!questionObject) {
      return res.status(404).json({ message: 'Question not found' });
    }

    questionObject.question = question;
    questionObject.answer = parseInt(answer);
    questionObject.options = options;
    questionObject.description = description;

    await questionObject.save();

    res.json(questionObject);
  } catch (error) {
    next(error);
  }
};

// @desc Get all Questions
// @route Get /api/questions
// @access private/admin
const getQuestions = async (req, res, next) => {
  try {
    const questions = await Question.find({})
      .select('question subject questionPlainText')
      .populate({
        path: 'subject',
        select: 'title -_id',
      });

    res.json(questions);
  } catch (error) {
    next(error);
  }
};

// @desc Get Question
// @route Get /api/questions/:id
// @access private/admin
const getQuestion = async (req, res, next) => {
  try {
    const id = req.params.id;
    const question = await Question.findById(id);

    res.json(question);
  } catch (error) {
    next(error);
  }
};

// @desc Delete Question
// @route Delete /api/questions/:id/delete
// @access private/admin
const deleteQuestion = async (req, res, next) => {
  try {
    const id = req.params.id;
    const question = await Question.findById(id);

    if (!question) {
      return res.status(401).json({ message: 'No question to delete' });
    }

    await question.delete();

    res.json({ message: 'Question deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// const getAssessmentQuestions = async (req, res, next) => {
//   try {
//     const questions = await Question.aggregate([
//       { $group: { _id: "$_id", question: { $first: "$$ROOT" } } },
//       { $sample: { size: 200 } },
//       { $replaceRoot: { newRoot: "$question" } }
//     ]);

//     res.json(questions);
//   } catch (error) {
//     next(error);
//   }
// };

module.exports.addQuestion = addQuestion;
module.exports.editQuestion = editQuestion;
module.exports.getQuestions = getQuestions;
module.exports.getQuestion = getQuestion;
module.exports.deleteQuestion = deleteQuestion;
