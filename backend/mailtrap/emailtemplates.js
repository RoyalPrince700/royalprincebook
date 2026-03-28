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
    subject: `A personal welcome to ${APP_NAME}`,
    text: `Hi ${username || 'Reader'},

Welcome to ${APP_NAME}.

I am Royal Prince, and I want to personally thank you for joining us. It truly means a lot to have you here.

I created ${APP_NAME} to be more than just a platform for books. My desire is for it to feel like a place where you can learn, grow, and stay connected to ideas that truly matter.

As you begin your journey with us, please know that you are not just another user here. You are part of a community I deeply care about, and I am genuinely glad to welcome you personally.

Open ${APP_NAME}: ${loginUrl}

With gratitude,
Royal Prince
CEO, ${APP_NAME}`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1f2937; max-width: 640px; margin: 0 auto;">
        <h2 style="color: #111827;">Welcome to ${APP_NAME}, ${safeUsername}!</h2>
        <p>I am Royal Prince, and I want to personally thank you for joining us.</p>
        <p>I created ${APP_NAME} to be more than just a platform for books. My hope is that it becomes a place where you can learn, grow, and stay connected to ideas that truly matter.</p>
        <p>As you begin your journey with us, please know that you are not just another user here. You are part of a community I deeply care about, and I am genuinely glad to welcome you personally.</p>
        <p style="margin: 24px 0;">
          <a
            href="${safeLoginUrl}"
            style="background: #111827; color: #ffffff; text-decoration: none; padding: 12px 20px; border-radius: 6px; display: inline-block;"
          >
            Open ${APP_NAME}
          </a>
        </p>
        <p>With gratitude,</p>
        <p><strong>Royal Prince</strong><br />CEO, ${APP_NAME}</p>
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
    subject: `Your book is ready on ${APP_NAME}`,
    text: `Hi ${username || 'Reader'},

Thank you for purchasing "${bookTitle || 'your book'}" on ${APP_NAME}.

I truly appreciate your support. Every time you choose a book through ${APP_NAME}, it means more than a transaction to me. It is a sign that this vision is reaching real people like you, and that means a lot.

I hope this book brings you value, insight, and inspiration.

Amount paid: ${paymentAmount}
${transactionId ? `Transaction ID: ${transactionId}\n` : ''}You can continue reading here: ${libraryUrl}

With gratitude,
Royal Prince
CEO, ${APP_NAME}`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1f2937; max-width: 640px; margin: 0 auto;">
        <h2 style="color: #111827;">Your book is ready, ${safeUsername}</h2>
        <p>Hi ${safeUsername},</p>
        <p>Thank you for purchasing <strong>${safeBookTitle}</strong> on ${APP_NAME}.</p>
        <p>I truly appreciate your support. Every time you choose a book through ${APP_NAME}, it means more than a transaction to me. It is a sign that this vision is reaching real people like you, and that means a lot.</p>
        <p>I hope this book brings you value, insight, and inspiration.</p>
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
        <p>With gratitude,</p>
        <p><strong>Royal Prince</strong><br />CEO, ${APP_NAME}</p>
      </div>
    `
  };
};

module.exports = {
  getWelcomeEmailTemplate,
  getBookPurchaseEmailTemplate
};
