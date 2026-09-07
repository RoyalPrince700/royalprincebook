const { sendEmail, getFromAddress } = require('./mailtrap.config');
const {
  getWelcomeEmailTemplate,
  getBookPurchaseEmailTemplate,
  getAdminBookPurchaseNotificationTemplate,
  getLeaderboardInviteEmailTemplate,
  getWorkboardAccessRequestEmailTemplate,
  getWorkboardAccessGrantedEmailTemplate,
  getWorkshopWhatsAppInviteEmailTemplate
} = require('./emailtemplates');

const PRODUCTION_FRONTEND_URL = 'https://www.royalprincehub.com';

const normalizeUrl = (url) => {
  const trimmedUrl = String(url || '').trim();

  if (!trimmedUrl) {
    return PRODUCTION_FRONTEND_URL;
  }

  const urlWithProtocol = /^https?:\/\//i.test(trimmedUrl)
    ? trimmedUrl
    : `https://${trimmedUrl}`;

  return urlWithProtocol.replace(/\/+$/, '');
};

const isLocalFrontendUrl = (url) =>
  /^(https?:\/\/)?(localhost|127\.0\.0\.1)(:\d+)?(\/|$)/i.test(
    String(url || '').trim()
  );

const getFrontendUrl = () => {
  const configured = String(process.env.FRONTEND_URL || '').trim();

  // Email recipients cannot open localhost. Ignore local FRONTEND_URL so every
  // template (welcome, purchase, workshop, taskboard, etc.) uses production.
  if (!configured || isLocalFrontendUrl(configured)) {
    return normalizeUrl(PRODUCTION_FRONTEND_URL);
  }

  return normalizeUrl(configured);
};

const sendWelcomeEmail = async (user) => {
  if (!user?.email) {
    return null;
  }

  const platformUrl = getFrontendUrl();
  const template = getWelcomeEmailTemplate({
    email: user.email,
    platformUrl,
    booksUrl: `${platformUrl}/all-books`,
    blogUrl: `${platformUrl}/blog`,
    taskboardUrl: `${platformUrl}/taskboard`,
    noteboardUrl: `${platformUrl}/noteboard`,
    dashboardUrl: `${platformUrl}/dashboard`
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

  const frontendUrl = getFrontendUrl();
  const isBuildWithAiPurchase = /build with ai/i.test(book.title || '');
  const template = getBookPurchaseEmailTemplate({
    email: user.email,
    bookTitle: book.title,
    amount: paymentData?.amount ?? book.price,
    currency: paymentData?.currency || 'NGN',
    transactionId: paymentData?.id || paymentData?.tx_ref,
    libraryUrl: isBuildWithAiPurchase
      ? `${frontendUrl}/purchase-success`
      : `${frontendUrl}/all-books`,
    libraryLabel: isBuildWithAiPurchase ? 'Open your workshop kit' : 'Open Library',
    eventUrl: `${frontendUrl}/event`
  });

  return sendEmail({
    to: [{ email: user.email }],
    category: 'book-purchase-email',
    ...template
  });
};

const sendAdminBookPurchaseNotification = async ({ user, book, paymentData }) => {
  if (!book) {
    return null;
  }

  const adminEmail =
    process.env.ADMIN_NOTIFICATION_EMAIL || 'royalprincecube@gmail.com';
  const template = getAdminBookPurchaseNotificationTemplate({
    buyerName: user?.username,
    buyerEmail: user?.email,
    bookTitle: book.title,
    amount: paymentData?.amount ?? book.price,
    currency: paymentData?.currency || 'NGN',
    transactionId: paymentData?.id || paymentData?.tx_ref,
    dashboardUrl: `${getFrontendUrl()}/admin/finance`
  });

  return sendEmail({
    to: [{ email: adminEmail }],
    category: 'admin-book-purchase-notification',
    ...template
  });
};

const sendLeaderboardInviteEmail = async ({ invitedUser, inviter, leaderboardName }) => {
  if (!invitedUser?.email) {
    return null;
  }

  const template = getLeaderboardInviteEmailTemplate({
    email: invitedUser.email,
    inviterName: inviter?.username,
    leaderboardName,
    leaderboardUrl: `${getFrontendUrl()}/taskboard?mode=leaderboard`
  });

  return sendEmail({
    to: [{ email: invitedUser.email }],
    category: 'leaderboard-invite-email',
    ...template
  });
};

const sendWorkboardAccessRequestEmail = async ({ owner, requester, message = '' }) => {
  if (!owner?.email) {
    return null;
  }

  const template = getWorkboardAccessRequestEmailTemplate({
    email: owner.email,
    requesterName: requester?.username,
    requesterEmail: requester?.email,
    message,
    taskboardUrl: `${getFrontendUrl()}/taskboard`
  });

  return sendEmail({
    to: [{ email: owner.email }],
    category: 'workboard-access-request-email',
    ...template
  });
};

const sendWorkboardAccessGrantedEmail = async ({
  requester,
  owner,
  permissions = [],
  ownerNote = '',
  shareToken = ''
}) => {
  if (!requester?.email) {
    return null;
  }

  const sharePath = shareToken ? `/taskboard/share/${shareToken}` : '/taskboard';

  const template = getWorkboardAccessGrantedEmailTemplate({
    email: requester.email,
    ownerName: owner?.username,
    permissions,
    ownerNote,
    shareUrl: `${getFrontendUrl()}${sharePath}`
  });

  return sendEmail({
    to: [{ email: requester.email }],
    category: 'workboard-access-granted-email',
    ...template
  });
};

const sendWorkshopWhatsAppInviteEmail = async ({
  user,
  workshopTitle
}) => {
  if (!user?.email) {
    return null;
  }

  const frontendUrl = getFrontendUrl();
  const template = getWorkshopWhatsAppInviteEmailTemplate({
    email: user.email,
    workshopTitle,
    eventUrl: `${frontendUrl}/event`
  });

  return sendEmail({
    to: [{ email: user.email }],
    from: {
      email: getFromAddress().email,
      name: 'Royal Prince'
    },
    ...template
  });
};

module.exports = {
  getFrontendUrl,
  sendWelcomeEmail,
  sendBookPurchaseEmail,
  sendAdminBookPurchaseNotification,
  sendLeaderboardInviteEmail,
  sendWorkboardAccessRequestEmail,
  sendWorkboardAccessGrantedEmail,
  sendWorkshopWhatsAppInviteEmail
};
