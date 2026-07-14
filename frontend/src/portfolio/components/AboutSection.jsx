import React from 'react';
import { motion } from 'framer-motion';
import { aboutContent } from '../data/portfolioData';
import SectionWrapper, { SectionHeader } from './SectionWrapper';

const AboutSection = () => (
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
      </motion.div>

      <div>
        <SectionHeader
          align="left"
          eyebrow="About"
          title={aboutContent.title}
        />
        {aboutContent.paragraphs.map((paragraph) => (
          <p key={paragraph.slice(0, 32)} className="pf-about-copy">
            {paragraph}
          </p>
        ))}
        <div className="pf-topic-tags">
          {aboutContent.topics.map((topic) => (
            <span key={topic} className="pf-topic-tag">
              {topic}
            </span>
          ))}
        </div>
      </div>
    </div>
  </SectionWrapper>
);

export default AboutSection;
