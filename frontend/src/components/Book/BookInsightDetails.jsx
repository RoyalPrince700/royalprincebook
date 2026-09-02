import React from 'react';
import { Link } from 'react-router-dom';
import ContentPageShell from '../ContentPageShell';
import PageHero from '../PageHero';
import { getBookCover, getOriginalBookPrice, isBuildWithAi } from '../../utils/bookUtils';
import PageLoader from '../PageLoader';

const BookInsightDetails = ({
  book,
  loading = false,
  error = '',
  canRead = false,
  buying = false,
  onRead,
  onBuy
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
      <ContentPageShell>
        <section className="pf-content-section" style={{ paddingTop: '2rem' }}>
          <div className="pf-container">
            <div className="pf-empty-state">
              <p className="pf-section-label">Book Details</p>
              <h1 className="pf-section-heading">{error || 'Book not found'}</h1>
              <div className="pf-cta-panel-actions" style={{ justifyContent: 'center', marginTop: '1.5rem' }}>
                <Link to="/all-books" className="pf-btn pf-btn-primary pf-btn-sm">
                  Back to Books
                </Link>
              </div>
            </div>
          </div>
        </section>
      </ContentPageShell>
    );
  }

  const originalPrice = getOriginalBookPrice(book.title, book.price);
  const chapters = Array.isArray(book.pages)
    ? [...book.pages].sort((a, b) => a.pageNumber - b.pageNumber)
    : [];
  const chapterCount = chapters.length;
  const previewChapters = chapters.slice(0, 4);
  const authorName = typeof book.author === 'object' ? book.author?.username : '';

  return (
    <ContentPageShell>
      <PageHero eyebrow="Book Insight" title={book.title}>
        <div className="pf-book-detail-grid" style={{ marginTop: '2rem' }}>
          <div className="pf-book-cover-wrap">
            <div
              className="pf-book-cover-image"
              style={{
                backgroundImage: `url(${getBookCover(book.title)})`,
                backgroundPosition: isBuildWithAi(book.title) ? 'center top' : 'center'
              }}
              role="img"
              aria-label={`${book.title} cover`}
            />
          </div>

          <div className="pf-panel">
            <div className="pf-book-detail-tags">
              <span className="pf-tag">{book.genre || 'General'}</span>
              <span className="pf-tag">
                {chapterCount} {chapterCount === 1 ? 'chapter' : 'chapters'}
              </span>
              {authorName && <span className="pf-tag">By {authorName}</span>}
            </div>

            <p className="pf-page-hero-copy" style={{ marginTop: '1.5rem', maxWidth: 'none' }}>
              {book.description || 'No description available for this title yet.'}
            </p>

            <div className="pf-price-panel">
              <p className="pf-stat-label">
                {canRead ? 'Access' : originalPrice ? 'Launch offer price' : 'Price'}
              </p>
              <div className="pf-price-panel-value">
                {originalPrice && !canRead && (
                  <span className="pf-price-panel-old">NGN {originalPrice.toLocaleString()}</span>
                )}
                <strong className="pf-price-panel-current">
                  {book.price && book.price > 0 ? `NGN ${book.price.toLocaleString()}` : 'Free'}
                </strong>
              </div>
              <p className="pf-stat-text" style={{ marginTop: '0.75rem' }}>
                {canRead
                  ? 'You have access to this book already. Open it and continue reading.'
                  : originalPrice
                    ? `Launch offer is active now at NGN ${book.price.toLocaleString()}.`
                    : 'Purchase this book to unlock the full reading experience.'}
              </p>
            </div>

            <div className="pf-cta-panel-actions" style={{ marginTop: '2rem' }}>
              {canRead ? (
                <button type="button" onClick={onRead} className="pf-btn pf-btn-primary">
                  Read Now
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onBuy}
                  disabled={buying}
                  className="pf-btn pf-btn-primary"
                >
                  {buying ? 'Processing...' : 'Buy Now'}
                </button>
              )}

              <Link to="/all-books" className="pf-btn pf-btn-secondary">
                Back to Books
              </Link>
            </div>
          </div>
        </div>
      </PageHero>

      <section className="pf-content-section">
        <div className="pf-container pf-detail-grid">
          <div className="pf-panel">
            <p className="pf-section-label">What to Expect</p>
            <h2 className="pf-section-heading">A closer look at the book</h2>
            <p className="pf-page-hero-copy" style={{ maxWidth: 'none' }}>
              Explore the overview, chapter flow, and pricing before you decide to buy or start
              reading.
            </p>

            <div className="pf-mini-stat-grid">
              <div className="pf-mini-stat">
                <p className="pf-stat-label">Format</p>
                <p className="pf-stat-value" style={{ fontSize: '1.1rem' }}>
                  Digital Book
                </p>
              </div>
              <div className="pf-mini-stat">
                <p className="pf-stat-label">Chapters</p>
                <p className="pf-stat-value" style={{ fontSize: '1.1rem' }}>
                  {chapterCount}
                </p>
              </div>
              <div className="pf-mini-stat">
                <p className="pf-stat-label">Word Count</p>
                <p className="pf-stat-value" style={{ fontSize: '1.1rem' }}>
                  {(book.totalWordCount || 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="pf-panel">
            <p className="pf-section-label">Chapter Preview</p>
            <h2 className="pf-section-heading">Inside this title</h2>

            {previewChapters.length > 0 ? (
              <div className="pf-chapter-list">
                {previewChapters.map((page) => (
                  <div key={page.pageNumber} className="pf-chapter-item">
                    <p className="pf-chapter-item-label">Chapter {page.pageNumber}</p>
                    <p className="pf-chapter-item-title">{page.title || 'Untitled Chapter'}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="pf-page-hero-copy" style={{ maxWidth: 'none' }}>
                Chapters will appear here once the book content is available.
              </p>
            )}
          </div>
        </div>
      </section>
    </ContentPageShell>
  );
};

export default BookInsightDetails;
