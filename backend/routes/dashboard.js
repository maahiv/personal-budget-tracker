const express = require('express');
const {
  getDashboardSummary,
  getMonthlyTrends
} = require('../controllers/dashboardController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/summary', getDashboardSummary);
router.get('/trends', getMonthlyTrends);

module.exports = router;