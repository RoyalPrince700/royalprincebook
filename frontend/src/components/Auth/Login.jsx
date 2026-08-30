import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import ContentPageShell from '../ContentPageShell';
import BrandMark from '../BrandMark';
import { getRedirectPath, normalizeRedirectPath } from '../../utils/authRedirect';

const authErrors = {
  auth_failed: 'Google sign-in failed. Please try again.',
  no_token: 'Google sign-in did not complete. Please try again.'
};

const Login = () => {
  const { loginWithGoogle } = useAuth();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const errorCode = searchParams.get('error');
  const error = authErrors[errorCode] || '';
  const redirectPath =
    normalizeRedirectPath(searchParams.get('redirect')) ||
    normalizeRedirectPath(getRedirectPath(location.state?.from));
  const registerHref = redirectPath
    ? `/register?redirect=${encodeURIComponent(redirectPath)}`
    : '/register';

  return (
    <ContentPageShell>
      <div className="pf-login-shell relative min-h-screen overflow-hidden px-4 py-10 sm:px-6 lg:px-8">
        <div className="pf-hero-bg" aria-hidden="true">
          <div className="pf-hero-gradient" />
          <div className="pf-hero-grid" />
        </div>

        <div className="pf-login-content relative mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="hidden lg:block">
            <span className="pf-eyebrow pf-eyebrow-gold">Platform</span>
            <h1 className="pf-login-aside-title mt-6 max-w-2xl text-6xl font-semibold tracking-[-0.05em]">
              One place for my work, ideas, and tools.
            </h1>
            <p className="pf-login-muted mt-5 max-w-xl text-lg leading-relaxed">
              Sign in with Google to explore my portfolio, follow the projects I am building, read my
              books and blog, and use tools like the taskboard and noteboard.
            </p>
            <div className="mt-10 grid max-w-2xl gap-4 sm:grid-cols-2">
              <div className="pf-login-card rounded-4xl p-5">
                <p className="pf-login-label">Discover</p>
                <p className="pf-login-muted mt-2 text-sm leading-relaxed">
                  Browse my portfolio, active projects, published books, and writing in one unified
                  experience.
                </p>
              </div>
              <div className="pf-login-card rounded-4xl p-5">
                <p className="pf-login-label">Create &amp; Organize</p>
                <p className="pf-login-muted mt-2 text-sm leading-relaxed">
                  Access the taskboard and noteboard to plan, visualize, and capture ideas.
                </p>
              </div>
            </div>
          </section>

          <section className="pf-login-panel mx-auto w-full max-w-xl rounded-[2.5rem] p-6 sm:p-8">
            <div className="text-center">
              <Link to="/" className="pf-login-brand inline-flex" aria-label="Royal Prince Hub home">
                <BrandMark className="pf-login-brand-mark" />
              </Link>
              <span className="pf-login-badge pf-login-badge-inner">Sign In</span>
              <h2 className="pf-login-title mt-5 text-4xl font-semibold tracking-[-0.04em]">
                Welcome back
              </h2>
              <p className="pf-login-muted mx-auto mt-3 max-w-md text-sm leading-relaxed sm:text-base">
                Sign in with Google to access your account across books, blog, taskboard, and more.
              </p>
            </div>

            {error && (
              <div className="pf-alert-error mt-6 flex items-start gap-3 px-4 py-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <span>{error}</span>
              </div>
            )}

            <div className="pf-login-google-box mt-8 rounded-4xl p-5">
              <p className="pf-login-label">Continue with Google</p>
              <button
                type="button"
                onClick={() => loginWithGoogle(redirectPath)}
                className="pf-btn pf-btn-primary mt-4 inline-flex w-full items-center justify-center gap-3 px-6 py-3"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="#EA4335" d="M12 10.2v3.9h5.4c-.2 1.3-1.5 3.9-5.4 3.9-3.2 0-5.9-2.7-5.9-6s2.7-6 5.9-6c1.8 0 3 .8 3.7 1.4l2.5-2.4C16.6 3.5 14.5 2.5 12 2.5 6.8 2.5 2.6 6.7 2.6 12S6.8 21.5 12 21.5c6.9 0 9.1-4.8 9.1-7.3 0-.5-.1-.9-.1-1.3H12Z" />
                </svg>
                Continue with Google
              </button>
              <p className="pf-login-note mt-4 text-center text-sm">
                We currently support Google authentication only.
              </p>
            </div>

            <div className="pf-login-note mt-8 text-center text-sm">
              New here?{' '}
              <Link to={registerHref} className="pf-auth-link font-medium">
                Sign up with Google
              </Link>
            </div>
          </section>
        </div>
      </div>
    </ContentPageShell>
  );
};

export default Login;
