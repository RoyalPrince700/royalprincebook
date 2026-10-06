const crypto = require('crypto');

const MAX_AGE_MS = 10 * 60 * 1000;

const toBase64Url = (value) =>
  Buffer.from(value)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');

const fromBase64Url = (value) => {
  const padded = String(value).replace(/-/g, '+').replace(/_/g, '/');
  const pad = padded.length % 4 === 0 ? '' : '='.repeat(4 - (padded.length % 4));
  return Buffer.from(padded + pad, 'base64');
};

const isValidDesktopPort = (port) =>
  Number.isInteger(port) && port >= 1024 && port <= 65535;

const signDesktopState = (port, secret = process.env.JWT_SECRET) => {
  const normalizedPort = Number(port);
  if (!secret) {
    throw new Error('JWT_SECRET is required to start desktop sign-in');
  }
  if (!isValidDesktopPort(normalizedPort)) {
    throw new Error('Invalid desktop port');
  }

  const payload = toBase64Url(
    JSON.stringify({
      port: normalizedPort,
      exp: Date.now() + MAX_AGE_MS
    })
  );
  const signature = toBase64Url(crypto.createHmac('sha256', secret).update(payload).digest());
  return `${payload}.${signature}`;
};

const readDesktopPort = (state, secret = process.env.JWT_SECRET) => {
  try {
    if (!secret || typeof state !== 'string' || !state.includes('.')) return null;

    const [payload, signature] = state.split('.');
    if (!payload || !signature) return null;

    const expected = toBase64Url(crypto.createHmac('sha256', secret).update(payload).digest());
    const actualBuffer = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expected);
    if (
      actualBuffer.length !== expectedBuffer.length ||
      !crypto.timingSafeEqual(actualBuffer, expectedBuffer)
    ) {
      return null;
    }

    const data = JSON.parse(fromBase64Url(payload).toString('utf8'));
    const port = Number(data?.port);
    if (!isValidDesktopPort(port) || !Number.isFinite(data.exp) || Date.now() > data.exp) {
      return null;
    }

    return port;
  } catch (_error) {
    return null;
  }
};

module.exports = {
  isValidDesktopPort,
  signDesktopState,
  readDesktopPort
};
