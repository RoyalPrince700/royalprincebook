const User = require('../models/User');
const PaymentTransaction = require('../models/PaymentTransaction');
const { sendBookPurchaseEmail, sendAdminBookPurchaseNotification } = require('../mailtrap/emails');
const { expandBookAccessIds } = require('../utils/bookAliases');
const { ensureCatalogBook } = require('../utils/catalogBooks');
const { getEffectiveBookPrice } = require('../bookPricing');
const {
  toAmount,
  getFlutterwaveTransactionId,
  parseBookIdFromTxRef,
  isSuccessfulFlutterwaveCharge,
  verifyFlutterwaveTransaction
} = require('../utils/flutterwave');

const recordSuccessfulPayment = async ({
  transactionId,
  txRef,
  user,
  book,
  amount,
  currency,
  customerEmail,
  customerName,
  paymentType,
  processorResponse,
  gatewayResponse,
  paidAt
}) => {
  const payment = await PaymentTransaction.findOneAndUpdate(
    { transactionId: String(transactionId) },
    {
      transactionId: String(transactionId),
      txRef: txRef || '',
      user: user._id,
      book: book._id,
      amount,
      currency: currency || 'NGN',
      status: 'successful',
      customerEmail: customerEmail || user.email || '',
      customerName: customerName || user.username || '',
      paymentType: paymentType || '',
      processorResponse: processorResponse || '',
      gatewayResponse: gatewayResponse || '',
      paidAt: paidAt || new Date(),
      verifiedAt: new Date()
    },
    {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true
    }
  );

  const purchasedIds = (user.purchasedBooks || []).map((purchasedBook) =>
    String(purchasedBook._id || purchasedBook)
  );
  const alreadyPurchased = purchasedIds.includes(String(book._id));

  if (!alreadyPurchased) {
    await User.findByIdAndUpdate(user._id, {
      $addToSet: { purchasedBooks: book._id }
    });
    user.purchasedBooks = [...(user.purchasedBooks || []), book];

    sendBookPurchaseEmail({
      user,
      book,
      paymentData: { amount, currency, id: transactionId, tx_ref: txRef }
    }).catch((error) => {
      console.error('Book purchase email error:', error.message);
    });

    sendAdminBookPurchaseNotification({
      user,
      book,
      paymentData: { amount, currency, id: transactionId, tx_ref: txRef }
    }).catch((error) => {
      console.error('Admin purchase notification email error:', error.message);
    });
  }

  const purchasedBooks = expandBookAccessIds(
    (user.purchasedBooks || []).map((purchasedBook) => purchasedBook._id || purchasedBook),
    user.purchasedBooks || []
  );

  return { payment, purchasedBooks, bookId: String(book._id) };
};

const resolvePurchaseUser = async ({ userId, email }) => {
  if (userId) {
    const user = await User.findById(userId).select('username email purchasedBooks').populate('purchasedBooks', 'title');
    if (user) {
      return user;
    }
  }

  if (email) {
    return User.findOne({ email: String(email).toLowerCase() })
      .select('username email purchasedBooks')
      .populate('purchasedBooks', 'title');
  }

  return null;
};

const resolvePurchaseBook = async ({ bookId, txRef }) => {
  const candidates = [bookId, parseBookIdFromTxRef(txRef)].filter(Boolean);

  for (const candidate of candidates) {
    const book = await ensureCatalogBook(candidate);
    if (book) {
      return book;
    }
  }

  return null;
};

