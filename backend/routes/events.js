const express = require('express');
const router = express.Router();
const { getWorkshopEvent } = require('../controllers/eventController');
const { authenticateToken } = require('../middleware/auth');

router.get('/workshop', authenticateToken, getWorkshopEvent);

module.exports = router;
