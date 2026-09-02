const axios = require('axios');
const Book = require('../models/Book');
const User = require('../models/User');
const PaymentTransaction = require('../models/PaymentTransaction');
const { sendBookPurchaseEmail, sendAdminBookPurchaseNotification } = require('../mailtrap/emails');
const { getEffectiveBookPrice } = require('../bookPricing');
const {
  expandBookAccessIds,
  resolveBookByIdOrAlias
} = require('../utils/bookAliases');

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

    const book = await resolveBookByIdOrAlias(bookId, Book);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Verify amount and currency
    const requiredAmount = getEffectiveBookPrice(book);
    book.price = requiredAmount;

    if (requiredAmount > 0) {
      if (typeof data?.amount !== 'number' || data.amount < requiredAmount) {
        return res.status(400).json({ message: 'Invalid payment amount' });
      }

      if (data?.currency && data.currency !== 'NGN') {
        return res.status(400).json({ message: 'Invalid payment currency' });
      }
    }

    await PaymentTransaction.findOneAndUpdate(
      { transactionId: String(transaction_id) },
      {
        transactionId: String(transaction_id),
        txRef: data?.tx_ref || '',
        user: userId,
        book: book._id,
        amount: typeof data?.amount === 'number' ? data.amount : requiredAmount,
        currency: data?.currency || 'NGN',
        status: 'successful',
        customerEmail: data?.customer?.email || req.user.email || '',
        customerName: data?.customer?.name || req.user.username || '',
        paymentType: data?.payment_type || '',
        processorResponse: data?.processor_response || '',
        gatewayResponse: data?.gateway_response || '',
        paidAt: data?.created_at ? new Date(data.created_at) : new Date(),
        verifiedAt: new Date()
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true
      }
    );

    const existingUser = await User.findById(userId)
      .select('username email purchasedBooks')
      .populate('purchasedBooks', 'title');
    const user = existingUser;
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const resolvedBookId = book._id.toString();
    const alreadyPurchased = user.purchasedBooks.some(
      (purchasedBook) => purchasedBook._id.toString() === resolvedBookId
    );

    if (!alreadyPurchased) {
      await User.findByIdAndUpdate(userId, {
        $addToSet: { purchasedBooks: book._id }
      });

      user.purchasedBooks.push(book);

      sendBookPurchaseEmail({
        user,
        book,
        paymentData: data
      }).catch((error) => {
        console.error('Book purchase email error:', error.message);
      });

      sendAdminBookPurchaseNotification({
        user,
        book,
        paymentData: data
      }).catch((error) => {
        console.error('Admin purchase notification email error:', error.message);
      });
    }

    const purchasedBooks = expandBookAccessIds(
      user.purchasedBooks.map((purchasedBook) => purchasedBook._id),
      user.purchasedBooks
    );

    res.json({
      message: 'Payment verified and book purchased successfully',
      bookId: resolvedBookId,
      purchasedBooks
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ message: 'Server error during payment verification' });
  }
};

module.exports = {
  verifyPayment
};
