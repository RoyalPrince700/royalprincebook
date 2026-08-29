import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import '../portfolio/styles/portfolio.css';

const PageLoader = ({
  title = 'Preparing your page',
  message = 'Loading content with the same clean experience you expect.',
  fullScreen = true
}) => {
  const { theme } = useTheme();

  return (
    <div
      className={`pf-page-loader portfolio-page ${
        theme === 'dark' ? 'portfolio-page-dark' : ''
      } ${fullScreen ? 'pf-page-loader-full' : 'pf-page-loader-inline'}`}
      role="status"
      aria-live="polite"
    >
      <div className="pf-page-loader-bg" aria-hidden="true">
        <div className="pf-page-loader-gradient" />
        <div className="pf-page-loader-grid" />
      </div>

      <div className="pf-page-loader-content">
        <div className="pf-page-loader-panel">
          <span className="pf-eyebrow pf-eyebrow-gold">Loading</span>

          <div className="pf-page-loader-spinner" aria-hidden="true" />

          <h2 className="pf-page-loader-title">{title}</h2>
          <p className="pf-page-loader-message">{message}</p>

          <div className="pf-page-loader-skeleton" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageLoader;
