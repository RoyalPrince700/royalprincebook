const Book = require('../models/Book');

// Get all books for the authenticated user
const getBooks = async (req, res) => {
  try {
    const { search } = req.query;

    let query = {};
    if (search) {
      query = {
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { genre: { $regex: search, $options: 'i' } }
        ]
      };
    }

    // Users see all books
    const books = await Book.find(query)
      .populate('author', 'username email')
      .sort({ updatedAt: -1 });

    res.json({ books });
  } catch (error) {
    console.error('Get books error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get single book with full details
const getBook = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const book = await Book.findById(id)
      .populate('author', 'username email')
      .populate('pages.lastEditedBy', 'username');

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Allow any authenticated user to view the book details
    // Permissions for editing/deleting are handled in their respective controllers

    res.json({ book });
  } catch (error) {
    console.error('Get book error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create new book
const createBook = async (req, res) => {
  try {
    const { title, description, genre } = req.body;
    const author = req.user._id;

    const book = new Book({
      title,
      description,
      genre,
      author
    });

    await book.save();

    const populatedBook = await Book.findById(book._id)
      .populate('author', 'username email');

    res.status(201).json({
      message: 'Book created successfully',
      book: populatedBook
    });
  } catch (error) {
    console.error('Create book error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update book details
const updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, genre, status } = req.body;
    const userId = req.user._id;

    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Check permissions
    if (book.author.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Update fields
    if (title) book.title = title;
    if (description !== undefined) book.description = description;
    if (genre) book.genre = genre;
    if (status) book.status = status;

    await book.save();

    const updatedBook = await Book.findById(id)
      .populate('author', 'username email');

    res.json({
      message: 'Book updated successfully',
      book: updatedBook
    });
  } catch (error) {
    console.error('Update book error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete book
const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Only author can delete their book
    if (book.author.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await Book.findByIdAndDelete(id);

    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    console.error('Delete book error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add or update a page
const updatePage = async (req, res) => {
  try {
    const { bookId, pageNumber } = req.params;
    const { title, rawContent, formattedContent, status } = req.body;
    const userId = req.user._id;

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Check permissions
    if (book.author.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Find existing page or create new one
    let page = book.pages.find(p => p.pageNumber === parseInt(pageNumber));

    if (page) {
      // Update existing page
      if (title !== undefined) page.title = title;
      if (rawContent !== undefined) page.rawContent = rawContent;
      if (formattedContent !== undefined) page.formattedContent = formattedContent;
      if (status) page.status = status;
      page.lastEditedBy = userId;
      page.wordCount = rawContent ? rawContent.split(/\s+/).filter(word => word.length > 0).length : 0;
    } else {
      // Create new page
      page = {
        pageNumber: parseInt(pageNumber),
        title: title || '',
        rawContent: rawContent || '',
        formattedContent: formattedContent || '',
        status: status || 'draft',
        lastEditedBy: userId,
        wordCount: rawContent ? rawContent.split(/\s+/).filter(word => word.length > 0).length : 0
      };
      book.pages.push(page);
    }

    await book.save();

    res.json({
      message: 'Page updated successfully',
      page
    });
  } catch (error) {
    console.error('Update page error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a page
const deletePage = async (req, res) => {
  try {
    const { bookId, pageNumber } = req.params;
    const userId = req.user._id;

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Check permissions
    if (book.author.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Remove page
    book.pages = book.pages.filter(p => p.pageNumber !== parseInt(pageNumber));

    await book.save();

    res.json({ message: 'Page deleted successfully' });
  } catch (error) {
    console.error('Delete page error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook,
  updatePage,
  deletePage
};