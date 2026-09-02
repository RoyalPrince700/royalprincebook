const AUTH_REDIRECT_STORAGE_KEY = 'auth_redirect_path';

const AUTH_PAGES = new Set(['/login', '/register', '/auth/callback']);

export const DEFAULT_AUTH_REDIRECT = '/';

export const getRedirectPath = (locationLike) => {
  if (!locationLike?.pathname) {
    return '';
  }

  const path = `${locationLike.pathname}${locationLike.search || ''}${locationLike.hash || ''}`;
  return AUTH_PAGES.has(locationLike.pathname) ? '' : path;
};

export const normalizeRedirectPath = (path) => {
  if (!path || typeof path !== 'string' || !path.startsWith('/')) {
    return '';
  }

  const pathname = path.split('?')[0].split('#')[0];
  return AUTH_PAGES.has(pathname) ? '' : path;
};

const readStoredRedirect = () => (
  normalizeRedirectPath(localStorage.getItem(AUTH_REDIRECT_STORAGE_KEY)) ||
  normalizeRedirectPath(sessionStorage.getItem(AUTH_REDIRECT_STORAGE_KEY))
);

export const saveAuthRedirect = (path) => {
  const safePath = normalizeRedirectPath(path) || readStoredRedirect();

  if (!safePath) {
    localStorage.removeItem(AUTH_REDIRECT_STORAGE_KEY);
    sessionStorage.removeItem(AUTH_REDIRECT_STORAGE_KEY);
    return;
  }

  localStorage.setItem(AUTH_REDIRECT_STORAGE_KEY, safePath);
  sessionStorage.setItem(AUTH_REDIRECT_STORAGE_KEY, safePath);
};

export const getStoredAuthRedirect = () => readStoredRedirect();

export const resolveAuthRedirect = (fallback = DEFAULT_AUTH_REDIRECT) => (
  readStoredRedirect() || fallback
);

export const clearAuthRedirect = () => {
  localStorage.removeItem(AUTH_REDIRECT_STORAGE_KEY);
  sessionStorage.removeItem(AUTH_REDIRECT_STORAGE_KEY);
};

export const consumeStoredAuthRedirect = (fallback = DEFAULT_AUTH_REDIRECT) => {
  const redirectPath = resolveAuthRedirect(fallback);
  clearAuthRedirect();
  return redirectPath;
};
