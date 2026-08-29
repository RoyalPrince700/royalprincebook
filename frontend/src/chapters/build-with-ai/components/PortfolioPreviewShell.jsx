import React from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import '../../../portfolio/styles/portfolio.css';

/**
 * Restores portfolio page theme context when site components
 * are embedded inside the book reader (avoids chapter text colors).
 */
const PortfolioPreviewShell = ({ children, className = '' }) => {
  const { theme } = useTheme();

  return (
    <div
      className={`pf-book-preview portfolio-page ${
        theme === 'dark' ? 'portfolio-page-dark' : ''
      } ${className}`.trim()}
    >
      {children}
    </div>
  );
};

export default PortfolioPreviewShell;