const fulfillVerifiedCharge = async ({ transactionId, requestedBookId, requestedUserId, flwPayload }) => {
  const data = flwPayload?.data || flwPayload || {};
  const meta = data.meta || flwPayload?.meta || {};
  const book = await resolvePurchaseBook({
    bookId: requestedBookId || meta.bookId || meta.book_id,
    txRef: data.tx_ref || flwPayload?.tx_ref
  });

  if (!book) {
    const error = new Error('Book not found');
    error.statusCode = 404;
    throw error;
  }

  const user = await resolvePurchaseUser({
    userId: requestedUserId || meta.userId || meta.user_id,
    email: data.customer?.email
  });

  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  const requiredAmount = getEffectiveBookPrice(book);
  const paidAmount = toAmount(data.amount);
  const recordedAmount = paidAmount || requiredAmount;

  if (requiredAmount > 0 && paidAmount > 0 && paidAmount + 0.009 < requiredAmount) {
    const error = new Error('Invalid payment amount');
    error.statusCode = 400;
    throw error;
  }

  if (data.currency && data.currency !== 'NGN') {
    const error = new Error('Invalid payment currency');
    error.statusCode = 400;
    throw error;
  }

  return recordSuccessfulPayment({
    transactionId,
    txRef: data.tx_ref || '',
    user,
    book: {
      ...(typeof book.toObject === 'function' ? book.toObject() : book),
      price: requiredAmount,
      _id: book._id,
      title: book.title
    },
    amount: recordedAmount,
    currency: data.currency || 'NGN',
    customerEmail: data.customer?.email || user.email,
    customerName: data.customer?.name || user.username,
    paymentType: data.payment_type,
    processorResponse: data.processor_response,
    gatewayResponse: data.gateway_response,
    paidAt: data.created_at ? new Date(data.created_at) : new Date()
  });
};

const verifyPayment = async (req, res) => {
  try {
    const transactionId = getFlutterwaveTransactionId(req.body) || req.body.transaction_id;
    const bookId = req.body.bookId || req.body.book_id;
    const userId = req.user._id;

    if (!transactionId || !bookId) {
      return res.status(400).json({ message: 'Missing transaction ID or book ID' });
    }

    const flwPayload = await verifyFlutterwaveTransaction(transactionId);

    if (!isSuccessfulFlutterwaveCharge(flwPayload)) {
      return res.status(400).json({ message: 'Payment verification failed' });
    }

    const result = await fulfillVerifiedCharge({
      transactionId,
      requestedBookId: bookId,
      requestedUserId: userId,
      flwPayload
    });

    res.json({
      message: 'Payment verified and book purchased successfully',
      bookId: result.bookId,
      purchasedBooks: result.purchasedBooks
    });
  } catch (error) {
    console.error('Payment verification error:', error.response?.data || error.message);
    const statusCode = error.statusCode || error.response?.status || 500;
    if (statusCode === 404) {
      return res.status(404).json({ message: error.message || 'Book not found' });
    }
    if (statusCode === 400) {
      return res.status(400).json({ message: error.message || 'Payment verification failed' });
    }
    res.status(500).json({ message: 'Server error during payment verification' });
  }
};

const handleFlutterwaveWebhook = async (req, res) => {
  try {
    const flwPayload = req.body || {};
    const data = flwPayload.data || flwPayload;
    const transactionId = getFlutterwaveTransactionId(flwPayload);

    if (!transactionId) {
      return res.status(200).json({ received: true });
    }

    if (!isSuccessfulFlutterwaveCharge(flwPayload) && String(data.status || '').toLowerCase() !== 'successful') {
      return res.status(200).json({ received: true, ignored: true });
    }

    let verifiedPayload = flwPayload;
    try {
      verifiedPayload = await verifyFlutterwaveTransaction(transactionId);
    } catch (verifyError) {
      console.error('Flutterwave webhook verify error:', verifyError.response?.data || verifyError.message);
      return res.status(200).json({ received: true, verified: false });
    }

    if (!isSuccessfulFlutterwaveCharge(verifiedPayload)) {
      return res.status(200).json({ received: true, ignored: true });
    }

    await fulfillVerifiedCharge({
      transactionId,
      flwPayload: verifiedPayload
    });

    res.status(200).json({ received: true, recorded: true });
  } catch (error) {
    console.error('Flutterwave webhook error:', error.message);
    res.status(200).json({ received: true });
  }
};

module.exports = {
  verifyPayment,
  handleFlutterwaveWebhook
};
