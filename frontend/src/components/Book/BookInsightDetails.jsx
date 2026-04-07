import React from 'react';
import { Link } from 'react-router-dom';
import { getBookCover, getOriginalBookPrice } from '../../utils/bookUtils';
import PageLoader from '../PageLoader';

const BookInsightDetails = ({
  book,
  loading = false,
  error = '',
  canRead = false,
  isInCart = false,
  buying = false,
  onRead,
  onBuy,
  onAddToCart
}) => {
  if (loading) {
    return (
      <PageLoader
        title="Loading book details"
        message="Preparing the cover, summary, chapters, and purchase options."
      />
    );
  }

  if (error || !book) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-24 text-slate-900 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-4xl border border-white/70 bg-white/85 p-8 text-center shadow-[0_24px_80px_rgba(15,23,42,0.1)] backdrop-blur">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">Book Details</p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">
            {error || 'Book not found'}
          </h1>
          <Link
            to="/all-books"
            className="mt-6 inline-flex items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            Back to Books
          </Link>
        </div>
      </div>
    );
  }

  const originalPrice = getOriginalBookPrice(book.title, book.price);
  const chapters = Array.isArray(book.pages) ? [...book.pages].sort((a, b) => a.pageNumber - b.pageNumber) : [];
  const chapterCount = chapters.length;
  const previewChapters = chapters.slice(0, 4);
  const authorName = typeof book.author === 'object' ? book.author?.username : '';

  return (
    <div className="min-h-screen overflow-hidden bg-slate-50 text-slate-900">
      <section className="relative px-4 pb-12 pt-20 sm:px-6 md:pt-28 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.96),rgba(241,245,249,0.92)_45%,rgba(226,232,240,0.7)_100%)]" />
        <div className="absolute inset-x-0 top-0 h-80 bg-linear-to-b from-white via-white/80 to-transparent" />
        <div className="absolute left-1/2 top-32 h-72 w-72 -translate-x-1/2 rounded-full bg-blue-200/25 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div className="overflow-hidden rounded-4xl border border-white/70 bg-white/75 shadow-[0_24px_80px_rgba(15,23,42,0.1)] backdrop-blur">
            <div
              className="h-[420px] w-full bg-slate-100"
              style={{
                backgroundImage: `url(${getBookCover(book.title)})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
            />
          </div>

          <div className="rounded-4xl border border-white/70 bg-white/85 p-8 shadow-[0_24px_80px_rgba(15,23,42,0.1)] backdrop-blur">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">
              Book Insight
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-5xl">
              {book.title}
            </h1>

            <div className="mt-5 flex flex-wrap gap-3">
              <span className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700">
                {book.genre || 'General'}
              </span>
              <span className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700">
                {chapterCount} {chapterCount === 1 ? 'chapter' : 'chapters'}
              </span>
              {authorName && (
                <span className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700">
                  By {authorName}
                </span>
              )}
              {isInCart && !canRead && (
                <span className="rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
                  In cart
                </span>
              )}
            </div>

            <p className="mt-6 text-base leading-8 text-slate-600">
              {book.description || 'No description available for this title yet.'}
            </p>

            <div className="mt-8 rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                {canRead ? 'Access' : originalPrice ? 'Launch offer price' : 'Price'}
              </p>
              <div className="mt-3 flex flex-wrap items-end gap-3">
                {originalPrice && !canRead && (
                  <span className="text-lg font-medium text-slate-400 line-through">
                    NGN {originalPrice.toLocaleString()}
                  </span>
                )}
                <strong className="text-3xl font-semibold tracking-tight text-slate-950">
                  {book.price && book.price > 0 ? `NGN ${book.price.toLocaleString()}` : 'Free'}
                </strong>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                {canRead
                  ? 'You have access to this book already. Open it and continue reading.'
                  : originalPrice
                    ? `Launch offer is active now at NGN ${book.price.toLocaleString()}.`
                    : 'Purchase this book to unlock the full reading experience.'}
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              {canRead ? (
                <button
                  type="button"
                  onClick={onRead}
                  className="inline-flex items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
                >
                  Read Now
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={onBuy}
                    disabled={buying}
                    className="inline-flex items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {buying ? 'Processing...' : 'Buy Now'}
                  </button>
                  {!isInCart && onAddToCart && (
                    <button
                      type="button"
                      onClick={onAddToCart}
                      className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-medium text-slate-800 transition hover:border-slate-400 hover:bg-slate-50"
                    >
                      Add to Cart
                    </button>
                  )}
                </>
              )}

              <Link
                to="/all-books"
                className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-medium text-slate-800 transition hover:border-slate-400 hover:bg-slate-50"
              >
                Back to Books
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-4xl border border-white/70 bg-white/80 p-8 shadow-xl backdrop-blur">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
              What to Expect
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
              A closer look at the book
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-600">
              Explore the overview, chapter flow, and pricing before you decide to buy or start reading.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Format</p>
                <p className="mt-2 text-lg font-semibold text-slate-950">Digital Book</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Chapters</p>
                <p className="mt-2 text-lg font-semibold text-slate-950">{chapterCount}</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Word Count</p>
                <p className="mt-2 text-lg font-semibold text-slate-950">
                  {(book.totalWordCount || 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-4xl border border-white/70 bg-white/80 p-8 shadow-xl backdrop-blur">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
              Chapter Preview
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
              Inside this title
            </h2>

            {previewChapters.length > 0 ? (
              <div className="mt-6 space-y-3">
                {previewChapters.map((page) => (
                  <div
                    key={page.pageNumber}
                    className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4"
                  >
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                      Chapter {page.pageNumber}
                    </p>
                    <p className="mt-2 text-base font-medium text-slate-900">
                      {page.title || 'Untitled Chapter'}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-6 text-base leading-8 text-slate-600">
                Chapters will appear here once the book content is available.
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default BookInsightDetails;
