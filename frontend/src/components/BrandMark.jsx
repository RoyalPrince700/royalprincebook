import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import logoMark from '../assets/logo/royal-prince-hub/logo-mark.svg';
import logoMarkReversed from '../assets/logo/royal-prince-hub/logo-mark-reversed.svg';

const BrandMark = ({ className = 'pf-desktop-section-nav-brand-mark', theme: themeProp }) => {
  const { theme: contextTheme } = useTheme();
  const theme = themeProp ?? contextTheme;
  const src = theme === 'dark' ? logoMarkReversed : logoMark;

  return (
    <span className={className} aria-hidden="true">
      <img src={src} alt="" width={38} height={38} decoding="async" />
    </span>
  );
};

export default BrandMark;
