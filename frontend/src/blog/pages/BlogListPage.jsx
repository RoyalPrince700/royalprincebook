import React from 'react';
import BlogCard from '../components/BlogCard';
import { blogPosts } from '../data/posts';

const BlogListPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 px-4 pb-20 pt-28 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <span className="inline-flex items-center rounded-full border border-slate-200 bg-white/80 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-600 shadow-sm backdrop-blur">
            Blog
          </span>
          <h1 className="mt-5 text-4xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-6xl">
            Stories, lessons, and practical reflections.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-600">
            A collection of my experiences, thoughts, and practical reflections on
            leadership, growth, everyday living, and the lessons that shape how I
            see life.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {blogPosts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogListPage;
