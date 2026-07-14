import React from 'react';
import { motion } from 'framer-motion';
import { mediaContent } from '../data/portfolioData';
import SectionWrapper, { SectionHeader } from './SectionWrapper';

const MediaSection = () => (
  <SectionWrapper id="media" className="pf-media-section">
    <div className="pf-container pf-media-grid">
      <div>
        <SectionHeader
          align="left"
          eyebrow="Media"
          title={`${mediaContent.show} on ${mediaContent.station}`}
          description={mediaContent.description}
        />
        <div className="pf-media-highlights">
          {mediaContent.highlights.map((item) => (
            <span key={item} className="pf-tag pf-tag-gold">
              {item}
            </span>
          ))}
        </div>
      </div>

      <motion.div className="pf-media-player" whileHover={{ y: -4 }}>
        <div className="pf-media-player-inner">
          {mediaContent.logo && (
            <img src={mediaContent.logo} alt={mediaContent.station} className="pf-media-logo" loading="lazy" />
          )}
          <span className="pf-media-station">{mediaContent.station}</span>
          <h3 className="pf-media-show">{mediaContent.show}</h3>
          <p className="pf-media-copy">
            Business leaders, honest conversations, and a show that keeps getting better each week.
          </p>
          <div className="pf-media-wave" aria-hidden="true">
            {[...Array(24)].map((_, index) => (
              <motion.span
                key={index}
                className="pf-media-wave-bar"
                animate={{ scaleY: [0.35, 1, 0.45] }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  delay: index * 0.04,
                  ease: 'easeInOut'
                }}
              />
            ))}
          </div>
          <a href={mediaContent.url} target="_blank" rel="noreferrer" className="pf-btn pf-btn-secondary pf-btn-sm pf-media-link">
            Visit Oxygen FM
          </a>
        </div>
      </motion.div>
    </div>
  </SectionWrapper>
);

export default MediaSection;
