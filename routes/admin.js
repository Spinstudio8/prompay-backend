const express = require('express');
const { getOverview } = require('../controllers/adminController');
const { protect, admin } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/overview', protect, admin, getOverview);

module.exports = router;
