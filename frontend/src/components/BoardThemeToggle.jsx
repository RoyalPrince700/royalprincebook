import React from 'react';
import { useBoardTheme } from '../contexts/BoardThemeContext';
import NavIcon from './NavIcon';

const BoardThemeToggle = ({ className = '' }) => {
  const { boardTheme, toggleBoardTheme } = useBoardTheme();
  const isLight = boardTheme === 'light';

  return (
    <button
      type="button"
      className={`wb-theme-toggle ${className}`.trim()}
      onClick={toggleBoardTheme}
      aria-label={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
      title={isLight ? 'Dark mode' : 'Light mode'}
    >
      <NavIcon name={isLight ? 'moon' : 'sun'} className="wb-theme-toggle-icon" />
    </button>
  );
};

export default BoardThemeToggle;
