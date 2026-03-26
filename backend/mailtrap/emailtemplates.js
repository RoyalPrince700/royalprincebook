const APP_NAME = 'RoyalPrinceHub';

const escapeHtml = (value = '') =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const formatPrice = (amount, currency = 'NGN') => {
  if (typeof amount !== 'number' || Number.isNaN(amount)) {
    return null;
  }

  try {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency
    }).format(amount);
  } catch (_error) {
    return `${currency} ${amount}`;
  }
};

const getWelcomeEmailTemplate = ({ username, loginUrl }) => {
  const safeUsername = escapeHtml(username || 'Reader');
  const safeLoginUrl = escapeHtml(loginUrl);

  return {
    subject: `Welcome to ${APP_NAME}`,
    text: `Hi ${username || 'Reader'},

Welcome to ${APP_NAME}. Your account has been created successfully and you can now start exploring books on the platform.

Open ${APP_NAME}: ${loginUrl}

We are excited to have you with us.
The ${APP_NAME} Team`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1f2937; max-width: 640px; margin: 0 auto;">
        <h2 style="color: #111827;">Welcome to ${APP_NAME}, ${safeUsername}!</h2>
        <p>Your account has been created successfully.</p>
        <p>You can now sign in and start reading, discovering, and purchasing books on ${APP_NAME}.</p>
        <p style="margin: 24px 0;">
          <a
            href="${safeLoginUrl}"
            style="background: #111827; color: #ffffff; text-decoration: none; padding: 12px 20px; border-radius: 6px; display: inline-block;"
          >
            Open ${APP_NAME}
          </a>
        </p>
        <p>We are excited to have you with us.</p>
        <p>The ${APP_NAME} Team</p>
      </div>
    `
  };
};

const getBookPurchaseEmailTemplate = ({
  username,
  bookTitle,
  amount,
  currency,
  transactionId,
  libraryUrl
}) => {
  const safeUsername = escapeHtml(username || 'Reader');
  const safeBookTitle = escapeHtml(bookTitle || 'your book');
  const safeLibraryUrl = escapeHtml(libraryUrl);
  const paymentAmount = formatPrice(amount, currency) || 'Your payment was received successfully';
  const safeTransactionId = transactionId ? escapeHtml(transactionId) : null;

  return {
    subject: `Payment confirmed for ${bookTitle || 'your book'}`,
    text: `Hi ${username || 'Reader'},

Payment confirmed. Congratulations on purchasing "${bookTitle || 'your book'}" on ${APP_NAME}.

Amount paid: ${paymentAmount}
${transactionId ? `Transaction ID: ${transactionId}\n` : ''}You can continue on ${APP_NAME}: ${libraryUrl}

Thank you for your purchase.
The ${APP_NAME} Team`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1f2937; max-width: 640px; margin: 0 auto;">
        <h2 style="color: #111827;">Payment received successfully</h2>
        <p>Hi ${safeUsername},</p>
        <p>Congratulations on purchasing <strong>${safeBookTitle}</strong> on ${APP_NAME}.</p>
        <p><strong>Amount paid:</strong> ${escapeHtml(paymentAmount)}</p>
        ${
          safeTransactionId
            ? `<p><strong>Transaction ID:</strong> ${safeTransactionId}</p>`
            : ''
        }
        <p style="margin: 24px 0;">
          <a
            href="${safeLibraryUrl}"
            style="background: #111827; color: #ffffff; text-decoration: none; padding: 12px 20px; border-radius: 6px; display: inline-block;"
          >
            Continue on ${APP_NAME}
          </a>
        </p>
        <p>Thank you for your purchase, and enjoy your new book.</p>
        <p>The ${APP_NAME} Team</p>
      </div>
    `
  };
};

module.exports = {
  getWelcomeEmailTemplate,
  getBookPurchaseEmailTemplate
};
