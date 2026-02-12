const express = require('express');
const router = express.Router();
const {
  getBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook,
  updatePage,
  deletePage
} = require('../controllers/bookController');
const { authenticateToken, authorizeAdmin } = require('../middleware/auth');

// Public routes - anyone can browse books
router.get('/', getBooks);

// Protected routes - require authentication
router.use(authenticateToken);
router.get('/:id', getBook);
router.post('/', authorizeAdmin, createBook);
router.put('/:id', authorizeAdmin, updateBook);
router.delete('/:id', authorizeAdmin, deleteBook);

// Page management routes - require authentication and admin
router.put('/:bookId/pages/:pageNumber', authorizeAdmin, updatePage);
router.delete('/:bookId/pages/:pageNumber', authorizeAdmin, deletePage);

module.exports = router;