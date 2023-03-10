const express = require('express');
const {
  resetPassword,
  getAllSettings,
} = require('../controllers/settingsController');
const { protect, admin } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/reset-password', protect, resetPassword);
router.get('/', protect, admin, getAllSettings);

module.exports = router;
