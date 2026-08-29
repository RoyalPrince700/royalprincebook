import React from 'react';
import { motion } from 'framer-motion';
import { heroContent } from '../data/portfolioData';

const floatingIcons = ['⚛', '⬡', '◆', '▲', '●', '✦'];

const HeroSection = () => (
  <section id="hero" className="pf-hero">
    <div className="pf-hero-bg" aria-hidden="true">
      <div className="pf-hero-gradient" />
      <div className="pf-hero-grid" />
      {floatingIcons.map((icon, index) => (
        <motion.span
          key={icon}
          className="pf-floating-icon"
          style={{ left: `${12 + index * 14}%`, top: `${18 + (index % 3) * 22}%` }}
          animate={{ y: [0, -14, 0], opacity: [0.25, 0.55, 0.25] }}
          transition={{ duration: 4 + index * 0.4, repeat: Infinity, ease: 'easeInOut' }}
        >
          {icon}
        </motion.span>
      ))}
    </div>

    <div className="pf-container pf-hero-content">
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="pf-hero-intro">
          <h1 className="pf-hero-title">
            {heroContent.lines.map((line, index) => (
              <motion.span
                key={line}
                className="pf-hero-line"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + index * 0.12, duration: 0.7 }}
              >
                {line}
              </motion.span>
            ))}
          </h1>
        </div>
        <p className="pf-hero-subtitle">{heroContent.subheading}</p>

        <div className="pf-hero-actions">
          {heroContent.actions.map((action) => (
            <a
              key={action.label}
              href={action.href}
              className={`pf-btn ${action.primary ? 'pf-btn-primary' : 'pf-btn-secondary'}`}
            >
              {action.label}
            </a>
          ))}
        </div>

        <div className="pf-hero-tags">
          {heroContent.techIcons.map((tag) => (
            <span key={tag} className="pf-tag">
              {tag}
            </span>
          ))}
        </div>
      </motion.div>

      <motion.div
        className="pf-hero-portrait-wrap"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.25, duration: 0.8 }}
      >
        <div className="pf-hero-portrait-glow" />
        <img
          src={heroContent.portrait}
          alt="Royal Prince"
          className="pf-hero-portrait"
          loading="eager"
        />
      </motion.div>
    </div>
  </section>
);

export default HeroSection;
