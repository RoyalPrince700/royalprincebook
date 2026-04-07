const AUTH_REDIRECT_STORAGE_KEY = 'auth_redirect_path';

const AUTH_PAGES = new Set(['/login', '/register', '/auth/callback']);

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

export const saveAuthRedirect = (path) => {
  const safePath = normalizeRedirectPath(path);

  if (!safePath) {
    localStorage.removeItem(AUTH_REDIRECT_STORAGE_KEY);
    return;
  }

  localStorage.setItem(AUTH_REDIRECT_STORAGE_KEY, safePath);
};

export const getStoredAuthRedirect = () => (
  normalizeRedirectPath(localStorage.getItem(AUTH_REDIRECT_STORAGE_KEY))
);

export const consumeStoredAuthRedirect = () => {
  const redirectPath = getStoredAuthRedirect();
  localStorage.removeItem(AUTH_REDIRECT_STORAGE_KEY);
  return redirectPath;
};
