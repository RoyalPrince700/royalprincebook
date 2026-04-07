const APP_NAME = 'RoyalPrinceHub';

const escapeHtml = (value = '') =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const getEmailHandle = (email = '') => {
  const localPart = String(email).split('@')[0] || 'Reader';
  return localPart.replace(/[._-]+/g, ' ').trim() || 'Reader';
};

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

const baseStyles = {
  body: 'margin:0;padding:0;background-color:#f8fafc;font-family:Inter,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#0f172a;',
  wrapper: 'width:100%;background:radial-gradient(circle at top, #ffffff 0%, #f8fafc 48%, #e2e8f0 100%);padding:32px 16px;',
  shell: 'max-width:640px;margin:0 auto;',
  badge: 'display:inline-block;padding:8px 14px;border:1px solid #e2e8f0;border-radius:999px;background:rgba(255,255,255,0.92);color:#475569;font-size:11px;font-weight:700;letter-spacing:0.22em;text-transform:uppercase;',
  heroCard:
    'margin-top:16px;padding:32px 28px;border-radius:32px;background:linear-gradient(135deg,#0f172a 0%,#111827 52%,#1e293b 100%);color:#ffffff;box-shadow:0 30px 100px rgba(15,23,42,0.22);',
  eyebrow: 'margin:0 0 14px;font-size:11px;font-weight:700;letter-spacing:0.22em;text-transform:uppercase;color:rgba(255,255,255,0.62);',
  title: 'margin:0;font-size:34px;line-height:1.08;font-weight:700;letter-spacing:-0.04em;color:#ffffff;',
  subtitle: 'margin:14px 0 0;font-size:15px;line-height:1.75;color:rgba(255,255,255,0.76);',
  primaryButton:
    'display:inline-block;padding:14px 24px;border-radius:999px;background:#ffffff;color:#0f172a;text-decoration:none;font-size:14px;font-weight:700;',
  secondaryButton:
    'display:inline-block;padding:14px 24px;border-radius:999px;border:1px solid rgba(255,255,255,0.18);background:rgba(255,255,255,0.08);color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;',
  glassCard:
    'margin-top:-18px;padding:28px;border:1px solid rgba(255,255,255,0.82);border-radius:28px;background:rgba(255,255,255,0.88);box-shadow:0 18px 50px rgba(15,23,42,0.08);backdrop-filter:blur(12px);',
  bodyCopy: 'margin:0 0 16px;font-size:15px;line-height:1.8;color:#475569;',
  sectionTitle: 'margin:0 0 16px;font-size:22px;line-height:1.25;font-weight:700;letter-spacing:-0.03em;color:#020617;',
  statGrid: 'width:100%;margin-top:24px;border-collapse:separate;border-spacing:0 14px;',
  statCard:
    'padding:18px 20px;border:1px solid #e2e8f0;border-radius:22px;background:#ffffff;',
  statLabel: 'margin:0 0 6px;font-size:11px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:#64748b;',
  statValue: 'margin:0;font-size:24px;line-height:1.2;font-weight:700;letter-spacing:-0.03em;color:#020617;',
  footer: 'padding:18px 4px 0;font-size:13px;line-height:1.7;color:#64748b;text-align:center;',
  divider: 'height:1px;margin:24px 0;background:#e2e8f0;border:none;',
  quoteCard:
    'margin-top:22px;padding:20px 22px;border-radius:24px;background:#f8fafc;border:1px solid #e2e8f0;color:#334155;',
  quoteMark: 'margin:0;font-size:30px;line-height:1;color:#cbd5e1;',
  note: 'margin:12px 0 0;font-size:14px;line-height:1.7;color:#64748b;'
};

