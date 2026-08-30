import React from 'react';
import { motion } from 'framer-motion';
import { skills } from '../data/portfolioData';
import SectionWrapper, { SectionHeader } from './SectionWrapper';
import SwipeCardRail from './SwipeCardRail';

const SkillsSection = () => (
  <SectionWrapper id="skills">
    <div className="pf-container">
      <SectionHeader eyebrow="Skills" title="What I work with." />
      <SwipeCardRail className="pf-skills-grid" ariaLabel="Skills">
        {Object.entries(skills).map(([category, items], index) => (
          <motion.article
            key={category}
            className="pf-skill-card"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05, duration: 0.45 }}
            whileHover={{ y: -4 }}
          >
            <h3 className="pf-skill-category">{category}</h3>
            <div className="pf-skill-tags">
              {items.map((skill) => (
                <span key={skill} className="pf-skill-tag">
                  {skill}
                </span>
              ))}
            </div>
          </motion.article>
        ))}
      </SwipeCardRail>
    </div>
  </SectionWrapper>
);

export default SkillsSection;
