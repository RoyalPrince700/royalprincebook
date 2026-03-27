import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Hero from '../components/Hero';

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
  const launchPrice = 2000;
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const currentPrice = leadingFromWithinBook?.price ?? 1000;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-200">
      <Hero currentPrice={currentPrice} launchPrice={launchPrice} />

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
            <p className="text-sm font-medium text-blue-100">Special prelaunch price</p>
            <p className="mt-1 text-4xl font-bold">NGN {currentPrice.toLocaleString()}</p>
            <p className="mt-2 text-sm text-blue-100">
              Buy now for NGN {currentPrice.toLocaleString()}. After launch, the price goes up to NGN {launchPrice.toLocaleString()}.
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
            this book is for you. Start with this first edition of <em>Leadership From Within</em> and build
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