const renderEmailShell = ({
  badge,
  eyebrow,
  title,
  subtitle,
  primaryAction,
  secondaryAction,
  contentHtml,
  footerHtml
}) => `
  <!doctype html>
  <html lang="en">
    <body style="${baseStyles.body}">
      <div style="${baseStyles.wrapper}">
        <div style="${baseStyles.shell}">
          <div style="text-align:center;">
            <span style="${baseStyles.badge}">${badge}</span>
          </div>

          <div style="${baseStyles.heroCard}">
            <p style="${baseStyles.eyebrow}">${eyebrow}</p>
            <h1 style="${baseStyles.title}">${title}</h1>
            <p style="${baseStyles.subtitle}">${subtitle}</p>
            <div style="margin-top:24px;">
              ${
                primaryAction
                  ? `<a href="${primaryAction.href}" style="${baseStyles.primaryButton}">${primaryAction.label}</a>`
                  : ''
              }
              ${
                secondaryAction
                  ? `<a href="${secondaryAction.href}" style="${baseStyles.secondaryButton};margin-left:10px;">${secondaryAction.label}</a>`
                  : ''
              }
            </div>
          </div>

          <div style="${baseStyles.glassCard}">
            ${contentHtml}
          </div>

          <div style="${baseStyles.footer}">
            ${footerHtml}
          </div>
        </div>
      </div>
    </body>
  </html>
`;

const getWelcomeEmailTemplate = ({ email, loginUrl }) => {
  const safeUsername = escapeHtml(getEmailHandle(email));
  const safeLoginUrl = escapeHtml(loginUrl);

  return {
    subject: `A personal welcome to ${APP_NAME}`,
    text: `Hi ${getEmailHandle(email)},

Welcome to ${APP_NAME}.

I am Royal Prince, and I want to personally thank you for joining us. It truly means a lot to have you here.

I created ${APP_NAME} to be more than just a platform for books. My desire is for it to feel like a place where you can learn, grow, and stay connected to ideas that truly matter.

As you begin your journey with us, please know that you are not just another user here. You are part of a community I deeply care about, and I am genuinely glad to welcome you personally.

Open ${APP_NAME}: ${loginUrl}

With gratitude,
Royal Prince
CEO, ${APP_NAME}`,
    html: renderEmailShell({
      badge: 'First Book Release',
      eyebrow: `Welcome to ${APP_NAME}`,
      title: `Leadership that starts within, ${safeUsername}.`,
      subtitle:
        'A clean start, practical wisdom, and a reading experience designed to feel as intentional as the message itself.',
      primaryAction: {
        href: safeLoginUrl,
        label: `Open ${APP_NAME}`
      },
      secondaryAction: {
        href: safeLoginUrl,
        label: 'Start Reading'
      },
      contentHtml: `
        <h2 style="${baseStyles.sectionTitle}">A personal welcome from Royal Prince</h2>
        <p style="${baseStyles.bodyCopy}">Hi ${safeUsername},</p>
        <p style="${baseStyles.bodyCopy}">Thank you for joining ${APP_NAME}. I built this platform to feel more like a modern reading home than a plain storefront, a place where thoughtful ideas, growth, and leadership can live together.</p>
        <p style="${baseStyles.bodyCopy}">You are not just another signup here. You are part of a community I genuinely care about, and I am glad to welcome you personally.</p>
        <div style="${baseStyles.quoteCard}">
          <p style="${baseStyles.quoteMark}">"</p>
          <p style="margin:10px 0 0;font-size:15px;line-height:1.8;color:#334155;">Leadership is first shaped in private, through the choices you make every day.</p>
        </div>
        <table role="presentation" style="${baseStyles.statGrid}">
          <tr>
            <td style="${baseStyles.statCard}">
              <p style="${baseStyles.statLabel}">Your next step</p>
              <p style="${baseStyles.statValue}">Explore the platform</p>
            </td>
          </tr>
          <tr>
            <td style="${baseStyles.statCard}">
              <p style="${baseStyles.statLabel}">What to expect</p>
              <p style="margin:0;font-size:15px;line-height:1.7;color:#475569;">Practical books, clearer direction, and a more intentional reading journey.</p>
            </td>
          </tr>
        </table>
        <hr style="${baseStyles.divider}" />
        <p style="${baseStyles.bodyCopy};margin-bottom:0;">With gratitude,<br /><strong style="color:#020617;">Royal Prince</strong><br />CEO, ${APP_NAME}</p>
      `,
      footerHtml: `You are receiving this email because you created an account on ${APP_NAME}.`
    })
  };
};

