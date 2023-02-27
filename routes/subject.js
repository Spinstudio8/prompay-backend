const express = require('express');
const { getSubjects } = require('../controllers/subjectController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', protect, getSubjects);

module.exports = router;
