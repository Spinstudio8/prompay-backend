const express = require('express');
const {
  resetPassword,
  getAllSettings,
  saveSettings,
} = require('../controllers/settingsController');
const { protect, admin } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/reset-password', protect, resetPassword);
router.get('/', protect, admin, getAllSettings);
router.post('/:id/save', protect, admin, saveSettings);

module.exports = router;
