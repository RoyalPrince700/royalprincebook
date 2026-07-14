import React from 'react';
import { contactLinks } from '../data/portfolioData';

const PortfolioFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="pf-footer">
      <div className="pf-container pf-footer-inner">
        <blockquote className="pf-footer-quote">
          "Ideas are good. Getting them done is what counts."
        </blockquote>
        <div className="pf-footer-links">
          {contactLinks.slice(0, 4).map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.href.startsWith('http') ? '_blank' : undefined}
              rel={link.href.startsWith('http') ? 'noreferrer' : undefined}
            >
              {link.label}
            </a>
          ))}
        </div>
        <p className="pf-footer-copy">© {currentYear} Royal Prince. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default PortfolioFooter;
