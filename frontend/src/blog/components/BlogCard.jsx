import React from 'react';
import { Link } from 'react-router-dom';

const BlogCard = ({ post }) => {
  return (
    <article className="pf-content-card">
      <div className="pf-content-card-meta">
        <span>{post.category}</span>
        <span className="pf-content-card-meta-sep">|</span>
        <span>{post.readTime}</span>
      </div>

      <h2 className="pf-content-card-title">
        <Link to={`/blog/${post.slug}`}>{post.title}</Link>
      </h2>

      <p className="pf-content-card-excerpt">{post.excerpt}</p>

      <div className="pf-content-card-footer">
        <span>{post.author}</span>
        <Link to={`/blog/${post.slug}`} className="pf-content-card-link">
          Read article →
        </Link>
      </div>
    </article>
  );
};

export default BlogCard;
