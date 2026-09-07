const path = require('path');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

process.env.MAILTRAP_USE_PRODUCTION = 'true';
process.env.FRONTEND_URL = 'https://www.royalprincehub.com';

const User = require('../models/User');
const PaymentTransaction = require('../models/PaymentTransaction');
const { ensureCatalogBook } = require('../utils/catalogBooks');
const { expandBookAccessIds } = require('../utils/bookAliases');
const { sendBookPurchaseEmail, sendAdminBookPurchaseNotification } = require('./emails');
const { getConfiguredMode } = require('./mailtrap.config');

const EMAIL = (process.argv[2] || '').trim().toLowerCase();
const AMOUNT = Number(process.argv[3] || 1000);
const BOOK_ALIAS = 'local-build-with-ai';

const formatUsername = (value) => {
  const cleaned = (value || '')
    .replace(/[^a-zA-Z0-9]/g, '')
    .trim()
    .slice(0, 24);

  if (!cleaned) {
    return 'Reader';
  }

  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
};

const buildUniqueUsername = async (email) => {
  const emailPrefix = email.split('@')[0];
  const baseUsername = formatUsername(emailPrefix);

  let candidate = baseUsername;
  let suffix = 1;

  while (await User.exists({ username: candidate })) {
    candidate = `${baseUsername}${suffix}`;
    suffix += 1;
  }

  return candidate;
};

const run = async () => {
  if (!EMAIL) {
    throw new Error('Usage: node mailtrap/manual-fulfill-purchase.js <email> [amount]');
  }

  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/bookwriter';
  await mongoose.connect(mongoUri);

  try {
    let user = await User.findOne({ email: EMAIL }).select(
      'username email purchasedBooks'
    );
    let createdUser = false;

    if (!user) {
      const username = await buildUniqueUsername(EMAIL);
      user = await User.create({
        username,
        email: EMAIL,
        authProvider: 'google',
        purchasedBooks: []
      });
      createdUser = true;
      console.log(`Created new user account: ${username} (${EMAIL})`);
      console.log('They can sign in with Google using this email to claim the account.');
    }

    const book = await ensureCatalogBook(BOOK_ALIAS);
    if (!book) {
      throw new Error('Build with AI book could not be resolved or created.');
    }

    const transactionId = `MANUAL-${Date.now()}`;
    const txRef = `manual-fulfillment-${Date.now()}`;
    const currency = 'NGN';
    const paidAt = new Date();

    const purchasedIds = (user.purchasedBooks || []).map((purchasedBook) =>
      String(purchasedBook._id || purchasedBook)
    );
    const alreadyPurchased = purchasedIds.includes(String(book._id));

    await PaymentTransaction.findOneAndUpdate(
      { transactionId },
      {
        transactionId,
        txRef,
        user: user._id,
        book: book._id,
        amount: AMOUNT,
        currency,
        status: 'successful',
        customerEmail: user.email,
        customerName: user.username || '',
        paymentType: 'manual',
        processorResponse: 'Manual bank/transfer fulfillment',
        gatewayResponse: 'manual-fulfillment',
        paidAt,
        verifiedAt: paidAt
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true
      }
    );

    if (!alreadyPurchased) {
      await User.findByIdAndUpdate(user._id, {
        $addToSet: { purchasedBooks: book._id }
      });
      user.purchasedBooks = [...(user.purchasedBooks || []), book._id];
    }

    const purchasedBooks = expandBookAccessIds(
      (user.purchasedBooks || []).map((id) => id._id || id),
      user.purchasedBooks || []
    );

    console.log('User:', user.username, `(${user.email})`, createdUser ? '[created]' : '[existing]');
    console.log('Book:', book.title, `(${book._id})`);
    console.log('Already purchased:', alreadyPurchased);
    console.log('purchasedBooks access ids:', purchasedBooks);
    console.log('Payment transactionId:', transactionId);

    if (alreadyPurchased) {
      console.log('User already had access. Still sending purchase email...');
    }

    const mode = getConfiguredMode();
    console.log(`Sending purchase email via ${mode}...`);

    const paymentData = {
      amount: AMOUNT,
      currency,
      id: transactionId,
      tx_ref: txRef
    };

    const emailResult = await sendBookPurchaseEmail({
      user,
      book,
      paymentData
    });
    console.log('Buyer email result:', JSON.stringify(emailResult, null, 2));

    const adminResult = await sendAdminBookPurchaseNotification({
      user,
      book,
      paymentData
    });
    console.log('Admin email result:', JSON.stringify(adminResult, null, 2));

    console.log('\nFulfillment complete. User now has book, event, and premium access.');
  } finally {
    await mongoose.disconnect();
  }
};

run().catch((error) => {
  console.error('Manual fulfillment failed.');
  console.error(error.response?.data || error.message || error);
  process.exitCode = 1;
});
