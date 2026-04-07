const express = require('express');
const router = express.Router();
const {
  getAdminOverview,
  getAdminBooks,
  getAdminUsers,
  getAdminFinance
} = require('../controllers/adminController');
const { authenticateToken, authorizeAdmin } = require('../middleware/auth');

router.use(authenticateToken, authorizeAdmin);

router.get('/overview', getAdminOverview);
router.get('/books', getAdminBooks);
router.get('/users', getAdminUsers);
router.get('/finance', getAdminFinance);

module.exports = router;
