const { sendEmail } = require('./mailtrap.config');
const {
  getWelcomeEmailTemplate,
  getBookPurchaseEmailTemplate
} = require('./emailtemplates');

const normalizeUrl = (url) => {
  const trimmedUrl = String(url || '').trim();

  if (!trimmedUrl) {
    return 'https://www.royalprincehub.com';
  }

  const urlWithProtocol = /^https?:\/\//i.test(trimmedUrl)
    ? trimmedUrl
    : `https://${trimmedUrl}`;

  return urlWithProtocol.replace(/\/+$/, '');
};

const getFrontendUrl = () => {
  const isProdLike =
    process.env.NODE_ENV === 'production' ||
    !!process.env.RENDER_EXTERNAL_URL ||
    !!process.env.RENDER ||
    !!process.env.VERCEL;

  return normalizeUrl(
    process.env.FRONTEND_URL ||
      (isProdLike ? 'https://www.royalprincehub.com' : 'http://localhost:5173')
  );
};

const sendWelcomeEmail = async (user) => {
  if (!user?.email) {
    return null;
  }

  const template = getWelcomeEmailTemplate({
    email: user.email,
    loginUrl: getFrontendUrl()
  });

  return sendEmail({
    to: [{ email: user.email }],
    category: 'welcome-email',
    ...template
  });
};

const sendBookPurchaseEmail = async ({ user, book, paymentData }) => {
  if (!user?.email || !book) {
    return null;
  }

  const template = getBookPurchaseEmailTemplate({
    email: user.email,
    bookTitle: book.title,
    amount: paymentData?.amount ?? book.price,
    currency: paymentData?.currency || 'NGN',
    transactionId: paymentData?.id || paymentData?.tx_ref,
    libraryUrl: getFrontendUrl()
  });

  return sendEmail({
    to: [{ email: user.email }],
    category: 'book-purchase-email',
    ...template
  });
};

module.exports = {
  sendWelcomeEmail,
  sendBookPurchaseEmail
};
