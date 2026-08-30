import React from 'react';
import BoardThemeToggle from '../BoardThemeToggle';

const BoardShell = ({ children, className = '' }) => (
  <div className={`wb-board ${className}`.trim()}>
    <div className="wb-board-chrome wb-board-chrome--theme-only">
      <div className="wb-board-chrome-slot">
        <BoardThemeToggle />
      </div>
    </div>
    {children}
  </div>
);

export default BoardShell;
