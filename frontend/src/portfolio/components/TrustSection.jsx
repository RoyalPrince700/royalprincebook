import React from 'react';
import { trustedBy } from '../data/portfolioData';
import SectionWrapper, { SectionHeader } from './SectionWrapper';

const TrustMarqueeItem = ({ company, ariaHidden = false }) => {
  const content = company.logo ? (
    <img
      src={company.logo}
      alt={company.name}
      className="pf-trust-marquee-image"
      loading="lazy"
    />
  ) : (
    <span className="pf-trust-marquee-text">{company.name}</span>
  );

  const className = 'pf-trust-marquee-item';

  if (company.url) {
    return (
      <a
        href={company.url}
        target="_blank"
        rel="noreferrer"
        className={className}
        title={company.name}
        aria-hidden={ariaHidden || undefined}
        tabIndex={ariaHidden ? -1 : undefined}
      >
        {content}
      </a>
    );
  }

  return (
    <div className={className} title={company.name} aria-hidden={ariaHidden || undefined}>
      {content}
    </div>
  );
};

const TrustSection = () => (
  <SectionWrapper id="trust" className="pf-trust-section">
    <div className="pf-container">
      <SectionHeader eyebrow="Trusted By" title="Organizations I've worked with." />
    </div>

    <div className="pf-trust-marquee" aria-label="Partner organizations">
      <div className="pf-trust-marquee-track">
        {trustedBy.map((company) => (
          <TrustMarqueeItem key={company.name} company={company} />
        ))}
        {trustedBy.map((company) => (
          <TrustMarqueeItem key={`${company.name}-loop`} company={company} ariaHidden />
        ))}
      </div>
    </div>
  </SectionWrapper>
);

export default TrustSection;
