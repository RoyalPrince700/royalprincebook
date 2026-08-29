import React from 'react';
import BlogCard from '../components/BlogCard';
import ContentPageShell from '../../components/ContentPageShell';
import PageHero from '../../components/PageHero';
import { blogPosts } from '../data/posts';

const BlogListPage = () => {
  return (
    <ContentPageShell>
      <PageHero
        eyebrow="Blog"
        title="Stories, lessons, and practical reflections."
        description="A collection of my experiences, thoughts, and practical reflections on leadership, growth, everyday living, and the lessons that shape how I see life."
      />

      <section className="pf-content-section">
        <div className="pf-container">
          <div className="pf-content-grid">
            {blogPosts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        </div>
      </section>
    </ContentPageShell>
  );
};

export default BlogListPage;
