import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { writingContent } from '../data/portfolioData';
import SectionWrapper, { SectionHeader } from './SectionWrapper';
import SwipeCardRail from './SwipeCardRail';

const WritingSection = () => (
  <SectionWrapper id="writing">
    <div className="pf-container">
      <SectionHeader eyebrow="Writing" title="Books, articles, and leadership thoughts." />

      <motion.article className="pf-book-card" whileHover={{ y: -4 }}>
        <img
          src={writingContent.book.image}
          alt={writingContent.book.title}
          className="pf-book-cover"
          loading="lazy"
        />
        <div>
          <span className="pf-eyebrow pf-eyebrow-gold">Book</span>
          <h3 className="pf-book-title">{writingContent.book.title}</h3>
          <p className="pf-book-copy">
            A practical book on mindset, discipline, purpose, and leading yourself well.
          </p>
          <Link to={writingContent.book.link} className="pf-btn pf-btn-primary pf-btn-sm">
            Read More
          </Link>
        </div>
      </motion.article>

      <SwipeCardRail className="pf-writing-grid" ariaLabel="Articles and writing">
        {writingContent.posts.map((post, index) => (
          <motion.article
            key={post.slug}
            className="pf-writing-card"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -4 }}
          >
            <span className="pf-writing-category">{post.category}</span>
            <h4 className="pf-writing-title">{post.title}</h4>
            <p className="pf-writing-excerpt">{post.excerpt}</p>
            <Link to={`/blog/${post.slug}`} className="pf-writing-link">
              Read Article →
            </Link>
          </motion.article>
        ))}
      </SwipeCardRail>
    </div>
  </SectionWrapper>
);

export default WritingSection;
