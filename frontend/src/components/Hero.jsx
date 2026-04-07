import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import leadingFromWithinImage from '../assets/leadershipfromwithin.jpg';

const Hero = ({ currentPrice, launchPrice }) => {
  const [showAboutBook, setShowAboutBook] = useState(false);
  const isPrelaunchPricing = currentPrice < launchPrice;

  return (
    <section className="relative overflow-hidden bg-slate-50 px-4 pb-20 pt-20 sm:px-6 md:pt-28 lg:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.96),rgba(241,245,249,0.92)_45%,rgba(226,232,240,0.7)_100%)]" />
      <div className="absolute inset-x-0 top-0 h-80 bg-linear-to-b from-white via-white/80 to-transparent" />
      <div className="absolute left-1/2 top-40 h-72 w-72 -translate-x-1/2 rounded-full bg-blue-200/30 blur-3xl" />

      <div className="relative mx-auto max-w-6xl text-center">
        <span className="inline-flex items-center rounded-full border border-slate-200 bg-white/80 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-600 shadow-sm backdrop-blur">
          First Book Release
        </span>

        <h1 className="mx-auto mt-5 max-w-4xl text-4xl font-semibold tracking-[-0.04em] text-slate-950 sm:mt-6 sm:text-6xl lg:text-7xl">
          Leadership that starts within.
        </h1>

        <p className="mx-auto mt-5 hidden max-w-2xl text-base leading-relaxed text-slate-600 sm:block sm:text-lg">
          <strong>Leadership From Within</strong> is a modern, practical guide to mindset,
          discipline, purpose, and becoming the kind of leader people can trust.
        </p>

        <div className="mt-8 hidden flex-col items-center justify-center gap-3 sm:flex sm:flex-row">
          <Link
            to="/all-books"
            className="inline-flex min-w-40 items-center justify-center rounded-full bg-slate-950 px-8 py-3 text-sm font-medium text-white! transition hover:bg-slate-800 hover:text-white!"
          >
            Order Now
          </Link>
          <button
            type="button"
            onClick={() => setShowAboutBook((prev) => !prev)}
            className="inline-flex min-w-40 items-center justify-center rounded-full border border-white/60 bg-white/35 px-8 py-3 text-sm font-medium text-slate-900 shadow-[0_10px_30px_rgba(15,23,42,0.08)] backdrop-blur-xl transition hover:border-white/80 hover:bg-white/45"
          >
            {showAboutBook ? 'Hide Details' : 'Learn More'}
          </button>
        </div>

        <div className="mt-4 hidden items-center justify-center gap-3 text-sm text-slate-500 sm:flex">
          {isPrelaunchPricing && (
            <span className="text-slate-400 line-through">
              NGN {launchPrice.toLocaleString()}
            </span>
          )}
          <span>
            {isPrelaunchPricing ? 'Prelaunch price' : 'Available now'}: NGN {currentPrice.toLocaleString()}
          </span>
          {isPrelaunchPricing && (
            <>
              <span className="text-slate-300">|</span>
              <span>Standard price is NGN {launchPrice.toLocaleString()}.</span>
            </>
          )}
        </div>

        <div className="mt-8 sm:mt-14">
          <div className="relative mx-auto max-w-4xl">
            <div className="absolute inset-x-10 -bottom-6 h-24 rounded-full bg-slate-900/15 blur-3xl" />
            <div className="mx-auto max-w-sm rounded-4xl border border-white/70 bg-white/70 p-3 shadow-[0_25px_90px_rgba(15,23,42,0.16)] backdrop-blur-xl sm:max-w-md lg:max-w-lg">
              <div className="relative overflow-hidden rounded-3xl">
                <img
                  src={leadingFromWithinImage}
                  alt="Leadership From Within Book Cover"
                  className="h-[420px] w-full object-cover sm:h-[500px] lg:h-[580px]"
                />
                
                {/* Overlay content - now visible on ALL screen sizes (mobile + desktop) */}
                {showAboutBook && (
                  <div className="absolute inset-0 z-20 flex items-end sm:items-center sm:justify-center bg-slate-950/45 p-4 sm:p-6">
                    <div className="max-h-full w-full overflow-y-auto rounded-[1.75rem] border border-white/30 bg-white/15 p-5 text-left text-white shadow-[0_20px_60px_rgba(15,23,42,0.25)] backdrop-blur-2xl sm:max-w-2xl sm:p-8">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/70">
                            About The Book
                          </p>
                          <h3 className="mt-2 text-xl font-semibold tracking-tight">
                            Leadership From Within
                          </h3>
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowAboutBook(false)}
                          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/30 bg-white/10 text-lg text-white backdrop-blur-xl transition hover:bg-white/20"
                          aria-label="Close details"
                        >
                          x
                        </button>
                      </div>
                      <p className="mt-4 text-sm leading-relaxed text-white/85">
                        <em>Leadership From Within</em> is a call to wake up and take control
                        of your life. It begins from a place many people know too well,
                        starting small, unseen, and dealing with the struggles that happen
                        inside.
                      </p>
                      <p className="mt-3 text-sm leading-relaxed text-white/75">
                        From there, the author challenges weak thinking and replaces it with
                        discipline and self-control. It shows that leadership is first shaped
                        in private, through the choices you make every day.
                      </p>
                      <p className="mt-3 text-sm leading-relaxed text-white/75">
                        At its core, <em>Leadership From Within</em> reminds you that
                        leadership is not something you claim. It is something you build
                        quietly within yourself long before anyone else sees it.
                      </p>
                      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                        <Link
                          to="/about-author"
                          className="inline-flex items-center justify-center rounded-full border border-white/30 bg-white/10 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/20"
                        >
                          About Author
                        </Link>
                        <Link
                          to="/all-books"
                          className="inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-medium text-slate-950 transition hover:bg-slate-100"
                        >
                          Buy Your Copy
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Mobile-only bottom controls - hidden on desktop */}
                <div className="absolute inset-x-0 bottom-0 z-10 bg-linear-to-t from-slate-950/85 via-slate-950/45 to-transparent p-4 pt-20 sm:hidden">
                  <div className="grid grid-cols-2 gap-3">
                    <Link
                      to="/all-books"
                      className="inline-flex items-center justify-center rounded-full bg-white px-4 py-3 text-sm font-medium text-slate-950 transition hover:bg-slate-100"
                    >
                      Order Now
                    </Link>
                    <button
                      type="button"
                      onClick={() => setShowAboutBook((prev) => !prev)}
                      className="inline-flex items-center justify-center rounded-full border border-white/35 bg-white/12 px-4 py-3 text-sm font-medium text-white shadow-[0_10px_30px_rgba(15,23,42,0.16)] backdrop-blur-xl transition hover:bg-white/20"
                    >
                      {showAboutBook ? 'Hide Details' : 'Learn More'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mx-auto mt-8 grid max-w-4xl gap-4 text-left md:grid-cols-3">
            <div className="rounded-3xl border border-white/70 bg-white/70 p-5 shadow-sm backdrop-blur">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Price</p>
              <div className="mt-2 flex flex-wrap items-baseline gap-2">
                {isPrelaunchPricing && (
                  <span className="text-base font-medium text-slate-400 line-through">
                    NGN {launchPrice.toLocaleString()}
                  </span>
                )}
                <p className="text-3xl font-semibold tracking-tight text-slate-950">
                  NGN {currentPrice.toLocaleString()}
                </p>
                {isPrelaunchPricing && (
                  <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700">
                    Prelaunch
                  </span>
                )}
              </div>
            </div>

            <div className="rounded-3xl border border-white/70 bg-white/70 p-5 shadow-sm backdrop-blur">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Built For</p>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Students, young professionals, and emerging leaders who want practical direction.
              </p>
            </div>

            <div className="rounded-3xl border border-white/70 bg-white/70 p-5 shadow-sm backdrop-blur">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Focus</p>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Mindset, self-leadership, discipline, and lasting impact in everyday life.
              </p>
            </div>
          </div>
        </div>

        {/* REMOVED: Desktop-only about section that appeared below the book */}
        {/* This content now lives exclusively in the overlay inside the book image */}
      </div>
    </section>
  );
};

export default Hero;