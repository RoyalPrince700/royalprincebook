import React from 'react';
import { motion } from 'framer-motion';
import { impactStats } from '../data/portfolioData';
import AnimatedCounter from './AnimatedCounter';
import SectionWrapper, { SectionHeader } from './SectionWrapper';
import SwipeCardRail from './SwipeCardRail';

const ImpactSection = () => (
  <SectionWrapper id="impact" className="pf-impact-section">
    <div className="pf-container">
      <SectionHeader eyebrow="Impact By The Numbers" title="Results from the work." />
      <SwipeCardRail className="pf-impact-grid" ariaLabel="Impact statistics" variant="compact">
        {impactStats.map((stat, index) => (
          <motion.article
            key={stat.label}
            className="pf-impact-card"
            whileHover={{ y: -6 }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.06, duration: 0.5 }}
          >
            <AnimatedCounter value={stat.value} suffix={stat.suffix} display={stat.display} />
            <p className="pf-impact-label">{stat.label}</p>
          </motion.article>
        ))}
      </SwipeCardRail>
    </div>
  </SectionWrapper>
);

export default ImpactSection;
