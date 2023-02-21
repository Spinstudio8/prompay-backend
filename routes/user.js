const express = require('express');
const {
  signupUser,
  sendVerificationCode,
  getUserProfile,
  updateUserProfile,
  getUserDashboard,
  getUsers,
  getUserById,
  updateUserById,
  deleteUser,
  verifyCode,
  getUserWallet,
} = require('../controllers/userController');
const { protect, admin } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/signup', signupUser);
router.post('/verification-code', sendVerificationCode);
router.post('/verify', verifyCode);
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

module.exports = router;
