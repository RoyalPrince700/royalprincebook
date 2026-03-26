const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

process.env.MAILTRAP_USE_PRODUCTION = 'true';

const { sendWelcomeEmail } = require('./emails');
const { getConfiguredMode } = require('./mailtrap.config');

const recipient = {
  username: 'RoyalPrince Reader',
  email: 'finetex700@gmail.com'
};

const run = async () => {
  try {
    const mode = getConfiguredMode();
    const result = await sendWelcomeEmail(recipient);

    console.log('Welcome test email sent.');
    console.log(`Mode: ${mode}`);
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('Failed to send welcome test email.');
    console.error(error.response?.data || error.message || error);
    process.exitCode = 1;
  }
};

run();
