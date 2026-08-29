import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import '../portfolio/styles/portfolio.css';

const ContentPageShell = ({ children, className = '' }) => {
  const { theme } = useTheme();

  return (
    <div
      className={`portfolio-page pf-content-page ${
        theme === 'dark' ? 'portfolio-page-dark' : ''
      } ${className}`.trim()}
    >
      {children}
    </div>
  );
};

export default ContentPageShell;
