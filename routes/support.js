const express = require('express');
const { protect, admin } = require('../middlewares/authMiddleware');
const { postUserProblem } = require('../controllers/supportController');

const router = express.Router();

router.post('/report-problem', protect, postUserProblem);

module.exports = router;
