import React from 'react';
import { Link } from 'react-router-dom';
import royalPrinceImage from '../assets/royalprince.png';

const AboutAuthor = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <section className="px-4 pb-16 pt-28 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-center">
          <div className="mx-auto w-full max-w-md">
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
              <img
                src={royalPrinceImage}
                alt="Royal Prince, author of Leading From Within"
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-700">
              About The Author
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
              Royal Prince
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-relaxed text-slate-600">
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

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/all-books"
                className="inline-flex items-center justify-center rounded-full bg-blue-600 px-7 py-3 text-sm font-semibold text-white! transition hover:bg-blue-700 hover:text-white!"
              >
                Get The Book
              </Link>
              <Link
                to="/"
                className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-7 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Back Home
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm md:p-10">
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900">Leadership Journey</h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-600">
            From Chapter 1 to Chapter 6, this journey shows how inner growth can produce real public impact.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <article className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <h3 className="text-base font-semibold text-slate-900">Mindset Before Title</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Royal built the belief to become different long before he held any office.
              </p>
            </article>

            <article className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <h3 className="text-base font-semibold text-slate-900">Self-Leadership In Action</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                He chose to lead by example, taking responsibility first and inspiring others to follow.
              </p>
            </article>

            <article className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <h3 className="text-base font-semibold text-slate-900">Discipline As A Lifestyle</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Through consistency and focus, he developed skills that later shaped his leadership outcomes.
              </p>
            </article>

            <article className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <h3 className="text-base font-semibold text-slate-900">Purpose Under Pressure</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Purpose helped him stay steady through criticism, stress, and high expectations.
              </p>
            </article>

            <article className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <h3 className="text-base font-semibold text-slate-900">From Campus To Beyond</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Campus leadership became a training ground for wider execution, systems, and service.
              </p>
            </article>

            <article className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <h3 className="text-base font-semibold text-slate-900">Impact That Multiplies</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                He scaled impact by teaching, mentoring, and raising new leaders who carry the vision forward.
              </p>
            </article>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutAuthor;
