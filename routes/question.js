const express = require('express');
const {
  addQuestion,
  getQuestions,
  editQuestion,
  deleteQuestion,
  getQuestion,
} = require('../controllers/questionController');

const router = express.Router();

router.route('/').post(addQuestion).get(getQuestions);
router.get('/:id', getQuestion);
router.patch('/:id/edit', editQuestion);
router.delete('/:id/delete', deleteQuestion);

module.exports = router;
