import React from 'react';
import { motion } from 'framer-motion';

const ScrollProgress = ({ progress }) => (
  <div className="pf-scroll-progress" aria-hidden="true">
    <motion.div
      className="pf-scroll-progress-bar"
      style={{ scaleX: progress / 100 }}
      initial={{ scaleX: 0 }}
    />
  </div>
);

export default ScrollProgress;
