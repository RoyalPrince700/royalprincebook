import React from 'react';
import BoardThemeToggle from '../BoardThemeToggle';

const BoardShell = ({ children, className = '' }) => (
  <div className={`wb-board ${className}`.trim()}>
    <div className="wb-theme-corner">
      <BoardThemeToggle />
    </div>
    {children}
  </div>
);

export default BoardShell;
