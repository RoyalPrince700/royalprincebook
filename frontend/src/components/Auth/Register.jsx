import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Register = () => {
  const { loginWithGoogle } = useAuth();

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
            Start your account with a simpler, premium entry point.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-600">
            Create your account with Google and step directly into a cleaner reading and library experience.
          </p>
          <div className="mt-10 grid max-w-2xl gap-4 sm:grid-cols-2">
            <div className="rounded-4xl border border-white/70 bg-white/75 p-5 shadow-sm backdrop-blur">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Fast Setup</p>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                One Google account gives you immediate access to sign up and sign in.
              </p>
            </div>
            <div className="rounded-4xl border border-white/70 bg-white/75 p-5 shadow-sm backdrop-blur">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Library Ready</p>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Save your purchases, continue reading, and manage your account in one place.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-xl rounded-[2.5rem] border border-white/70 bg-white/85 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.1)] backdrop-blur sm:p-8">
          <div className="text-center">
            <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-600">
              Sign Up
            </span>
            <h2 className="mt-5 text-4xl font-semibold tracking-[-0.04em] text-slate-950">
              Create your account
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-slate-600 sm:text-base">
              Use Google to create your account and get started immediately.
            </p>
          </div>

          <div className="mt-8 rounded-4xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
              Start with Google
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
              Your Google account will be used for both sign up and sign in.
            </p>
          </div>

          <div className="mt-8 text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-slate-900">
              Sign in with Google
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Register;