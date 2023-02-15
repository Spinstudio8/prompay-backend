const express = require('express');
const { submitAndCompute } = require('../controllers/assessmentController');

const router = express.Router();

router.post('/submit', submitAndCompute);

module.exports = router;
