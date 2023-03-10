const express = require('express');
const { resetPassword } = require('../controllers/settingsController');
const { protect, admin } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/reset-password', protect, resetPassword);

module.exports = router;
