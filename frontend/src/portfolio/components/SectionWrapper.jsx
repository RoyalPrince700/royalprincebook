import React from 'react';
import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 }
};

const SectionWrapper = ({ id, children, className = '' }) => (
  <motion.section
    id={id}
    className={`pf-section ${className}`}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.12 }}
    variants={fadeUp}
    transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
  >
    {children}
  </motion.section>
);

export const SectionHeader = ({ eyebrow, title, description, align = 'center' }) => (
  <div className={`pf-section-header ${align === 'left' ? 'pf-section-header-left' : ''}`}>
    {eyebrow && <span className="pf-eyebrow">{eyebrow}</span>}
    {title && <h2 className="pf-section-title">{title}</h2>}
    {description && <p className="pf-section-copy">{description}</p>}
  </div>
);

export default SectionWrapper;
