import React, { createContext, useContext, useEffect, useState } from 'react';

const BoardThemeContext = createContext();

export const useBoardTheme = () => useContext(BoardThemeContext);

const getStoredBoardTheme = () => {
  if (typeof window === 'undefined') return 'light';
  return localStorage.getItem('boardTheme') || 'light';
};

export const BoardThemeProvider = ({ children }) => {
  const [boardTheme, setBoardTheme] = useState(getStoredBoardTheme);

  useEffect(() => {
    localStorage.setItem('boardTheme', boardTheme);
  }, [boardTheme]);

  const toggleBoardTheme = () => {
    setBoardTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <BoardThemeContext.Provider value={{ boardTheme, toggleBoardTheme }}>
      {children}
    </BoardThemeContext.Provider>
  );
};
