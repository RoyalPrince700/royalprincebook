import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import leadingFromWithinImage from '../assets/leadingfromwithin.jpg';

const chapterHighlights = [
  {
    title: 'Chapter 1 - The Mindset Shift',
    summary: 'Build the inner belief that changes your life trajectory before titles ever come.'
  },
  {
    title: 'Chapter 2 - Self-Leadership',
    summary: 'Lead yourself first, then inspire people through visible sacrifice and action.'
  },
  {
    title: 'Chapter 3 - Discipline',
    summary: 'Win through daily consistency, especially when the work feels repetitive or hard.'
  },
  {
    title: 'Chapter 4 - Purpose',
    summary: 'Discover your "why" and use it as direction when pressure and criticism increase.'
  },
  {
    title: 'Chapter 5 - Beyond Campus',
    summary: 'Turn student leadership lessons into real-world systems, trust, and execution.'
  },
  {
    title: 'Chapter 6 - Lasting Impact',
    summary: 'Multiply your influence by building people, not just solving problems alone.'
  }
];

const Home = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAboutBook, setShowAboutBook] = useState(false);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get('/books');
        setBooks(response.data.books || []);
      } catch (error) {
        console.error('Failed to fetch books:', error);
        setBooks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const leadingFromWithinBook = useMemo(
    () =>
      books.find((book) =>
        (book.title || '').toLowerCase().includes('leading from within')
      ),
    [books]
  );

  const currentPrice = leadingFromWithinBook?.price ?? 2000;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-200">
      <section className="relative overflow-hidden px-4 pb-20 pt-28 sm:px-6 lg:px-8">
        <div className="absolute inset-x-0 -top-24 h-72 bg-linear-to-b from-blue-100/80 via-indigo-100/40 to-transparent blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
          <div>
            <span className="inline-flex items-center rounded-full border border-blue-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-blue-700">
              New Release • First Book
            </span>
            <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight text-slate-900 md:text-6xl">
              Lead your life from the inside out.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-600">
              <strong>Leading From Within</strong> is a practical leadership book built
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
              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-7 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-100"
              >
                Continue with Google
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 -z-10 rounded-4xl bg-linear-to-br from-blue-100 via-indigo-100 to-white blur-2xl" />
            <div className="mx-auto max-w-md rounded-4xl border border-white/70 bg-white/80 p-4 shadow-2xl backdrop-blur">
              <img
                src={leadingFromWithinImage}
                alt="Leading From Within Book Cover"
                className="w-full rounded-2xl object-cover"
              />
            </div>
            <div className="mx-auto mt-5 max-w-md">
              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setShowAboutBook((prev) => !prev)}
                  className="inline-flex w-full items-center justify-center rounded-full border border-blue-200 bg-white px-6 py-3 text-sm font-semibold text-blue-700 transition hover:border-blue-300 hover:bg-blue-50"
                >
                  {showAboutBook ? 'Hide About the Book' : 'About the Book'}
                </button>
                <Link
                  to="/about-author"
                  className="inline-flex w-full items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white! transition hover:bg-slate-700 hover:text-white!"
                >
                  About Author
                </Link>
              </div>

              {showAboutBook && (
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
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
                What readers will gain
              </h2>
              <p className="mt-2 max-w-2xl text-slate-600">
                Chapters 1 to 6 deliver clear lessons with practical action points readers can apply immediately.
              </p>
            </div>
            <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-white">
              6 Key Lessons
            </span>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {chapterHighlights.map((chapter) => (
              <article
                key={chapter.title}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <h3 className="text-lg font-semibold text-slate-900">{chapter.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{chapter.summary}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 rounded-3xl border border-blue-100 bg-linear-to-r from-blue-600 to-indigo-600 p-8 text-white lg:grid-cols-[1.25fr_1fr] lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-100">Why this book stands out</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">
              Real experiences. Actionable principles. Clear transformation path.
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-blue-100">
              This is not motivational talk without structure. It is a practical guide that shows how mindset,
              self-leadership, and disciplined action can move a reader from confusion to purpose-driven impact.
            </p>
          </div>
          <div className="rounded-2xl bg-white/10 p-6 backdrop-blur">
            <p className="text-sm font-medium text-blue-100">Special launch price</p>
            <p className="mt-1 text-4xl font-bold">NGN {currentPrice.toLocaleString()}</p>
            <p className="mt-2 text-sm text-blue-100">
              Perfect for students, young professionals, and anyone ready to lead with intention.
            </p>
            <Link
              to="/all-books"
              className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
            >
              Get Your Copy
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Author Note</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
            My first book, written to help you lead boldly.
          </h2>
          <p className="mx-auto mt-5 max-w-3xl text-base leading-relaxed text-slate-600">
            If you have ever felt like your background, fear, or limited resources are holding you back,
            this book is for you. Start with this first edition of <em>Leading From Within</em> and build
            a stronger mindset, stronger discipline, and stronger leadership from the inside.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              to="/all-books"
              className="inline-flex items-center justify-center rounded-full bg-slate-900 px-8 py-3 text-sm font-semibold text-white! transition hover:bg-slate-700 hover:text-white!"
            >
              Buy at NGN {currentPrice.toLocaleString()}
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center rounded-full border border-slate-300 px-8 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
                Sign In with Google
            </Link>
          </div>
        </div>
      </section>

      {loading && (
        <div className="pb-10 text-center text-sm text-slate-500">
          Loading latest book details...
        </div>
      )}
    </div>
  );
};

export default Home;
