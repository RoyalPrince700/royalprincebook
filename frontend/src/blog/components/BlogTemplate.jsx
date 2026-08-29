import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import ContentPageShell from '../../components/ContentPageShell';
import { isLeadershipFromWithin } from '../../utils/bookUtils';

const BlogTemplate = ({ post }) => {
  const [leadershipBookPath, setLeadershipBookPath] = useState('/all-books');

  useEffect(() => {
    let isMounted = true;

    const loadLeadershipBookLink = async () => {
      try {
        const response = await axios.get('/books');
        const books = response.data.books || [];
        const leadershipBook = books.find((book) => isLeadershipFromWithin(book.title));

        if (isMounted && leadershipBook?._id) {
          setLeadershipBookPath(`/books/${leadershipBook._id}/details`);
        }
      } catch (error) {
        console.error('Failed to resolve Leadership From Within details link:', error);
      }
    };

    loadLeadershipBookLink();

    return () => {
      isMounted = false;
    };
  }, []);

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
                        to={
                          section.cta.target === 'leadership-from-within'
                            ? leadershipBookPath
                            : section.cta.target
                        }
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
              Want to go deeper than this article? Explore <em>Leadership From Within</em> for a
              practical guide to the mindset, discipline, and self-leadership that prepare you for
              visible responsibility.
            </p>
            <div className="pf-cta-panel-actions" style={{ marginTop: '1.25rem' }}>
              <Link to={leadershipBookPath} className="pf-btn pf-btn-primary pf-btn-sm">
                View Leadership From Within
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
