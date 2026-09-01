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

const getWelcomeEmailTemplate = ({
  email,
  platformUrl,
  booksUrl,
  blogUrl,
  taskboardUrl,
  noteboardUrl,
  dashboardUrl
}) => {
  const safeUsername = escapeHtml(getEmailHandle(email));
  const safePlatformUrl = escapeHtml(platformUrl);
  const safeBooksUrl = escapeHtml(booksUrl);
  const safeBlogUrl = escapeHtml(blogUrl);
  const safeTaskboardUrl = escapeHtml(taskboardUrl);
  const safeNoteboardUrl = escapeHtml(noteboardUrl);
  const safeDashboardUrl = escapeHtml(dashboardUrl);

  return {
    subject: `Welcome to ${APP_NAME} — your account is ready`,
    text: `Hi ${getEmailHandle(email)},

Welcome to ${APP_NAME}.

I am Royal Prince, and I am glad you joined. ${APP_NAME} is my personal hub — not just for books, but for everything I publish and build in one place.

With your account, you can:

Portfolio — explore my work, projects, and leadership journey
${platformUrl}

Books — browse, purchase, and read digital books
${booksUrl}

Blog — read essays, ideas, and updates
${blogUrl}

Taskboard — plan tasks, track streaks, earn XP, and collaborate
${taskboardUrl}

Noteboard — capture notes and organize ideas
${noteboardUrl}

Dashboard — your home base across the platform
${dashboardUrl}

Thank you for being here. You are part of a community I genuinely care about.

With gratitude,
Royal Prince
CEO, ${APP_NAME}`,
    html: renderEmailShell({
      badge: APP_NAME,
      eyebrow: 'Account ready',
      title: `Glad you're here, ${safeUsername}.`,
      subtitle:
        'One account unlocks my portfolio, books, blog, taskboard, noteboard, and the tools I am building in public.',
      primaryAction: {
        href: safePlatformUrl,
        label: `Open ${APP_NAME}`
      },
      secondaryAction: {
        href: safeDashboardUrl,
        label: 'Go to dashboard'
      },
      contentHtml: `
        <h2 style="${baseStyles.sectionTitle}">A personal welcome from Royal Prince</h2>
        <p style="${baseStyles.bodyCopy}">Hi ${safeUsername},</p>
        <p style="${baseStyles.bodyCopy}">Thank you for joining ${APP_NAME}. I built this platform to be a real home for my work — not just a bookstore. It is where my portfolio, writing, books, and productivity tools live together.</p>
        <p style="${baseStyles.bodyCopy}">You are not just another signup here. You are part of a community I genuinely care about, and I am glad to welcome you personally.</p>
        <table role="presentation" style="${baseStyles.statGrid}">
          <tr>
            <td style="${baseStyles.statCard}">
              <p style="${baseStyles.statLabel}">Portfolio</p>
              <p style="${baseStyles.statValue}">Explore my work</p>
              <p style="${baseStyles.note}">Projects, leadership journey, and what I am building now.</p>
            </td>
          </tr>
          <tr>
            <td style="${baseStyles.statCard}">
              <p style="${baseStyles.statLabel}">Books</p>
              <p style="${baseStyles.statValue}">Read &amp; purchase</p>
              <p style="${baseStyles.note}"><a href="${safeBooksUrl}" style="color:#0f172a;font-weight:600;text-decoration:none;">Browse the library</a> — practical books on leadership, growth, and building.</p>
            </td>
          </tr>
          <tr>
            <td style="${baseStyles.statCard}">
              <p style="${baseStyles.statLabel}">Blog</p>
              <p style="${baseStyles.statValue}">Essays &amp; updates</p>
              <p style="${baseStyles.note}"><a href="${safeBlogUrl}" style="color:#0f172a;font-weight:600;text-decoration:none;">Read the blog</a> — ideas, lessons, and writing in public.</p>
            </td>
          </tr>
          <tr>
            <td style="${baseStyles.statCard}">
              <p style="${baseStyles.statLabel}">Taskboard</p>
              <p style="${baseStyles.statValue}">Plan &amp; collaborate</p>
              <p style="${baseStyles.note}"><a href="${safeTaskboardUrl}" style="color:#0f172a;font-weight:600;text-decoration:none;">Open the taskboard</a> — tasks, streaks, XP, focus mode, and shared boards.</p>
            </td>
          </tr>
          <tr>
            <td style="${baseStyles.statCard}">
              <p style="${baseStyles.statLabel}">Noteboard</p>
              <p style="${baseStyles.statValue}">Capture ideas</p>
              <p style="${baseStyles.note}"><a href="${safeNoteboardUrl}" style="color:#0f172a;font-weight:600;text-decoration:none;">Use the noteboard</a> — notes, sketches, and visual thinking in one place.</p>
            </td>
          </tr>
        </table>
        <div style="${baseStyles.quoteCard}">
          <p style="${baseStyles.quoteMark}">"</p>
          <p style="margin:10px 0 0;font-size:15px;line-height:1.8;color:#334155;">I built ${APP_NAME} so you could learn, create, and stay connected to my work without jumping between scattered tools.</p>
        </div>
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

const workboardEmailStyles = {
  body: 'margin:0;padding:0;background-color:#f7f1e8;font-family:Inter,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#3d342c;',
  wrapper: 'width:100%;background:linear-gradient(180deg,#fffaf3 0%,#f7f1e8 100%);padding:32px 16px;',
  shell: 'max-width:640px;margin:0 auto;',
  badge:
    'display:inline-block;padding:8px 14px;border:1px solid rgba(120,90,60,0.18);border-radius:999px;background:rgba(255,250,243,0.95);color:#6b5e52;font-size:11px;font-weight:700;letter-spacing:0.22em;text-transform:uppercase;',
  heroCard:
    'margin-top:16px;padding:32px 28px;border-radius:28px;background:linear-gradient(135deg,#3d342c 0%,#5a4a3f 52%,#6b5e52 100%);color:#fffaf3;box-shadow:0 24px 60px rgba(61,52,44,0.18);border:1px solid rgba(120,90,60,0.2);',
  eyebrow: 'margin:0 0 14px;font-size:11px;font-weight:700;letter-spacing:0.22em;text-transform:uppercase;color:rgba(255,250,243,0.68);',
  title: 'margin:0;font-size:32px;line-height:1.1;font-weight:700;letter-spacing:-0.04em;color:#fffaf3;',
  subtitle: 'margin:14px 0 0;font-size:15px;line-height:1.75;color:rgba(255,250,243,0.78);',
  primaryButton:
    'display:inline-block;padding:14px 24px;border-radius:999px;background:#c45c3e;color:#fffaf3;text-decoration:none;font-size:14px;font-weight:700;',
  glassCard:
    'margin-top:-18px;padding:28px;border:1px solid rgba(120,90,60,0.14);border-radius:24px;background:rgba(255,250,243,0.94);box-shadow:0 18px 50px rgba(61,52,44,0.08);',
  bodyCopy: 'margin:0 0 16px;font-size:15px;line-height:1.8;color:#6b5e52;',
  sectionTitle: 'margin:0 0 16px;font-size:22px;line-height:1.25;font-weight:700;letter-spacing:-0.03em;color:#3d342c;',
  statCard:
    'padding:18px 20px;border:1px solid rgba(120,90,60,0.14);border-radius:20px;background:#fffaf3;',
  statLabel: 'margin:0 0 6px;font-size:11px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:#6b5e52;',
  statValue: 'margin:0;font-size:22px;line-height:1.2;font-weight:700;letter-spacing:-0.03em;color:#3d342c;',
  footer: 'padding:18px 4px 0;font-size:13px;line-height:1.7;color:#6b5e52;text-align:center;',
  divider: 'height:1px;margin:24px 0;background:rgba(120,90,60,0.14);border:none;'
};

const renderWorkboardEmailShell = ({
  badge,
  eyebrow,
  title,
  subtitle,
  primaryAction,
  contentHtml,
  footerHtml
}) => `
  <!doctype html>
  <html lang="en">
    <body style="${workboardEmailStyles.body}">
      <div style="${workboardEmailStyles.wrapper}">
        <div style="${workboardEmailStyles.shell}">
          <div style="text-align:center;">
            <span style="${workboardEmailStyles.badge}">${badge}</span>
          </div>

          <div style="${workboardEmailStyles.heroCard}">
            <p style="${workboardEmailStyles.eyebrow}">${eyebrow}</p>
            <h1 style="${workboardEmailStyles.title}">${title}</h1>
            <p style="${workboardEmailStyles.subtitle}">${subtitle}</p>
            ${
              primaryAction
                ? `<div style="margin-top:24px;"><a href="${primaryAction.href}" style="${workboardEmailStyles.primaryButton}">${primaryAction.label}</a></div>`
                : ''
            }
          </div>

          <div style="${workboardEmailStyles.glassCard}">
            ${contentHtml}
          </div>

          <div style="${workboardEmailStyles.footer}">
            ${footerHtml}
          </div>
        </div>
      </div>
    </body>
  </html>
`;

const WORKBOARD_PERMISSION_LABELS = {
  add_task: 'Add new tasks',
  edit_task: 'Edit existing tasks',
  delete_task: 'Delete tasks',
  update_status: 'Change task status',
  add_comment: 'Add comments'
};

const formatWorkboardPermissionLabels = (permissions = []) =>
  permissions
    .map((permission) => WORKBOARD_PERMISSION_LABELS[permission] || permission)
    .join(' · ');

const getWorkboardAccessRequestEmailTemplate = ({
  email,
  requesterName,
  requesterEmail,
  message,
  taskboardUrl
}) => {
  const safeOwnerHandle = escapeHtml(getEmailHandle(email));
  const safeRequester = escapeHtml(requesterName || 'Someone');
  const safeRequesterEmail = escapeHtml(requesterEmail || '');
  const safeMessage = message ? escapeHtml(message) : '';
  const safeUrl = escapeHtml(taskboardUrl);

  return {
    subject: `${requesterName || 'Someone'} requested edit access to your Taskboard`,
    text: `Hi ${getEmailHandle(email)},

${requesterName || 'Someone'}${requesterEmail ? ` (${requesterEmail})` : ''} requested edit access to your Taskboard on ${APP_NAME}.
${message ? `\nTheir message:\n"${message}"\n` : ''}
Review the request and choose which permissions to grant:
${taskboardUrl}

You are receiving this because someone requested access to your Taskboard.`,
    html: renderWorkboardEmailShell({
      badge: 'Taskboard Access',
      eyebrow: 'Edit access request',
      title: `New access request, ${safeOwnerHandle}.`,
      subtitle: `${safeRequester} wants to help on your taskboard. Review the request and choose what they can do.`,
      primaryAction: {
        href: safeUrl,
        label: 'Review access request'
      },
      contentHtml: `
        <h2 style="${workboardEmailStyles.sectionTitle}">Someone wants to collaborate</h2>
        <p style="${workboardEmailStyles.bodyCopy}">Hi ${safeOwnerHandle},</p>
        <p style="${workboardEmailStyles.bodyCopy}"><strong style="color:#3d342c;">${safeRequester}</strong>${safeRequesterEmail ? ` <span style="color:#6b5e52;">(${safeRequesterEmail})</span>` : ''} requested edit access to your Taskboard.</p>
        ${
          safeMessage
            ? `<table role="presentation" style="width:100%;margin-top:20px;border-collapse:separate;border-spacing:0 14px;">
          <tr>
            <td style="${workboardEmailStyles.statCard}">
              <p style="${workboardEmailStyles.statLabel}">Message</p>
              <p style="margin:0;font-size:15px;line-height:1.7;color:#6b5e52;font-style:italic;">“${safeMessage}”</p>
            </td>
          </tr>
        </table>`
            : ''
        }
        <table role="presentation" style="width:100%;margin-top:20px;border-collapse:separate;border-spacing:0 14px;">
          <tr>
            <td style="${workboardEmailStyles.statCard}">
              <p style="${workboardEmailStyles.statLabel}">Next step</p>
              <p style="${workboardEmailStyles.statValue}">Review &amp; grant</p>
            </td>
          </tr>
          <tr>
            <td style="${workboardEmailStyles.statCard}">
              <p style="${workboardEmailStyles.statLabel}">What you can do</p>
              <p style="margin:0;font-size:15px;line-height:1.7;color:#6b5e52;">Open Manage access on your taskboard to approve permissions or deny the request.</p>
            </td>
          </tr>
        </table>
        <hr style="${workboardEmailStyles.divider}" />
        <p style="${workboardEmailStyles.bodyCopy};margin-bottom:0;">Only you can approve or deny this request.</p>
      `,
      footerHtml: `You are receiving this email because someone requested edit access to your Taskboard on ${APP_NAME}.`
    })
  };
};

const getWorkboardAccessGrantedEmailTemplate = ({
  email,
  ownerName,
  permissions = [],
  ownerNote,
  shareUrl
}) => {
  const safeRequesterHandle = escapeHtml(getEmailHandle(email));
  const safeOwner = escapeHtml(ownerName || 'The board owner');
  const safePermissions = escapeHtml(formatWorkboardPermissionLabels(permissions));
  const safeOwnerNote = ownerNote ? escapeHtml(ownerNote) : '';
  const safeUrl = escapeHtml(shareUrl);

  return {
    subject: `${ownerName || 'Someone'} granted you edit access on Taskboard`,
    text: `Hi ${getEmailHandle(email)},

Good news — ${ownerName || 'The board owner'} approved your edit access on their Taskboard.

Permissions granted:
${formatWorkboardPermissionLabels(permissions)}
${ownerNote ? `\nNote from the owner:\n"${ownerNote}"\n` : ''}
Open the shared taskboard:
${shareUrl}

You are receiving this because your Taskboard access request was approved.`,
    html: renderWorkboardEmailShell({
      badge: 'Taskboard Access',
      eyebrow: 'Access granted',
      title: `You're in, ${safeRequesterHandle}.`,
      subtitle: `${safeOwner} approved your request. You can now help on their taskboard with the permissions below.`,
      primaryAction: {
        href: safeUrl,
        label: 'Open shared taskboard'
      },
      contentHtml: `
        <h2 style="${workboardEmailStyles.sectionTitle}">Edit access approved</h2>
        <p style="${workboardEmailStyles.bodyCopy}">Hi ${safeRequesterHandle},</p>
        <p style="${workboardEmailStyles.bodyCopy}"><strong style="color:#3d342c;">${safeOwner}</strong> granted you edit access to their Taskboard.</p>
        <table role="presentation" style="width:100%;margin-top:20px;border-collapse:separate;border-spacing:0 14px;">
          <tr>
            <td style="${workboardEmailStyles.statCard}">
              <p style="${workboardEmailStyles.statLabel}">Permissions</p>
              <p style="margin:0;font-size:15px;line-height:1.7;color:#6b5e52;">${safePermissions}</p>
            </td>
          </tr>
          ${
            safeOwnerNote
              ? `<tr>
            <td style="${workboardEmailStyles.statCard}">
              <p style="${workboardEmailStyles.statLabel}">Note from owner</p>
              <p style="margin:0;font-size:15px;line-height:1.7;color:#6b5e52;font-style:italic;">“${safeOwnerNote}”</p>
            </td>
          </tr>`
              : ''
          }
          <tr>
            <td style="${workboardEmailStyles.statCard}">
              <p style="${workboardEmailStyles.statLabel}">What happens next</p>
              <p style="margin:0;font-size:15px;line-height:1.7;color:#6b5e52;">Open the shared link, sign in if needed, and start collaborating on tasks.</p>
            </td>
          </tr>
        </table>
        <hr style="${workboardEmailStyles.divider}" />
        <p style="${workboardEmailStyles.bodyCopy};margin-bottom:0;">Your access stays active until the owner revokes it.</p>
      `,
      footerHtml: `You are receiving this email because your Taskboard access request was approved on ${APP_NAME}.`
    })
  };
};

