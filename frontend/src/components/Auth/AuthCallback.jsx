import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { consumeStoredAuthRedirect, getStoredAuthRedirect } from '../../utils/authRedirect';

const AuthCallback = () => {
  const { completeGoogleAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    const finishGoogleAuth = async () => {
      const result = await completeGoogleAuth(token);

      if (result.success) {
        const redirectPath = consumeStoredAuthRedirect() || '/dashboard';
        navigate(redirectPath, { replace: true });
        return;
      }

      const redirectPath = getStoredAuthRedirect();
      const loginUrl = redirectPath
        ? `/login?error=auth_failed&redirect=${encodeURIComponent(redirectPath)}`
        : '/login?error=auth_failed';
      navigate(loginUrl, { replace: true });
    };

    finishGoogleAuth();
  }, [completeGoogleAuth, location.search, navigate]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-50 px-4 py-10 text-slate-900 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.96),rgba(241,245,249,0.92)_45%,rgba(226,232,240,0.72)_100%)]" />
      <div className="absolute inset-x-0 top-0 h-80 bg-linear-to-b from-white via-white/80 to-transparent" />
      <div className="absolute left-1/2 top-28 h-72 w-72 -translate-x-1/2 rounded-full bg-blue-200/25 blur-3xl" />

      <div className="relative mx-auto flex min-h-[calc(100vh-5rem)] max-w-2xl items-center justify-center">
        <div className="w-full rounded-[2.5rem] border border-white/70 bg-white/85 p-8 text-center shadow-[0_24px_80px_rgba(15,23,42,0.1)] backdrop-blur">
          <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-600">
            Google Auth
          </span>
          <div className="mx-auto mt-6 h-14 w-14 animate-pulse rounded-full border border-slate-200 bg-slate-100" />
          <h2 className="mt-6 text-4xl font-semibold tracking-[-0.04em] text-slate-950">
            Completing sign in
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-slate-600 sm:text-base">
            Please wait while we finish your Google authentication and return you to your page.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthCallback;
