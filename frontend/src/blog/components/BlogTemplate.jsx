import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
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
    <div className="min-h-screen bg-slate-50 px-4 pb-20 pt-28 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-[2.5rem] border border-white/70 bg-white/85 px-6 py-10 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur sm:px-10">
          <div className="flex flex-wrap items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
            <span>{post.category}</span>
            <span className="text-slate-300">|</span>
            <span>{post.readTime}</span>
            <span className="text-slate-300">|</span>
            <span>{post.author}</span>
          </div>

          <h1 className="mt-5 text-4xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-5xl">
            {post.title}
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-slate-600">
            {post.intro}
          </p>
        </div>

        <article className="mx-auto mt-8 max-w-3xl rounded-[2.5rem] border border-white/70 bg-white/85 px-6 py-10 shadow-[0_24px_80px_rgba(15,23,42,0.06)] backdrop-blur sm:px-10">
          {post.sections.map((section) => (
            <section key={section.heading} className="mb-10 last:mb-0">
              <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
                {section.heading}
              </h2>
              <div className="mt-4 space-y-4 text-base leading-relaxed text-slate-600">
                {section.paragraphs.map((paragraph, index) => (
                  <p key={`${section.heading}-${index}`}>{paragraph}</p>
                ))}
              </div>
              {section.cta && (
                <div className="mt-6 rounded-[1.75rem] border border-blue-100 bg-blue-50/80 p-5 text-left shadow-sm">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-blue-700">
                    {section.cta.eyebrow || 'Recommended Read'}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-700">
                    {section.cta.text}
                  </p>
                  <Link
                    to={section.cta.target === 'leadership-from-within' ? leadershipBookPath : section.cta.target}
                    className="mt-4 inline-flex items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
                    style={{ color: 'white' }}
                  >
                    {section.cta.label}
                  </Link>
                </div>
              )}
            </section>
          ))}
        </article>
      </div>
    </div>
  );
};

export default BlogTemplate;
