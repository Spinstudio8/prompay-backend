const express = require('express');
const {
  addQuestion,
  getQuestions,
  editQuestion,
  deleteQuestion,
  getQuestion,
} = require('../controllers/questionController');
const { protect, admin } = require('../middlewares/authMiddleware');

const router = express.Router();

router
  .route('/')
  .post(protect, admin, addQuestion)
  .get(protect, admin, getQuestions);
router.get('/:id', protect, admin, getQuestion);
router.patch('/:id/edit', protect, admin, editQuestion);
router.delete('/:id/delete', protect, admin, deleteQuestion);

module.exports = router;
