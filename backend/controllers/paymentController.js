const axios = require('axios');
const Book = require('../models/Book');
const User = require('../models/User');
const { sendBookPurchaseEmail } = require('../mailtrap/emails');

// Verify payment
const verifyPayment = async (req, res) => {
  try {
    const { transaction_id, bookId } = req.body;
    const userId = req.user._id;

    if (!transaction_id || !bookId) {
      return res.status(400).json({ message: 'Missing transaction ID or book ID' });
    }

    // Verify transaction with Flutterwave
    const flwResponse = await axios.get(
      `https://api.flutterwave.com/v3/transactions/${transaction_id}/verify`,
      {
        headers: {
          Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`
        }
      }
    );

    const { status, data } = flwResponse.data;

    if (status !== 'success' || data?.status !== 'successful') {
      return res.status(400).json({ message: 'Payment verification failed' });
    }

    // Find the book
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Verify amount and currency
    if (book.price > 0) {
      if (typeof data?.amount !== 'number' || data.amount < book.price) {
        return res.status(400).json({ message: 'Invalid payment amount' });
      }

      if (data?.currency && data.currency !== 'NGN') {
        return res.status(400).json({ message: 'Invalid payment currency' });
      }
    }

    // Add book to user's purchasedBooks
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const alreadyPurchased = user.purchasedBooks.some(
      (purchasedBookId) => purchasedBookId.toString() === bookId.toString()
    );

    if (!alreadyPurchased) {
      user.purchasedBooks.push(bookId);
      await user.save();

      sendBookPurchaseEmail({
        user,
        book,
        paymentData: data
      }).catch((error) => {
        console.error('Book purchase email error:', error.message);
      });
    }

    res.json({
      message: 'Payment verified and book purchased successfully',
      bookId: bookId,
      purchasedBooks: user.purchasedBooks
    });

  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ message: 'Server error during payment verification' });
  }
};

module.exports = {
  verifyPayment
};
