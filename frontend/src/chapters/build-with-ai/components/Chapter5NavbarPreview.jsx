import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../../contexts/ThemeContext';
import NavIcon from '../../../components/NavIcon';
import BrandMark from '../../../components/BrandMark';
import { chapter5NavLinks } from '../data/chapter5ReferenceData';
import '../../../portfolio/styles/portfolio.css';

/**
 * Static preview of the Royal Prince Hub navbar pattern for Chapter 5 book demos.
 */
const Chapter5NavbarPreview = ({ activePath = '/' }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header
      className={`c5-site-preview-nav pf-desktop-section-nav pf-site-nav ${
        theme === 'dark' ? 'pf-site-nav-dark' : ''
      }`}
    >
      <div className="pf-container pf-desktop-section-nav-inner">
        <Link to="/" className="pf-desktop-section-nav-brand" aria-label="Royal Prince Hub home">
          <BrandMark theme={theme} />
        </Link>

        <nav className="pf-desktop-section-nav-scroll" aria-label="Main navigation">
          {chapter5NavLinks.map((link) => (
            <a
              key={link.label}
              href={link.to}
              className={`pf-desktop-section-nav-link ${
                link.active || link.to === activePath ? 'pf-desktop-section-nav-link-active' : ''
              }`}
              onClick={(event) => event.preventDefault()}
            >
              <NavIcon name={link.icon} />
              <span>{link.label}</span>
            </a>
          ))}
        </nav>

        <div className="pf-site-nav-end">
          <a
            href="#sign-in"
            className="pf-site-nav-auth-btn pf-site-nav-auth-desktop"
            onClick={(event) => event.preventDefault()}
          >
            Sign in
          </a>

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
      </div>
    </header>
  );
};

export default Chapter5NavbarPreview;
