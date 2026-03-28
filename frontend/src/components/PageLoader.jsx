import React from 'react';

const PageLoader = ({
  title = 'Preparing your page',
  message = 'Loading content with the same clean experience you expect.',
  fullScreen = true,
  minHeightClass = 'min-h-[280px]'
}) => {
  return (
    <div
      className={`relative overflow-hidden bg-slate-50 px-4 ${fullScreen ? 'min-h-screen' : minHeightClass}`}
      role="status"
      aria-live="polite"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.96),rgba(241,245,249,0.92)_45%,rgba(226,232,240,0.72)_100%)]" />
      <div className="absolute inset-x-0 top-0 h-72 bg-linear-to-b from-white via-white/80 to-transparent" />
      <div className="absolute left-1/2 top-28 h-72 w-72 -translate-x-1/2 rounded-full bg-blue-200/30 blur-3xl" />

      <div
        className={`relative flex items-center justify-center py-16 ${
          fullScreen ? 'min-h-screen' : minHeightClass
        }`}
      >
        <div className="w-full max-w-xl rounded-[2rem] border border-white/70 bg-white/80 p-8 text-center shadow-[0_25px_90px_rgba(15,23,42,0.12)] backdrop-blur-xl sm:p-10">
          <span className="inline-flex items-center rounded-full border border-slate-200 bg-white/85 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-600 shadow-sm">
            Loading
          </span>

          <div className="relative mx-auto mt-6 h-20 w-20">
            <div className="absolute inset-0 rounded-full border border-slate-200/80" />
            <div className="absolute inset-2 rounded-full border border-blue-200/90 animate-pulse" />
            <div className="absolute inset-5 rounded-full bg-slate-950 shadow-[0_0_40px_rgba(15,23,42,0.22)]" />
          </div>

          <h2 className="mt-6 text-3xl font-semibold tracking-[-0.03em] text-slate-950 sm:text-4xl">
            {title}
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-slate-600 sm:text-base">
            {message}
          </p>

          <div className="mx-auto mt-8 grid max-w-sm gap-3">
            <div className="h-3 rounded-full bg-slate-200/80 animate-pulse" />
            <div className="h-3 rounded-full bg-slate-200/65 animate-pulse" />
            <div className="h-3 w-2/3 justify-self-center rounded-full bg-blue-100/90 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageLoader;
