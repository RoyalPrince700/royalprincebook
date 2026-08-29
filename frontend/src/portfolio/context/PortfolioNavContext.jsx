import React, { createContext, useContext, useState } from 'react';

const PortfolioNavContext = createContext({
  sectionNavActive: false,
  setSectionNavActive: () => {}
});

export const PortfolioNavProvider = ({ children }) => {
  const [sectionNavActive, setSectionNavActive] = useState(false);

  return (
    <PortfolioNavContext.Provider value={{ sectionNavActive, setSectionNavActive }}>
      {children}
    </PortfolioNavContext.Provider>
  );
};

export const usePortfolioNav = () => useContext(PortfolioNavContext);
