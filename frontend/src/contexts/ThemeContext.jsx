import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

const getStoredTheme = () => {
  if (typeof window === 'undefined') return 'light';
  return localStorage.getItem('theme') || 'light';
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const initialTheme = getStoredTheme();
    document.documentElement.setAttribute('data-theme', initialTheme);
    return initialTheme;
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
