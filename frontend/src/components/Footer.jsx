import React from 'react';
import { Link } from 'react-router-dom';
import { contactLinks, footerNavLinks } from '../portfolio/data/portfolioData';
import BrandMark from './BrandMark';
import '../portfolio/styles/portfolio.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="pf-footer">
      <div className="pf-container pf-footer-inner">
        <Link to="/" className="pf-footer-brand" aria-label="Royal Prince Hub home">
          <BrandMark className="pf-footer-brand-mark" />
        </Link>

        <blockquote className="pf-footer-quote">
          "Ideas are good. Getting them done is what counts."
        </blockquote>

        <div className="pf-footer-menus">
          <nav className="pf-footer-nav" aria-label="Site navigation">
            {footerNavLinks.map((link) =>
              link.to ? (
                <Link key={link.label} to={link.to}>
                  {link.label}
                </Link>
              ) : (
                <a key={link.label} href={link.href} target="_blank" rel="noreferrer">
                  {link.label}
                </a>
              )
            )}
          </nav>

          <div className="pf-footer-links" aria-label="Contact links">
            {contactLinks.map((link) => (
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
        </div>

        <p className="pf-footer-copy">© {currentYear} Royal Prince. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
