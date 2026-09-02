import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import ContentPageShell from '../../components/ContentPageShell';
import { isBuildWithAi, isLeadershipFromWithin } from '../../utils/bookUtils';

const BOOK_FOOTERS = {
  'build-with-ai': {
    text: (
      <>
        If this workshop speaks to you, <em>Build with AI</em> is a gentle next step. It guides you
        through the MERN stack and Cursor workflow, unlocks the live sessions on Saturday 5th and
        Sunday 6th September by 8pm, and stays at ₦1,000 so more people can learn without being left
        out.
      </>
    ),
    label: 'Get Build with AI for ₦1,000'
  },
  'leadership-from-within': {
    text: (
      <>
        Want to go deeper than this article? Explore <em>Leadership From Within</em> for a practical
        guide to the mindset, discipline, and self-leadership that prepare you for visible
        responsibility.
      </>
    ),
    label: 'View Leadership From Within'
  }
};

const BlogTemplate = ({ post }) => {
  const [bookPaths, setBookPaths] = useState({
    'leadership-from-within': '/all-books',
    'build-with-ai': '/books/local-build-with-ai/details'
  });

  useEffect(() => {
    let isMounted = true;

    const loadBookLinks = async () => {
      try {
        const response = await axios.get('/books');
        const books = response.data.books || [];
        const leadershipBook = books.find((book) => isLeadershipFromWithin(book.title));
        const buildWithAiBook = books.find((book) => isBuildWithAi(book.title));

        if (!isMounted) return;

        setBookPaths((current) => ({
          ...current,
          ...(leadershipBook?._id
            ? { 'leadership-from-within': `/books/${leadershipBook._id}/details` }
            : {}),
          ...(buildWithAiBook?._id
            ? { 'build-with-ai': `/books/${buildWithAiBook._id}/details` }
            : {})
        }));
      } catch (error) {
        console.error('Failed to resolve book details links:', error);
      }
    };

    loadBookLinks();

    return () => {
      isMounted = false;
    };
  }, []);

  const resolveCtaTarget = (target) =>
    bookPaths[target] || (target.startsWith('/') ? target : '/all-books');

  const relatedBook = post.relatedBook || 'leadership-from-within';
  const footer = BOOK_FOOTERS[relatedBook] || BOOK_FOOTERS['leadership-from-within'];
  const footerBookPath = bookPaths[relatedBook] || '/all-books';

  return (
    <ContentPageShell>
      <section className="pf-content-section" style={{ paddingTop: '1rem' }}>
        <div className="pf-container pf-article-shell">
          <header className="pf-article-header">
            <div className="pf-content-card-meta">
              <span>{post.category}</span>
              <span className="pf-content-card-meta-sep">|</span>
              <span>{post.readTime}</span>
              <span className="pf-content-card-meta-sep">|</span>
              <span>{post.author}</span>
            </div>

            <h1 className="pf-page-hero-title" style={{ maxWidth: 'none' }}>
              {post.title}
            </h1>

            <p className="pf-page-hero-copy" style={{ maxWidth: 'none', fontSize: '1.05rem' }}>
              {post.intro}
            </p>
          </header>

          <article className="pf-article-body">
            {post.sections.map((section) => (
              <section key={section.heading}>
                <h2>{section.heading}</h2>
                <div>
                  {section.paragraphs.map((paragraph, index) => (
                    <p key={`${section.heading}-${index}`}>{paragraph}</p>
                  ))}
                </div>
                {section.cta && (
                  <div className="pf-cta-panel">
                    <p className="pf-cta-panel-eyebrow">
                      {section.cta.eyebrow || 'Recommended Read'}
                    </p>
                    <p className="pf-cta-panel-text">{section.cta.text}</p>
                    <div className="pf-cta-panel-actions">
                      <Link
                        to={resolveCtaTarget(section.cta.target)}
                        className="pf-btn pf-btn-primary pf-btn-sm"
                      >
                        {section.cta.label}
                      </Link>
                    </div>
                  </div>
                )}
              </section>
            ))}
          </article>

          <div className="pf-panel-sm" style={{ marginTop: '2rem' }}>
            <p className="pf-page-hero-copy" style={{ margin: 0, maxWidth: 'none' }}>
              {footer.text}
            </p>
            <div className="pf-cta-panel-actions" style={{ marginTop: '1.25rem' }}>
              <Link to={footerBookPath} className="pf-btn pf-btn-primary pf-btn-sm">
                {footer.label}
              </Link>
              <Link to="/blog" className="pf-btn pf-btn-secondary pf-btn-sm">
                Back to blog
              </Link>
            </div>
          </div>
        </div>
      </section>
    </ContentPageShell>
  );
};

export default BlogTemplate;
