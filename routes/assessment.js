const express = require('express');
const {
  submitAndCompute,
  startAssessment,
} = require('../controllers/assessmentController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/start', protect, startAssessment);
router.post('/submit', protect, submitAndCompute);

module.exports = router;
