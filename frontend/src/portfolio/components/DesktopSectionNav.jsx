import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import NavIcon from '../../components/NavIcon';
import { portfolioNavSections } from '../data/portfolioData';

const DesktopSectionNav = ({ active, progress, onScrollTo, theme, toggleTheme, visible }) => {
  if (!visible) return null;

  return (
    <motion.nav
      className={`pf-desktop-section-nav pf-desktop-section-nav-floating pf-site-nav ${
        theme === 'dark' ? 'pf-site-nav-dark' : ''
      }`}
      aria-label="Portfolio sections"
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -16, opacity: 0 }}
      transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="pf-desktop-section-nav-inner pf-desktop-section-nav-inner-full">
        <Link to="/" className="pf-desktop-section-nav-brand" aria-label="Royal Prince home">
          <span className="pf-desktop-section-nav-brand-mark">RP</span>
        </Link>

        <div className="pf-desktop-section-nav-scroll">
          {portfolioNavSections.map((section) => (
            <button
              key={section.id}
              type="button"
              className={`pf-desktop-section-nav-link ${
                active === section.id ? 'pf-desktop-section-nav-link-active' : ''
              }`}
              onClick={() => onScrollTo(section.id)}
              title={section.label}
              aria-label={section.label}
              aria-current={active === section.id ? 'true' : undefined}
            >
              <NavIcon name={section.icon} />
              <span>{section.label}</span>
            </button>
          ))}
        </div>

        <button
          type="button"
          className="pf-desktop-section-nav-theme"
          onClick={toggleTheme}
          title={theme === 'light' ? 'Dark mode' : 'Light mode'}
          aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
        >
          <NavIcon name={theme === 'light' ? 'moon' : 'sun'} />
        </button>
      </div>

      <div className="pf-desktop-section-nav-progress" aria-hidden="true">
        <div
          className="pf-desktop-section-nav-progress-fill"
          style={{ width: `${progress}%` }}
        />
      </div>
    </motion.nav>
  );
};

export default DesktopSectionNav;
