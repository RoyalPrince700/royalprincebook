import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { aboutContent } from '../data/portfolioData';
import SectionWrapper, { SectionHeader } from './SectionWrapper';
import SwipeCardRail from './SwipeCardRail';

const highlightIcons = {
  chart:
    'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
  code: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4',
  flag: 'M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9',
  radio:
    'M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3'
};

const HighlightIcon = ({ name }) => (
  <svg className="pf-about-highlight-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d={highlightIcons[name]} />
  </svg>
);

const AboutSection = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <SectionWrapper id="about">
      <div className="pf-container pf-about-grid">
        <motion.div
          className="pf-about-portrait-wrap"
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.35 }}
        >
          <img
            src={aboutContent.portrait}
            alt="Royal Prince professional portrait"
            className="pf-about-portrait"
            loading="lazy"
          />
          <div className="pf-about-portrait-caption">
            <span className="pf-about-portrait-name">Royal Prince</span>
            <span className="pf-about-portrait-role">{aboutContent.role}</span>
          </div>
        </motion.div>

        <div className="pf-about-content">
          <SectionHeader align="left" eyebrow="About" title={aboutContent.title} />
          <p className="pf-about-hook">{aboutContent.hook}</p>

          <SwipeCardRail className="pf-about-highlights" ariaLabel="About highlights">
            {aboutContent.highlights.map((item, index) => {
              const card = (
                <>
                  <div className="pf-about-highlight-top">
                    <span className="pf-about-highlight-eyebrow">{item.eyebrow}</span>
                    <span className="pf-about-highlight-icon-wrap">
                      <HighlightIcon name={item.icon} />
                    </span>
                  </div>
                  <h3 className="pf-about-highlight-title">
                    {item.url ? (
                      <a
                        href={item.url}
                        className="pf-about-highlight-link"
                        target={item.url.startsWith('http') ? '_blank' : undefined}
                        rel={item.url.startsWith('http') ? 'noreferrer' : undefined}
                      >
                        {item.title}
                      </a>
                    ) : (
                      item.title
                    )}
                  </h3>
                  <p className="pf-about-highlight-text">{item.text}</p>
                </>
              );

              return (
                <motion.article
                  key={item.id}
                  className="pf-about-highlight"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.07, duration: 0.45 }}
                  whileHover={{ y: -3 }}
                >
                  {card}
                </motion.article>
              );
            })}
          </SwipeCardRail>

          <div className="pf-topic-tags">
            {aboutContent.topics.map((topic) => (
              <span key={topic} className="pf-topic-tag">
                {topic}
              </span>
            ))}
          </div>

          <div className="pf-about-more-wrap">
            <button
              type="button"
              className="pf-about-more-toggle"
              onClick={() => setExpanded((prev) => !prev)}
              aria-expanded={expanded}
            >
              {expanded ? 'Show less' : 'A little more about me'}
              <span className={`pf-about-more-chevron ${expanded ? 'pf-about-more-chevron-open' : ''}`}>
                ▾
              </span>
            </button>

            <AnimatePresence initial={false}>
              {expanded && (
                <motion.div
                  className="pf-about-more-panel"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                >
                  {aboutContent.more.map((paragraph) => (
                    <p key={paragraph.slice(0, 40)} className="pf-about-more-copy">
                      {paragraph}
                    </p>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
};

export default AboutSection;
