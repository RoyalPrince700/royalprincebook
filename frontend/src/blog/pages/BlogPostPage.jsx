import React from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import BlogTemplate from '../components/BlogTemplate';
import { getBlogPostBySlug } from '../data/posts';

const BlogPostPage = () => {
  const { slug } = useParams();
  const post = getBlogPostBySlug(slug);

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  return (
    <>
      <BlogTemplate post={post} />

      <div className="bg-slate-50 px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-[2rem] border border-white/70 bg-white/85 px-6 py-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)] backdrop-blur sm:px-8">
            <p className="text-sm leading-relaxed text-slate-600">
              More blog sections can be added from the frontend by updating the blog data file.
            </p>
            <Link
              to="/blog"
              className="mt-4 inline-flex items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              Back to blog
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogPostPage;
