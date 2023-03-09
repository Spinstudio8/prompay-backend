const express = require('express');
const {
  signupUser,
  resendVerificationCode,
  getUserProfile,
  updateUserProfile,
  getUserDashboard,
  getUsers,
  getUserById,
  updateUserById,
  deleteUser,
  verifyCode,
  getUserWallet,
  resetPassword,
  verifyPasswordToken,
  setNewPassword,
} = require('../controllers/userController');
const { protect, admin } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/signup', signupUser);
router.post('/resend-verification-code', resendVerificationCode);
router.post('/verify-code', verifyCode);
router
  .route('/:id/profile')
  .get(protect, getUserProfile)
  .patch(protect, updateUserProfile);
router.route('/:id/dashboard').get(protect, getUserDashboard);
router.route('/:id/wallet').get(protect, getUserWallet);
router.get('/', protect, admin, getUsers);
router.delete('/:id/delete', protect, admin, deleteUser);
router
  .route('/:id')
  .get(protect, admin, getUserById)
  .patch(protect, admin, updateUserById);

router.post('/reset-password', resetPassword);
router.get('/verify-password-token/:token', verifyPasswordToken);
router.post('/new-password', setNewPassword);

module.exports = router;
