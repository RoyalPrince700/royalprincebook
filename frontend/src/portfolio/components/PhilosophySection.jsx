import React from 'react';
import { motion } from 'framer-motion';
import { philosophy } from '../data/portfolioData';
import SectionWrapper, { SectionHeader } from './SectionWrapper';
import SwipeCardRail from './SwipeCardRail';

const PhilosophySection = () => (
  <SectionWrapper id="philosophy" className="pf-philosophy-section">
    <div className="pf-container">
      <SectionHeader eyebrow="My Philosophy" title="How I try to work." />
      <SwipeCardRail className="pf-philosophy-grid" ariaLabel="Philosophy">
        {philosophy.map((item, index) => (
          <motion.p
            key={item}
            className="pf-philosophy-item"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05, duration: 0.45 }}
          >
            {item}
          </motion.p>
        ))}
      </SwipeCardRail>
    </div>
  </SectionWrapper>
);

export default PhilosophySection;
