const path = require('path');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

process.env.MAILTRAP_USE_PRODUCTION = 'true';

if (!process.env.FRONTEND_URL) {
  process.env.FRONTEND_URL = 'https://www.royalprincehub.com';
}

const User = require('../models/User');
const Book = require('../models/Book');
const PaymentTransaction = require('../models/PaymentTransaction');
const { sendWorkshopWhatsAppInviteEmail } = require('./emails');
const { getConfiguredMode } = require('./mailtrap.config');

const WORKSHOP_TITLE = 'Build with AI Weekend Workshop';
const DRY_RUN = process.argv.includes('--dry-run');
const SEND_DELAY_MS = 400;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const normalizeEmail = (email) => String(email || '').trim().toLowerCase();

const findBuildWithAiBooks = async () => {
  const books = await Book.find({
    title: { $regex: /build with ai/i }
  }).select('_id title');

  return books;
};

const collectPaidBuyerEmails = async (bookIds) => {
  const recipients = new Map();

  const paidUsers = await User.find({
    purchasedBooks: { $in: bookIds },
    email: { $exists: true, $ne: '' }
  }).select('email username purchasedBooks');

  for (const user of paidUsers) {
    const email = normalizeEmail(user.email);
    if (!email) {
      continue;
    }

    recipients.set(email, {
      email,
      username: user.username || null,
      source: 'purchasedBooks'
    });
  }

  const payments = await PaymentTransaction.find({
    book: { $in: bookIds },
    status: 'successful'
  })
    .select('customerEmail user')
    .populate('user', 'email username');

  for (const payment of payments) {
    const email = normalizeEmail(payment.customerEmail || payment.user?.email);
    if (!email) {
      continue;
    }

    if (!recipients.has(email)) {
      recipients.set(email, {
        email,
        username: payment.user?.username || null,
        source: 'paymentTransaction'
      });
    }
  }

  return Array.from(recipients.values()).sort((a, b) => a.email.localeCompare(b.email));
};

const run = async () => {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/bookwriter';

  await mongoose.connect(mongoUri);

  try {
    const books = await findBuildWithAiBooks();

    if (!books.length) {
      throw new Error('No Build with AI book found in the database.');
    }

    console.log('Books matched:');
    for (const book of books) {
      console.log(`- ${book.title} (${book._id})`);
    }

    const recipients = await collectPaidBuyerEmails(books.map((book) => book._id));
    console.log(`\nPaid buyer emails found: ${recipients.length}`);
    recipients.forEach((recipient, index) => {
      console.log(`${index + 1}. ${recipient.email} [${recipient.source}]`);
    });

    if (DRY_RUN) {
      console.log('\nDry run only. No emails were sent.');
      return;
    }

    if (!recipients.length) {
      console.log('\nNo recipients to email.');
      return;
    }

    const mode = getConfiguredMode();
    console.log(`\nSending workshop emails via ${mode}...`);

    const results = {
      sent: [],
      failed: []
    };

    for (const recipient of recipients) {
      try {
        await sendWorkshopWhatsAppInviteEmail({
          user: { email: recipient.email },
          workshopTitle: WORKSHOP_TITLE
        });
        results.sent.push(recipient.email);
        console.log(`Sent: ${recipient.email}`);
      } catch (error) {
        results.failed.push({
          email: recipient.email,
          error: error.response?.data || error.message || String(error)
        });
        console.error(`Failed: ${recipient.email}`);
        console.error(error.response?.data || error.message || error);
      }

      await sleep(SEND_DELAY_MS);
    }

    console.log('\nDone.');
    console.log(`Sent: ${results.sent.length}`);
    console.log(`Failed: ${results.failed.length}`);

    if (results.failed.length) {
      process.exitCode = 1;
    }
  } finally {
    await mongoose.disconnect();
  }
};

run().catch(async (error) => {
  console.error('Broadcast failed.');
  console.error(error.message || error);
  try {
    await mongoose.disconnect();
  } catch (_disconnectError) {
    // ignore
  }
  process.exitCode = 1;
});