const getLeaderboardInviteEmailTemplate = ({
  email,
  inviterName,
  leaderboardName,
  leaderboardUrl
}) => {
  const safeUsername = escapeHtml(getEmailHandle(email));
  const safeInviter = escapeHtml(inviterName || 'A friend');
  const safeLeaderboard = escapeHtml(leaderboardName || 'a leaderboard');
  const safeUrl = escapeHtml(leaderboardUrl);

  return {
    subject: `You're invited to join "${leaderboardName || 'a leaderboard'}" on Taskboard`,
    text: `Hi ${getEmailHandle(email)},

${inviterName || 'A friend'} invited you to join the "${leaderboardName || 'leaderboard'}" leaderboard on Taskboard.

Compete with friends using your earned XP, pick your avatar, and climb the board together.

Open Taskboard: ${leaderboardUrl}

You are receiving this because someone invited your email to a Taskboard leaderboard.`,
    html: renderWorkboardEmailShell({
      badge: 'Taskboard Leaderboard',
      eyebrow: 'Royal competition',
      title: `You're invited, ${safeUsername}.`,
      subtitle: `${safeInviter} wants you on their squad. Accept the invite and compete with earned XP.`,
      primaryAction: {
        href: safeUrl,
        label: 'View invite on Taskboard'
      },
      contentHtml: `
        <h2 style="${workboardEmailStyles.sectionTitle}">Join the leaderboard</h2>
        <p style="${workboardEmailStyles.bodyCopy}">Hi ${safeUsername},</p>
        <p style="${workboardEmailStyles.bodyCopy}"><strong style="color:#3d342c;">${safeInviter}</strong> invited you to join <strong style="color:#3d342c;">${safeLeaderboard}</strong> on Taskboard.</p>
        <table role="presentation" style="width:100%;margin-top:20px;border-collapse:separate;border-spacing:0 14px;">
          <tr>
            <td style="${workboardEmailStyles.statCard}">
              <p style="${workboardEmailStyles.statLabel}">Leaderboard</p>
              <p style="${workboardEmailStyles.statValue}">${safeLeaderboard}</p>
            </td>
          </tr>
          <tr>
            <td style="${workboardEmailStyles.statCard}">
              <p style="${workboardEmailStyles.statLabel}">How it works</p>
              <p style="margin:0;font-size:15px;line-height:1.7;color:#6b5e52;">Your taskboard XP powers your position. Pick an avatar, complete tasks, and see how you stack up.</p>
            </td>
          </tr>
        </table>
        <hr style="${workboardEmailStyles.divider}" />
        <p style="${workboardEmailStyles.bodyCopy};margin-bottom:0;">Sign in with the same email address to accept or decline the invite.</p>
      `,
      footerHtml: `You are receiving this email because ${safeInviter} invited you to a Taskboard leaderboard on ${APP_NAME}.`
    })
  };
};

module.exports = {
  getWelcomeEmailTemplate,
  getBookPurchaseEmailTemplate,
  getLeaderboardInviteEmailTemplate,
  getWorkboardAccessRequestEmailTemplate,
  getWorkboardAccessGrantedEmailTemplate
};
