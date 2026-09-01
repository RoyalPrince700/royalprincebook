/**
 * Taskboard display name — defaults from email local-part (e.g. joseph@gmail.com → Joseph).
 */

export const nameFromEmail = (email) => {
  if (!email || typeof email !== 'string') return '';

  const prefix = email.split('@')[0] || '';
  const cleaned = prefix.replace(/[^a-zA-Z0-9._-]/g, '').trim();
  if (!cleaned) return 'Player';

  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
};

export const getTaskboardDisplayName = (user) => {
  if (!user) return 'Player';

  const username = String(user.username || '').trim();
  if (username) return username;

  return nameFromEmail(user.email);
};
