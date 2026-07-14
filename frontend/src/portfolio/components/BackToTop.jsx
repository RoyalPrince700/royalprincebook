import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BackToTop = ({ visible }) => (
  <AnimatePresence>
    {visible && (
      <motion.button
        type="button"
        className="pf-back-to-top"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        initial={{ opacity: 0, y: 16, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.9 }}
        aria-label="Back to top"
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
        </svg>
      </motion.button>
    )}
  </AnimatePresence>
);

export default BackToTop;
