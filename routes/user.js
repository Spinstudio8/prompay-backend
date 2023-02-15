const express = require('express');
const {
  signupUser,
  sendVerificationCode,
  getUserProfile,
  updateUserProfile,
  getUsers,
  getUserById,
  updateUserById,
  deleteUser,
  verifyCode,
} = require('../controllers/userController');

const router = express.Router();

router.post('/signup', signupUser);
router.post('/verification-code', sendVerificationCode);
router.post('/verify', verifyCode);
router.route('/:id/profile').get(getUserProfile).patch(updateUserProfile);
router.get('/', getUsers);
router.delete('/:id/delete', deleteUser);
router.route('/:id').get(getUserById).patch(updateUserById);

module.exports = router;
