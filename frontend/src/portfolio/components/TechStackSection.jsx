import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { techStack } from '../data/portfolioData';
import SectionWrapper, { SectionHeader } from './SectionWrapper';

const TechStackSection = () => {
  const [active, setActive] = useState(null);

  return (
    <SectionWrapper id="tech-stack">
      <div className="pf-container">
        <SectionHeader eyebrow="Tech Stack" title="Tools I use to build and ship." />
        <div className="pf-tech-cloud">
          {techStack.map((tech, index) => (
            <motion.button
              key={tech}
              type="button"
              className={`pf-tech-pill ${active === tech ? 'pf-tech-pill-active' : ''}`}
              onMouseEnter={() => setActive(tech)}
              onMouseLeave={() => setActive(null)}
              initial={{ opacity: 0, scale: 0.92 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.03 }}
              whileHover={{ y: -4, scale: 1.04 }}
            >
              {tech}
            </motion.button>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
};

export default TechStackSection;
