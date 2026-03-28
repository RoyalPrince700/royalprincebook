import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Hero from '../components/Hero';
import PageLoader from '../components/PageLoader';
import adeyemiAvatar from '../assets/adeyemi.jpg';
import francisAvatar from '../assets/francis.jpg';
import favourAvatar from '../assets/favour.png';

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

const testimonials = [
  {
    name: 'Adeyemi Favour',
    role: 'Mobile Developer',
    avatar: adeyemiAvatar,
    quote:
      'The book is so practical and relatable, they are principles/actions point which when engaged have one desire output which is Results. You have lived it and now you are putting it in a book for those that want to have the same results as yours. This is a book I can recommend to anyone struggling and be certain that they will find their feet.'},
  {
    name: 'Adeyemi Francis',
    role: 'SU, Senate President, University of Ilorin.',
    avatar: francisAvatar,
    quote:
      'I expected inspiration, but what stayed with me was the clarity. Each chapter pushed me toward discipline and real action. The practical lessons and the focus on mindset set this book apart. If you’re ready to grow as a leader and see actual results, this book will challenge and help you to do just that.'
  },
  {
    name: 'Oladipo Favour',
    role: 'Young Professional',
    avatar: favourAvatar,
    quote:
      'This is the kind of book you return to when you need to reset and lead well. What I appreciate most is that it goes beyond leadership theory; it gives you simple, practical steps that anyone regardless of experience can apply and see real change. Whether you feel lost, discouraged, this book gives you the focus and courage to try again.'
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
  const isPrelaunchPricing = currentPrice < launchPrice;

  if (loading) {
    return (
      <PageLoader
        title="Loading the home experience"
        message="Bringing in the latest book details and pricing for a smoother first look."
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-200">
      <Hero currentPrice={currentPrice} launchPrice={launchPrice} />

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 text-center">
            <span className="inline-flex items-center rounded-full border border-slate-200 bg-white/80 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-600 shadow-sm backdrop-blur">
              Inside The Book
            </span>
            <h2 className="mx-auto mt-5 max-w-3xl text-3xl font-semibold tracking-[-0.03em] text-slate-950 md:text-5xl">
              Six focused lessons. One clear path to stronger leadership.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-600">
              Every chapter is built to feel direct, practical, and easy to apply in real life.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {chapterHighlights.map((chapter, index) => (
              <article
                key={chapter.title}
                className="rounded-4xl border border-white/70 bg-white/80 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)] backdrop-blur transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_60px_rgba(15,23,42,0.1)]"
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                  0{index + 1}
                </p>
                <h3 className="mt-3 text-xl font-semibold tracking-tight text-slate-950">
                  {chapter.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{chapter.summary}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 rounded-[2.5rem] border border-white/70 bg-slate-950 px-6 py-10 text-white shadow-[0_30px_100px_rgba(15,23,42,0.22)] sm:px-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/55">
              Why It Connects
            </p>
            <h2 className="mt-4 max-w-2xl text-3xl font-semibold tracking-[-0.03em] md:text-5xl">
              Real experiences, practical principles, lasting direction.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/70">
              The book is written to move beyond motivation and into clarity. It helps readers build inner strength,
              disciplined habits, and a sense of purpose they can actually live out.
            </p>
          </div>

          <div className="rounded-4xl border border-white/10 bg-white/8 p-6 backdrop-blur">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/55">
              Available Now
            </p>
            <div className="mt-2 flex flex-wrap items-baseline gap-3">
              {isPrelaunchPricing && (
                <span className="text-xl font-medium text-white/40 line-through">
                  NGN {launchPrice.toLocaleString()}
                </span>
              )}
              <p className="text-4xl font-semibold tracking-tight">
                NGN {currentPrice.toLocaleString()}
              </p>
              {isPrelaunchPricing && (
                <span className="rounded-full bg-white/12 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/80">
                  Prelaunch
                </span>
              )}
            </div>
            <p className="mt-3 text-sm leading-relaxed text-white/70">
              {isPrelaunchPricing
                ? `Prelaunch access is live now at NGN ${currentPrice.toLocaleString()}. Standard pricing is NGN ${launchPrice.toLocaleString()}.`
                : `Current launch access is live now at NGN ${currentPrice.toLocaleString()}.`}
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/all-books"
                className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-medium text-slate-950 transition hover:bg-slate-100"
              >
                Order Your Copy
              </Link>
              <Link
                to="/about-author"
                className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 text-sm font-medium text-white !text-white transition hover:bg-white/10"
                style={{ color: 'white' }}
              >
                Meet the Author
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 text-center">
            <span className="inline-flex items-center rounded-full border border-slate-200 bg-white/80 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-600 shadow-sm backdrop-blur">
              Testimonials
            </span>
            <h2 className="mx-auto mt-5 max-w-3xl text-3xl font-semibold tracking-[-0.03em] text-slate-950 md:text-5xl">
              What early readers are saying.
            </h2>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            {testimonials.map((testimonial) => (
              <article
                key={testimonial.name}
                className="rounded-4xl border border-white/70 bg-white/80 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)] backdrop-blur"
              >
                <p className="text-3xl leading-none text-slate-300">"</p>
                <p className="mt-4 text-base leading-relaxed text-slate-600">
                  {testimonial.quote}
                </p>
                <div className="mt-6 flex items-center gap-4 border-t border-slate-200 pt-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="h-14 w-14 rounded-full object-cover ring-2 ring-slate-100"
                  />
                  <div>
                  <h3 className="text-lg font-semibold tracking-tight text-slate-950">
                    {testimonial.name}
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">{testimonial.role}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl rounded-[2.5rem] border border-white/70 bg-white/85 px-6 py-12 text-center shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur sm:px-10">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
            Author Note
          </p>
          <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-semibold tracking-[-0.03em] text-slate-950 md:text-5xl">
            A first book written to help people lead with more courage and clarity.
          </h2>
          <p className="mx-auto mt-5 max-w-3xl text-base leading-relaxed text-slate-600">
            If fear, background, or limited resources have ever made you feel stuck, this book was written with you in mind.
            <em> Leadership From Within </em>
            is an invitation to build a stronger mindset, stronger discipline, and stronger leadership from the inside out.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              to="/all-books"
              className="inline-flex items-center justify-center rounded-full bg-slate-950 px-8 py-3 text-sm font-medium transition hover:bg-slate-800"
              style={{ color: 'white' }}
            >
              {isPrelaunchPricing
                ? `Buy at Prelaunch NGN ${currentPrice.toLocaleString()}`
                : `Buy at NGN ${currentPrice.toLocaleString()}`}
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-8 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
            >
              Sign In with Google
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
