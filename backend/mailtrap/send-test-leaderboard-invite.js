const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const { sendLeaderboardInviteEmail } = require('./emails');
const { getConfiguredMode } = require('./mailtrap.config');

const run = async () => {
  try {
    const mode = getConfiguredMode();
    console.log(`Mail mode: ${mode}`);

    const result = await sendLeaderboardInviteEmail({
      invitedUser: { email: 'finetex700@gmail.com' },
      inviter: { username: 'Royal Prince' },
      leaderboardName: 'Test Squad'
    });

    console.log('Leaderboard invite test email sent.');
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('Failed to send leaderboard invite test email.');
    console.error(error.response?.data || error.message || error);
    process.exitCode = 1;
  }
};

run();
