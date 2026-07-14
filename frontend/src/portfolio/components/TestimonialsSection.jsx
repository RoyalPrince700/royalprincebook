import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { testimonials } from '../data/portfolioData';
import SectionWrapper, { SectionHeader } from './SectionWrapper';

const TestimonialsSection = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const active = testimonials[index];

  return (
    <SectionWrapper id="testimonials" className="pf-testimonials-section">
      <div className="pf-container">
        <SectionHeader eyebrow="Testimonials" title="What readers say about the book." />
        <div className="pf-testimonial-shell">
          <AnimatePresence mode="wait">
            <motion.article
              key={active.name}
              className="pf-testimonial-card"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.45 }}
            >
              <p className="pf-testimonial-quote">"{active.quote}"</p>
              <div className="pf-testimonial-author">
                <img src={active.avatar} alt={active.name} loading="lazy" />
                <div>
                  <h4>{active.name}</h4>
                  <p>{active.role}</p>
                </div>
              </div>
            </motion.article>
          </AnimatePresence>

          <div className="pf-testimonial-dots">
            {testimonials.map((item, dotIndex) => (
              <button
                key={item.name}
                type="button"
                className={`pf-testimonial-dot ${dotIndex === index ? 'pf-testimonial-dot-active' : ''}`}
                onClick={() => setIndex(dotIndex)}
                aria-label={`Show testimonial from ${item.name}`}
              />
            ))}
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
};

export default TestimonialsSection;
