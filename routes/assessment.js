const express = require('express');
const { submitAndCompute } = require('../controllers/assessmentController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/submit', protect, submitAndCompute);

module.exports = router;
