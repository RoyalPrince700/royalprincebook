import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const authErrors = {
  auth_failed: 'Google sign-in failed. Please try again.',
  no_token: 'Google sign-in did not complete. Please try again.'
};

const Login = () => {
  const { loginWithGoogle } = useAuth();
  const location = useLocation();
  const errorCode = new URLSearchParams(location.search).get('error');
  const error = authErrors[errorCode] || '';

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-50 px-4 py-10 text-slate-900 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.96),rgba(241,245,249,0.92)_45%,rgba(226,232,240,0.72)_100%)]" />
      <div className="absolute inset-x-0 top-0 h-80 bg-linear-to-b from-white via-white/80 to-transparent" />
      <div className="absolute left-1/2 top-28 h-72 w-72 -translate-x-1/2 rounded-full bg-blue-200/25 blur-3xl" />

      <div className="relative mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="hidden lg:block">
          <span className="inline-flex items-center rounded-full border border-slate-200 bg-white/80 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-600 shadow-sm backdrop-blur">
            RoyalPrinceBook
          </span>
          <h1 className="mt-6 max-w-2xl text-6xl font-semibold tracking-[-0.05em] text-slate-950">
            Continue your reading with a cleaner, premium experience.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-600">
            Sign in with Google to access your library, continue reading, and stay connected to your books.
          </p>
          <div className="mt-10 grid max-w-2xl gap-4 sm:grid-cols-2">
            <div className="rounded-4xl border border-white/70 bg-white/75 p-5 shadow-sm backdrop-blur">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Access</p>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Open your purchased books instantly and continue where you left off.
              </p>
            </div>
            <div className="rounded-4xl border border-white/70 bg-white/75 p-5 shadow-sm backdrop-blur">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Security</p>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Google sign-in keeps access simple, familiar, and secure.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-xl rounded-[2.5rem] border border-white/70 bg-white/85 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.1)] backdrop-blur sm:p-8">
          <div className="text-center">
            <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-600">
              Sign In
            </span>
            <h2 className="mt-5 text-4xl font-semibold tracking-[-0.04em] text-slate-950">
              Welcome back
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-slate-600 sm:text-base">
              Sign in with Google to continue reading and manage your premium library.
            </p>
          </div>

          {error && (
            <div className="mt-6 flex items-start gap-3 rounded-3xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <span>{error}</span>
            </div>
          )}

          <div className="mt-8 rounded-4xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
              Continue with Google
            </p>
            <button
              type="button"
              onClick={loginWithGoogle}
              className="mt-4 inline-flex w-full items-center justify-center gap-3 rounded-full bg-slate-950 px-6 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="#EA4335" d="M12 10.2v3.9h5.4c-.2 1.3-1.5 3.9-5.4 3.9-3.2 0-5.9-2.7-5.9-6s2.7-6 5.9-6c1.8 0 3 .8 3.7 1.4l2.5-2.4C16.6 3.5 14.5 2.5 12 2.5 6.8 2.5 2.6 6.7 2.6 12S6.8 21.5 12 21.5c6.9 0 9.1-4.8 9.1-7.3 0-.5-.1-.9-.1-1.3H12Z" />
              </svg>
              Continue with Google
            </button>
            <p className="mt-4 text-center text-sm text-slate-500">
              We currently support Google authentication only.
            </p>
          </div>

          <div className="mt-8 text-center text-sm text-slate-500">
            New here?{' '}
            <Link to="/register" className="font-medium text-slate-900">
              Sign up with Google
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Login;