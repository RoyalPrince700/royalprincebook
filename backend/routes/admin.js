const express = require('express');
const router = express.Router();
const {
  getAdminOverview,
  getAdminBooks,
  getAdminUsers,
  getAdminFinance,
  getAdminGameProgress,
  updateAdminGameProgress
} = require('../controllers/adminController');
const {
  getAdminWorkshopEvent,
  updateAdminWorkshopEvent
} = require('../controllers/eventController');
const { authenticateToken, authorizeAdmin } = require('../middleware/auth');

router.use(authenticateToken, authorizeAdmin);

router.get('/overview', getAdminOverview);
router.get('/books', getAdminBooks);
router.get('/users', getAdminUsers);
router.get('/finance', getAdminFinance);
router.get('/game-progress', getAdminGameProgress);
router.put('/game-progress', updateAdminGameProgress);
router.get('/events/workshop', getAdminWorkshopEvent);
router.put('/events/workshop', updateAdminWorkshopEvent);

module.exports = router;
