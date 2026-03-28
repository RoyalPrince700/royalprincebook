import React from 'react';
import { Link } from 'react-router-dom';
import royalPrinceImage from '../assets/royalprince.png';

const authorHighlights = [
  {
    title: 'Mindset Before Title',
    summary: 'Royal built inner conviction and clarity before leadership roles ever became public.'
  },
  {
    title: 'Self-Leadership In Action',
    summary: 'He consistently led by example, taking responsibility first before asking others to follow.'
  },
  {
    title: 'Discipline As A Lifestyle',
    summary: 'Consistency, focus, and repeated personal growth became the foundation for wider influence.'
  },
  {
    title: 'Purpose Under Pressure',
    summary: 'Purpose kept him steady through criticism, pressure, and the weight of real expectations.'
  },
  {
    title: 'From Campus To Beyond',
    summary: 'Campus leadership became a training ground for systems, execution, and service-driven impact.'
  },
  {
    title: 'Impact That Multiplies',
    summary: 'His influence grows by mentoring others and helping new leaders rise with confidence.'
  }
];

const AboutAuthor = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <section className="relative overflow-hidden px-4 pb-16 pt-24 sm:px-6 md:pt-32 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.96),rgba(241,245,249,0.92)_45%,rgba(226,232,240,0.7)_100%)]" />
        <div className="absolute inset-x-0 top-0 h-80 bg-linear-to-b from-white via-white/80 to-transparent" />
        <div className="absolute left-1/2 top-36 h-72 w-72 -translate-x-1/2 rounded-full bg-blue-200/25 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="mx-auto w-full max-w-md lg:max-w-lg">
            <div className="overflow-hidden rounded-[2.5rem] border border-white/70 bg-white/75 p-3 shadow-[0_28px_90px_rgba(15,23,42,0.12)] backdrop-blur">
              <img
                src={royalPrinceImage}
                alt="Royal Prince, author of Leading From Within"
                className="h-full w-full rounded-[2rem] object-cover"
              />
            </div>
          </div>

          <div>
            <span className="inline-flex items-center rounded-full border border-slate-200 bg-white/80 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-600 shadow-sm backdrop-blur">
              About The Author
            </span>
            <h1 className="mt-6 text-4xl font-semibold tracking-[-0.04em] text-slate-950 md:text-6xl">
              Royal Prince
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-relaxed text-slate-600">
              Royal Prince is a leadership practitioner, mentor, and student leader whose journey is
              captured in <em>Leading From Within</em>. He rose from a humble background to serve in multiple
              leadership roles, including Student Union President at the University of Ilorin, where he
              led a student community of over 40,000.
            </p>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-600">
              His message is clear: leadership starts internally. Through mindset transformation,
              self-discipline, purpose, and service, he has consistently built systems, mobilized
              communities, and helped many young people discover their own capacity to lead.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-4xl border border-white/70 bg-white/75 p-5 shadow-sm backdrop-blur">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Leadership</p>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">Built through service, responsibility, and visible example.</p>
              </div>
              <div className="rounded-4xl border border-white/70 bg-white/75 p-5 shadow-sm backdrop-blur">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Focus</p>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">Mindset, discipline, purpose, and measurable impact.</p>
              </div>
              <div className="rounded-4xl border border-white/70 bg-white/75 p-5 shadow-sm backdrop-blur">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Mission</p>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">Helping young people discover the capacity to lead from within.</p>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/all-books"
                className="inline-flex items-center justify-center rounded-full bg-slate-950 px-7 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
              style={{ color: 'white' }}>
                Get The Book
              </Link>
              <Link
                to="/"
                className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white/85 px-7 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-white"
              >
                Back Home
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 text-center">
            <span className="inline-flex items-center rounded-full border border-slate-200 bg-white/80 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-600 shadow-sm backdrop-blur">
              Leadership Journey
            </span>
            <h2 className="mx-auto mt-5 max-w-3xl text-3xl font-semibold tracking-[-0.03em] text-slate-950 md:text-5xl">
              A story of inner growth that became public impact.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-600">
              From Chapter 1 to Chapter 6, the journey shows how private transformation can produce visible leadership.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {authorHighlights.map((highlight, index) => (
              <article
                key={highlight.title}
                className="rounded-4xl border border-white/70 bg-white/80 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)] backdrop-blur transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_60px_rgba(15,23,42,0.1)]"
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                  0{index + 1}
                </p>
                <h3 className="mt-3 text-xl font-semibold tracking-tight text-slate-950">
                  {highlight.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  {highlight.summary}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-6 rounded-[2.5rem] border border-white/70 bg-slate-950 px-6 py-10 text-white shadow-[0_30px_100px_rgba(15,23,42,0.22)] sm:px-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/55">
              Author Mission
            </p>
            <h2 className="mt-4 max-w-2xl text-3xl font-semibold tracking-[-0.03em] md:text-5xl">
              Helping people lead from the inside out.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/70">
              Royal Prince writes and leads with the belief that transformation begins internally. His work is focused on helping readers build courage, clarity, and disciplined action that can shape real lives and communities.
            </p>
          </div>

          <div className="rounded-4xl border border-white/10 bg-white/8 p-6 backdrop-blur">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/55">
              Continue
            </p>
            <h3 className="mt-2 text-2xl font-semibold tracking-tight">
              Discover the book behind the story.
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-white/70">
              Explore <em>Leading From Within</em> and experience the full journey through the author’s lessons and reflections.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/all-books"
                className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-medium text-slate-950 transition hover:bg-slate-100"
              >
                Explore Books
              </Link>
              <Link
                to="/"
                className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 text-sm font-medium text-white transition hover:bg-white/10"
              style={{ color: 'white' }}>
                Back Home
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutAuthor;
