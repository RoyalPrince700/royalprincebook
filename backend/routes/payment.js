const express = require('express');
const router = express.Router();
const { verifyPayment, handleFlutterwaveWebhook } = require('../controllers/paymentController');
const { authenticateToken } = require('../middleware/auth');

router.post('/webhook', handleFlutterwaveWebhook);

router.use(authenticateToken);
router.post('/verify', verifyPayment);

module.exports = router;