const getBookPurchaseEmailTemplate = ({
  email,
  bookTitle,
  amount,
  currency,
  transactionId,
  libraryUrl
}) => {
  const safeUsername = escapeHtml(getEmailHandle(email));
  const safeBookTitle = escapeHtml(bookTitle || 'your book');
  const safeLibraryUrl = escapeHtml(libraryUrl);
  const paymentAmount = formatPrice(amount, currency) || 'Your payment was received successfully';
  const safeTransactionId = transactionId ? escapeHtml(transactionId) : null;

  return {
    subject: `Your book is ready on ${APP_NAME}`,
    text: `Hi ${getEmailHandle(email)},

Thank you for purchasing "${bookTitle || 'your book'}" on ${APP_NAME}.

I truly appreciate your support. Every time you choose a book through ${APP_NAME}, it means more than a transaction to me. It is a sign that this vision is reaching real people like you, and that means a lot.

I hope this book brings you value, insight, and inspiration.

Amount paid: ${paymentAmount}
${transactionId ? `Transaction ID: ${transactionId}\n` : ''}You can continue reading here: ${libraryUrl}

With gratitude,
Royal Prince
CEO, ${APP_NAME}`,
    html: renderEmailShell({
      badge: 'Purchase Confirmed',
      eyebrow: `${APP_NAME} Library`,
      title: `Your book is ready, ${safeUsername}.`,
      subtitle:
        'A polished confirmation with the same premium, modern feel as the website and a direct path back to your library.',
      primaryAction: {
        href: safeLibraryUrl,
        label: 'Continue Reading'
      },
      secondaryAction: {
        href: safeLibraryUrl,
        label: 'Open Library'
      },
      contentHtml: `
        <h2 style="${baseStyles.sectionTitle}">Thank you for your purchase</h2>
        <p style="${baseStyles.bodyCopy}">Hi ${safeUsername},</p>
        <p style="${baseStyles.bodyCopy}">Thank you for purchasing <strong style="color:#020617;">${safeBookTitle}</strong> on ${APP_NAME}. Your support means far more than a transaction. It is proof that this vision is reaching real readers and creating real value.</p>
        <table role="presentation" style="${baseStyles.statGrid}">
          <tr>
            <td style="${baseStyles.statCard}">
              <p style="${baseStyles.statLabel}">Amount paid</p>
              <p style="${baseStyles.statValue}">${escapeHtml(paymentAmount)}</p>
            </td>
          </tr>
          <tr>
            <td style="${baseStyles.statCard}">
              <p style="${baseStyles.statLabel}">Book</p>
              <p style="margin:0;font-size:17px;line-height:1.6;font-weight:600;color:#020617;">${safeBookTitle}</p>
            </td>
          </tr>
          ${
            safeTransactionId
              ? `<tr>
            <td style="${baseStyles.statCard}">
              <p style="${baseStyles.statLabel}">Transaction ID</p>
              <p style="margin:0;font-size:14px;line-height:1.7;color:#475569;word-break:break-word;">${safeTransactionId}</p>
            </td>
          </tr>`
              : ''
          }
        </table>
        <p style="${baseStyles.note}">Your purchase has been confirmed and your library access is ready right now.</p>
        <hr style="${baseStyles.divider}" />
        <p style="${baseStyles.bodyCopy};margin-bottom:0;">With gratitude,<br /><strong style="color:#020617;">Royal Prince</strong><br />CEO, ${APP_NAME}</p>
      `,
      footerHtml: `This receipt confirms access to your purchased book on ${APP_NAME}.`
    })
  };
};

module.exports = {
  getWelcomeEmailTemplate,
  getBookPurchaseEmailTemplate
};
