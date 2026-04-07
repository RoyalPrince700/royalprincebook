import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, Navigate, useParams } from 'react-router-dom';
import BlogTemplate from '../components/BlogTemplate';
import { getBlogPostBySlug } from '../data/posts';
import { isLeadershipFromWithin } from '../../utils/bookUtils';

const BlogPostPage = () => {
  const { slug } = useParams();
  const post = getBlogPostBySlug(slug);
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

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  return (
    <>
      <BlogTemplate post={post} />

      <div className="bg-slate-50 px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-4xl border border-white/70 bg-white/85 px-6 py-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)] backdrop-blur sm:px-8">
            <p className="text-sm leading-relaxed text-slate-600">
              Want to go deeper than this article? Explore <em>Leadership From Within</em> for a practical guide to the mindset, discipline, and self-leadership that prepare you for visible responsibility.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                to={leadershipBookPath}
                className="inline-flex items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
                style={{ color: 'white' }}
              >
                View Leadership From Within
              </Link>
              <Link
                to="/blog"
                className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-800 transition hover:border-slate-400 hover:bg-slate-50"
              >
                Back to blog
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogPostPage;
