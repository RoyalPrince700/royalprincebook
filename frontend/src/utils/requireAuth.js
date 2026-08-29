import { saveAuthRedirect } from './authRedirect';

export const buildLoginPath = (redirectPath = '') => {
  const path =
    redirectPath ||
    `${window.location.pathname}${window.location.search}${window.location.hash}`;
  saveAuthRedirect(path);
  return `/login?redirect=${encodeURIComponent(path)}`;
};

export const redirectToLogin = (navigate, redirectPath = '') => {
  navigate(buildLoginPath(redirectPath));
};
