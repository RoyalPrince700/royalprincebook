import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import leadingFromWithinImage from '../assets/Leadershipfromwithin.jpg';

const Hero = ({ currentPrice }) => {
  const [showDesktopAboutBook, setShowDesktopAboutBook] = useState(false);
  const [showMobileAboutBook, setShowMobileAboutBook] = useState(false);

  return (
    <section className="relative overflow-hidden px-4 pb-20 pt-28 sm:px-6 lg:px-8">
      <div className="absolute inset-x-0 -top-24 h-72 bg-linear-to-b from-blue-100/80 via-indigo-100/40 to-transparent blur-3xl" />
      <div className="relative mx-auto hidden max-w-7xl items-center gap-12 lg:grid lg:grid-cols-2">
        <div>
          <span className="inline-flex items-center rounded-full border border-blue-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-blue-700">
            New Release • First Book
          </span>
          <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight text-slate-900 md:text-6xl">
            Lead your life from the inside out.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-600">
            <strong>Leadership From Within</strong> is a practical leadership book built
            from real student leadership experience. It helps readers develop mindset,
            discipline, purpose, and the courage to create measurable impact.
          </p>

          <div className="mt-8 flex flex-wrap items-end gap-6">
            <div>
              <p className="text-sm text-slate-500">Price</p>
              <p className="text-4xl font-bold text-slate-900">NGN {currentPrice.toLocaleString()}</p>
            </div>
            <p className="max-w-xs text-sm text-slate-500">
              One-time purchase. Read instantly after payment.
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/all-books"
              className="inline-flex items-center justify-center rounded-full bg-blue-600 px-7 py-3 text-sm font-semibold text-white! transition hover:bg-blue-700 hover:text-white!"
            >
              Buy Now
            </Link>
            {/* <Link
              to="/login"
              className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-7 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-100"
            >
              Continue with Google
            </Link> */}
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 -z-10 rounded-4xl bg-linear-to-br from-blue-100 via-indigo-100 to-white blur-2xl" />
          <div className="mx-auto max-w-md rounded-4xl border border-white/70 bg-white/80 p-4 shadow-2xl backdrop-blur">
            <img
              src={leadingFromWithinImage}
              alt="Leading From Within Book Cover"
              className="h-[520px] w-full rounded-2xl object-cover"
            />
          </div>
          <div className="mx-auto mt-5 max-w-md">
            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setShowDesktopAboutBook((prev) => !prev)}
                className="inline-flex w-full items-center justify-center rounded-full border border-blue-200 bg-white px-6 py-3 text-sm font-semibold text-blue-700 transition hover:border-blue-300 hover:bg-blue-50"
              >
                {showDesktopAboutBook ? 'Hide About the Book' : 'About the Book'}
              </button>
              <Link
                to="/about-author"
                className="inline-flex w-full items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white! transition hover:bg-slate-700 hover:text-white!"
              >
                About Author
              </Link>
            </div>

            {showDesktopAboutBook && (
              <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900">About Leading From Within</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  <em>Leading From Within</em> is a deeply personal and practical leadership journey. In Chapters 1
                  to 6, the author moves from humble beginnings and a mindset shift, to self-leadership, discipline,
                  and purpose-driven action. The book shows how growth starts internally before it becomes visible
                  externally.
                </p>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  Readers will discover how consistency builds confidence, how purpose gives direction under pressure,
                  and how service transforms influence into lasting impact. This is more than inspiration: each chapter
                  includes practical lessons that help students, young professionals, and aspiring leaders take bold,
                  measurable steps in real life.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile */}

      <div className="relative mx-auto max-w-7xl lg:hidden">
        <div className="text-center">
          <span className="inline-flex items-center rounded-full border border-blue-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-blue-700">
            New Release • First Book
          </span>
          <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight text-slate-900">
            Lead your life from the inside out.
          </h1>
           <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-slate-600">
            <strong>Leadership From Within</strong> is a practical leadership book built
            from real student leadership experience. It helps readers develop mindset,
            discipline, purpose, and the courage to create measurable impact.
          </p> 
        </div>

        <div className="relative mx-auto mt-10 max-w-sm">
          <div className="absolute inset-0 -z-10 rounded-4xl bg-linear-to-br from-blue-100 via-indigo-100 to-white blur-2xl" />
          <div className="rounded-4xl border border-white/70 bg-white/80 p-4 shadow-2xl backdrop-blur">
            <img
              src={leadingFromWithinImage}
              alt="Leading From Within Book Cover"
              className="h-[460px] w-full rounded-2xl object-cover"
            />
          </div>
        </div>

        <div className="mx-auto mt-8 max-w-md">
          <div className="text-center">
            <p className="text-sm text-slate-500">Price</p>
            <p className="text-4xl font-bold text-slate-900">NGN {currentPrice.toLocaleString()}</p>
            <p className="mx-auto mt-2 max-w-xs text-sm text-slate-500">
              One-time purchase. Read instantly after payment.
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-3">
            <Link
              to="/all-books"
              className="inline-flex items-center justify-center rounded-full bg-blue-600 px-7 py-3 text-sm font-semibold text-white! transition hover:bg-blue-700 hover:text-white!"
            >
              Buy Now
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-7 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-100"
            >
              Continue with Google
            </Link>
          </div>

          <div className="mt-5 grid gap-3">
            <button
              type="button"
              onClick={() => setShowMobileAboutBook((prev) => !prev)}
              className="inline-flex w-full items-center justify-center rounded-full border border-blue-200 bg-white px-6 py-3 text-sm font-semibold text-blue-700 transition hover:border-blue-300 hover:bg-blue-50"
            >
              {showMobileAboutBook ? 'Hide About the Book' : 'About the Book'}
            </button>
            <Link
              to="/about-author"
              className="inline-flex w-full items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white! transition hover:bg-slate-700 hover:text-white!"
            >
              About Author
            </Link>
          </div>

          {showMobileAboutBook && (
            <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">About Leading From Within</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                <em>Leading From Within</em> is a deeply personal and practical leadership journey. In Chapters 1
                to 6, the author moves from humble beginnings and a mindset shift, to self-leadership, discipline,
                and purpose-driven action. The book shows how growth starts internally before it becomes visible
                externally.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                Readers will discover how consistency builds confidence, how purpose gives direction under pressure,
                and how service transforms influence into lasting impact. This is more than inspiration: each chapter
                includes practical lessons that help students, young professionals, and aspiring leaders take bold,
                measurable steps in real life.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;
