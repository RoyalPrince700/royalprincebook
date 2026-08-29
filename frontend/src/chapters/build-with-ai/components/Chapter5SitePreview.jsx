import React from 'react';
import PortfolioPreviewShell from './PortfolioPreviewShell';

const Chapter5SitePreview = ({ children, variant = 'default' }) => (
  <PortfolioPreviewShell className={`c5-site-preview c5-site-preview-${variant}`}>
    {children}
  </PortfolioPreviewShell>
);

export default Chapter5SitePreview;
