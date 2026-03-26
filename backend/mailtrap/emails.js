const { sendEmail } = require('./mailtrap.config');
const {
  getWelcomeEmailTemplate,
  getBookPurchaseEmailTemplate
} = require('./emailtemplates');

const getFrontendUrl = () => process.env.FRONTEND_URL || 'http://localhost:5173';

const sendWelcomeEmail = async (user) => {
  if (!user?.email) {
    return null;
  }

  const template = getWelcomeEmailTemplate({
    username: user.username,
    loginUrl: getFrontendUrl()
  });

  return sendEmail({
    to: [{ email: user.email, name: user.username }],
    category: 'welcome-email',
    ...template
  });
};

const sendBookPurchaseEmail = async ({ user, book, paymentData }) => {
  if (!user?.email || !book) {
    return null;
  }

  const template = getBookPurchaseEmailTemplate({
    username: user.username,
    bookTitle: book.title,
    amount: paymentData?.amount ?? book.price,
    currency: paymentData?.currency || 'NGN',
    transactionId: paymentData?.id || paymentData?.tx_ref,
    libraryUrl: getFrontendUrl()
  });

  return sendEmail({
    to: [{ email: user.email, name: user.username }],
    category: 'book-purchase-email',
    ...template
  });
};

module.exports = {
  sendWelcomeEmail,
  sendBookPurchaseEmail
};
