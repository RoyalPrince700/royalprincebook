import React from 'react';
import { Link } from 'react-router-dom';

const BlogCard = ({ post }) => {
  return (
    <article className="flex h-full flex-col rounded-[2rem] border border-white/70 bg-white/85 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)] backdrop-blur">
      <div className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
        <span>{post.category}</span>
        <span className="text-slate-300">|</span>
        <span>{post.readTime}</span>
      </div>

      <h2 className="mt-4 text-2xl font-semibold tracking-tight text-slate-950">
        <Link to={`/blog/${post.slug}`} className="transition hover:text-slate-700">
          {post.title}
        </Link>
      </h2>

      <p className="mt-4 flex-1 text-sm leading-relaxed text-slate-600">{post.excerpt}</p>

      <div className="mt-6 flex items-center justify-between gap-4 border-t border-slate-200 pt-4 text-sm text-slate-500">
        <span>{post.author}</span>
        <Link
          to={`/blog/${post.slug}`}
          className="font-medium text-slate-900 transition hover:text-slate-700"
        >
          Read article
        </Link>
      </div>
    </article>
  );
};

export default BlogCard;
