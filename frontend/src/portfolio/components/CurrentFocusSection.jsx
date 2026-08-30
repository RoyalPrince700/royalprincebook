import React from 'react';
import { motion } from 'framer-motion';
import { currentFocus } from '../data/portfolioData';
import SectionWrapper, { SectionHeader } from './SectionWrapper';
import SwipeCardRail from './SwipeCardRail';

const FocusCard = ({ item, index }) => {
  const motionProps = {
    className: 'pf-focus-card',
    whileHover: { y: -5 },
    initial: { opacity: 0, y: 16 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { delay: index * 0.05 }
  };

  const content = (
    <>
      <h3>{item.title}</h3>
      <p>{item.summary}</p>
    </>
  );

  if (item.url) {
    return (
      <motion.a href={item.url} target="_blank" rel="noreferrer" {...motionProps}>
        {content}
      </motion.a>
    );
  }

  return <motion.article {...motionProps}>{content}</motion.article>;
};

const CurrentFocusSection = () => (
  <SectionWrapper id="focus">
    <div className="pf-container">
      <SectionHeader eyebrow="Current Focus" title="Where my energy is going right now." />
      <SwipeCardRail className="pf-focus-grid" ariaLabel="Current focus areas">
        {currentFocus.map((item, index) => (
          <FocusCard key={item.title} item={item} index={index} />
        ))}
      </SwipeCardRail>
    </div>
  </SectionWrapper>
);

export default CurrentFocusSection;
