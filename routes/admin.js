const express = require('express');
const {
  getOverview,
  getAdminUsers,
} = require('../controllers/adminController');
const { protect, admin } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/overview', protect, admin, getOverview);
router.get('/admin-users', protect, admin, getAdminUsers);

module.exports = router;
