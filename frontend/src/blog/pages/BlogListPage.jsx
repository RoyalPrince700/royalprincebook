import React from 'react';
import BlogCard from '../components/BlogCard';
import ContentPageShell from '../../components/ContentPageShell';
import PageHero from '../../components/PageHero';
import { blogPosts } from '../data/posts';

const BlogListPage = () => {
  const [featuredPost, ...remainingPosts] = blogPosts;

  return (
    <ContentPageShell>
      <PageHero
        eyebrow="Blog"
        title="Stories, lessons, and practical reflections."
        description="A collection of my experiences, thoughts, and practical reflections on leadership, growth, everyday living, and the lessons that shape how I see life."
      />

      <section className="pf-content-section pf-blog-section">
        <div className="pf-container">
          <div className="pf-blog-grid">
            <BlogCard post={featuredPost} featured />

            <div className="pf-blog-grid-rest">
              {remainingPosts.map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </ContentPageShell>
  );
};

export default BlogListPage;
