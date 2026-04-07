const express = require('express');
const router = express.Router();
const {
  trackAnalyticsEvent,
  getAdminTraffic
} = require('../controllers/analyticsController');
const { authenticateToken, authorizeAdmin } = require('../middleware/auth');

router.post('/track', trackAnalyticsEvent);
router.get('/traffic', authenticateToken, authorizeAdmin, getAdminTraffic);

module.exports = router;
