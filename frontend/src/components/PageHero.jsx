import React from 'react';

const PageHero = ({ eyebrow, title, description, centered = false, children }) => (
  <section className="pf-page-hero">
    <div className="pf-hero-bg" aria-hidden="true">
      <div className="pf-hero-gradient" />
      <div className="pf-hero-grid" />
    </div>

    <div className={`pf-container ${centered ? 'pf-page-hero-centered' : ''}`}>
      {eyebrow && <span className="pf-eyebrow pf-eyebrow-gold">{eyebrow}</span>}
      {title && <h1 className="pf-page-hero-title">{title}</h1>}
      {description && <p className="pf-page-hero-copy">{description}</p>}
      {children}
    </div>
  </section>
);

export default PageHero;
