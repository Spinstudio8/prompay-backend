const express = require('express');
const {
  withdrawal,
  processWithdrawal,
  getWithdrawals,
  getWithdrawalById,
} = require('../controllers/withdrawalController');
const { protect, admin } = require('../middlewares/authMiddleware');

const router = express.Router();

// api/withdrawals

router.route('/').post(protect, withdrawal).get(protect, admin, getWithdrawals);
router.get('/:id', protect, admin, getWithdrawalById);
router.patch('/:id/process', protect, admin, processWithdrawal);

module.exports = router;
