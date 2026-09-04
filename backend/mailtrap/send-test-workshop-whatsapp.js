const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

process.env.MAILTRAP_USE_PRODUCTION = 'true';

const { sendWorkshopWhatsAppInviteEmail } = require('./emails');
const { getConfiguredMode } = require('./mailtrap.config');

const payload = {
  user: {
    email: process.argv[2] || 'royalprincecube@gmail.com'
  },
  workshopTitle: 'Build with AI Weekend Workshop'
};

const run = async () => {
  try {
    const mode = getConfiguredMode();
    const result = await sendWorkshopWhatsAppInviteEmail(payload);

    console.log('Workshop event-page invite test email sent.');
    console.log(`To: ${payload.user.email}`);
    console.log(`Mode: ${mode}`);
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('Failed to send workshop event-page invite test email.');
    console.error(error.response?.data || error.message || error);
    process.exitCode = 1;
  }
};

run();
