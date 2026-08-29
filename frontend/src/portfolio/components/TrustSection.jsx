import React, { useMemo } from 'react';
import { trustedBy } from '../data/portfolioData';
import SectionWrapper, { SectionHeader } from './SectionWrapper';

const TrustMarqueeItem = ({ company, ariaHidden = false }) => {
  const className = 'pf-trust-marquee-item';
  const image = (
    <img
      src={company.logo}
      alt={company.name}
      className="pf-trust-marquee-image"
      loading="lazy"
    />
  );

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
        {image}
      </a>
    );
  }

  return (
    <div className={className} title={company.name} aria-hidden={ariaHidden || undefined}>
      {image}
    </div>
  );
};

const TrustSection = () => {
  const logoPartners = useMemo(
    () => trustedBy.filter((company) => Boolean(company.logo)),
    []
  );

  const renderGroup = (groupId, ariaHidden = false) => (
    <div className="pf-trust-marquee-group" aria-hidden={ariaHidden || undefined}>
      {[0, 1].map((repeatIndex) =>
        logoPartners.map((company) => (
          <TrustMarqueeItem
            key={`${groupId}-${repeatIndex}-${company.name}`}
            company={company}
            ariaHidden={ariaHidden}
          />
        ))
      )}
    </div>
  );

  return (
    <SectionWrapper id="trust" className="pf-trust-section">
      <div className="pf-container">
        <SectionHeader eyebrow="Trusted By" title="Organizations I work with." />
      </div>

      <div className="pf-trust-marquee" aria-label="Partner organizations">
        <div className="pf-trust-marquee-track">
          {renderGroup('set-a')}
          {renderGroup('set-b', true)}
        </div>
      </div>
    </SectionWrapper>
  );
};

export default TrustSection;
