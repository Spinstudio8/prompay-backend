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
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/signup', signupUser);
router.post('/verification-code', sendVerificationCode);
router.post('/verify', verifyCode);
router.route('/:id/profile').get(getUserProfile).patch(updateUserProfile);
router.route('/:id/dashboard').get(protect, getUserDashboard);
router.route('/:id/wallet').get(protect, getUserWallet);
router.get('/', getUsers);
router.delete('/:id/delete', deleteUser);
router.route('/:id').get(getUserById).patch(updateUserById);

module.exports = router;
