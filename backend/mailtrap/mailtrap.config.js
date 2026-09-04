const nodemailer = require('nodemailer');
const { MailtrapClient } = require('mailtrap');

let smtpTransporter;
let mailtrapClient;

const getMailFromEmail = () =>
  process.env.EMAIL_FROM ||
  process.env.MAILTRAP_FROM ||
  'noreply@royalprincehub.com';

const getMailFromName = () => process.env.MAILTRAP_FROM_NAME || 'RoyalPrinceHub';

const getSmtpConfig = () => ({
  host: process.env.MAILTRAP_HOST,
  port: Number(process.env.MAILTRAP_PORT || 2525),
  user: process.env.MAILTRAP_USER,
  pass: process.env.MAILTRAP_PASS
});

const getProductionToken = () =>
  process.env.MAILTRAP_API_TOKEN ||
  process.env.MAILTRAP_PROD_TOKEN ||
  process.env.MAILTRAP_PROD_PASS ||
  process.env.mailtraptoken;

const shouldUseProductionMail = () =>
  process.env.NODE_ENV === 'production' ||
  process.env.MAILTRAP_USE_PRODUCTION === 'true' ||
  process.env.EMAIL_SERVICE === 'mailtrap-production';

const hasSmtpConfig = () => {
  const smtpConfig = getSmtpConfig();
  return Boolean(
    smtpConfig.host &&
      smtpConfig.port &&
      smtpConfig.user &&
      smtpConfig.pass
  );
};

const getFromAddress = () => ({
  email: getMailFromEmail(),
  name: getMailFromName()
});

const normalizeRecipients = (recipients) => {
  if (!Array.isArray(recipients)) {
    recipients = [recipients];
  }

  return recipients
    .filter(Boolean)
    .map((recipient) => {
      if (typeof recipient === 'string') {
        return { email: recipient };
      }

      return recipient;
    })
    .filter((recipient) => recipient.email);
};

const getSmtpTransporter = () => {
  if (!smtpTransporter) {
    const smtpConfig = getSmtpConfig();
    smtpTransporter = nodemailer.createTransport({
      host: smtpConfig.host,
      port: smtpConfig.port,
      secure: smtpConfig.port === 465,
      auth: {
        user: smtpConfig.user,
        pass: smtpConfig.pass
      }
    });
  }

  return smtpTransporter;
};

const getMailtrapClient = () => {
  if (!mailtrapClient) {
    mailtrapClient = new MailtrapClient({
      token: getProductionToken()
    });
  }

  return mailtrapClient;
};

const sendWithProductionApi = async ({ to, subject, text, html, category, from }) => {
  const client = getMailtrapClient();

  return client.send({
    from: from || getFromAddress(),
    to,
    subject,
    text,
    html,
    category
  });
};

const sendWithSandboxSmtp = async ({ to, subject, text, html, category, from }) => {
  const transporter = getSmtpTransporter();
  const sender = from || getFromAddress();

  return transporter.sendMail({
    from: `"${sender.name}" <${sender.email}>`,
    to: to.map((recipient) => recipient.email).join(', '),
    subject,
    text,
    html,
    headers: category ? { 'X-Category': category } : undefined
  });
};

const getConfiguredMode = () => {
  const productionToken = getProductionToken();

  if (shouldUseProductionMail() && productionToken) {
    return 'production-api';
  }

  if (hasSmtpConfig()) {
    return 'sandbox-smtp';
  }

  if (productionToken) {
    return 'production-api';
  }

  return null;
};

const sendEmail = async ({ to, subject, text, html, category, from }) => {
  const recipients = normalizeRecipients(to);

  if (!recipients.length) {
    throw new Error('At least one email recipient is required.');
  }

  const mode = getConfiguredMode();

  if (!mode) {
    throw new Error(
      'Mail service is not configured. Add Mailtrap sandbox SMTP credentials or a production API token.'
    );
  }

  if (mode === 'production-api') {
    return sendWithProductionApi({
      to: recipients,
      subject,
      text,
      html,
      category,
      from
    });
  }

  return sendWithSandboxSmtp({
    to: recipients,
    subject,
    text,
    html,
    category,
    from
  });
};

module.exports = {
  sendEmail,
  getConfiguredMode,
  getFromAddress
};
