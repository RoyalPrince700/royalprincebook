const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

process.env.MAILTRAP_USE_PRODUCTION = 'true';

const { sendBookPurchaseEmail } = require('./emails');
const { getConfiguredMode } = require('./mailtrap.config');

const payload = {
  user: {
    email: 'finetex700@gmail.com'
  },
  book: {
    title: 'Leadership From Within',
    price: 1000
  },
  paymentData: {
    amount: 1000,
    currency: 'NGN',
    id: 'TEST-PAYMENT-EMAIL-001'
  }
};

const run = async () => {
  try {
    const mode = getConfiguredMode();
    const result = await sendBookPurchaseEmail(payload);

    console.log('Purchase test email sent.');
    console.log(`Mode: ${mode}`);
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('Failed to send purchase test email.');
    console.error(error.response?.data || error.message || error);
    process.exitCode = 1;
  }
};

run();
