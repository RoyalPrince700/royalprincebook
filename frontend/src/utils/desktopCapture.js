const DESKTOP_PORT_KEY = 'desktop_capture_port';
const DESKTOP_STARTED_KEY = 'desktop_capture_started';

export const parseDesktopPort = (value) => {
  if (!/^\d+$/.test(String(value || ''))) return null;
  const port = Number(value);
  if (!Number.isInteger(port) || port < 1024 || port > 65535) return null;
  return port;
};

export const rememberDesktopPort = (value) => {
  const port = parseDesktopPort(value);
  if (!port) return null;
  sessionStorage.setItem(DESKTOP_PORT_KEY, String(port));
  return port;
};

export const peekDesktopPort = () => parseDesktopPort(sessionStorage.getItem(DESKTOP_PORT_KEY));

export const clearDesktopPort = () => {
  sessionStorage.removeItem(DESKTOP_PORT_KEY);
  sessionStorage.removeItem(DESKTOP_STARTED_KEY);
};

export const takeDesktopPort = () => {
  const port = peekDesktopPort();
  clearDesktopPort();
  return port;
};

export const markDesktopSignInStarted = (port) => {
  sessionStorage.setItem(DESKTOP_STARTED_KEY, String(port));
};

export const desktopSignInStarted = (port) =>
  sessionStorage.getItem(DESKTOP_STARTED_KEY) === String(port);
