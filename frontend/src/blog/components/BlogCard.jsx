import React from 'react';
import { Link } from 'react-router-dom';
import { getBlogPostImage } from '../data/blogImages';

const formatPublishedDate = (value) => {
  if (!value) return null;

  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

const BlogCard = ({ post, featured = false }) => {
  const publishedLabel = formatPublishedDate(post.publishedAt);
  const coverImage = getBlogPostImage(post.slug);
  const imageAlt = `${post.title} cover`;

  return (
    <article className={`pf-blog-card${featured ? ' pf-blog-card-featured' : ''}`}>
      <Link to={`/blog/${post.slug}`} className="pf-blog-card-link">
        <div className="pf-blog-card-media">
          <img
            src={coverImage}
            alt={imageAlt}
            className="pf-blog-card-image"
            loading={featured ? 'eager' : 'lazy'}
            decoding="async"
          />
        </div>

        <div className="pf-blog-card-body">
          <div className="pf-blog-card-meta">
            <span className="pf-blog-card-category">{post.category}</span>
            <span className="pf-blog-card-meta-dot" aria-hidden="true" />
            <span className="pf-blog-card-readtime">{post.readTime}</span>
          </div>

          <h2 className="pf-blog-card-title">{post.title}</h2>
          <p className="pf-blog-card-excerpt">{post.excerpt}</p>

          <div className="pf-blog-card-footer">
            <div className="pf-blog-card-byline">
              <span className="pf-blog-card-author">{post.author}</span>
              {publishedLabel && (
                <>
                  <span className="pf-blog-card-meta-dot" aria-hidden="true" />
                  <time className="pf-blog-card-date" dateTime={post.publishedAt}>
                    {publishedLabel}
                  </time>
                </>
              )}
            </div>

            <span className="pf-blog-card-cta">
              Read
              <span className="pf-blog-card-cta-arrow" aria-hidden="true">
                →
              </span>
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
};

export default BlogCard;
