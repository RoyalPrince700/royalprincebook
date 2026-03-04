const express = require('express');
const router = express.Router();
const { verifyPayment } = require('../controllers/paymentController');
const { authenticateToken } = require('../middleware/auth');

// Protect all payment routes
router.use(authenticateToken);

router.post('/verify', verifyPayment);

module.exports = router;
