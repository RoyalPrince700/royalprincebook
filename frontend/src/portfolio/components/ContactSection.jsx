import React from 'react';
import { motion } from 'framer-motion';
import { contactLinks, heroContent } from '../data/portfolioData';
import SectionWrapper, { SectionHeader } from './SectionWrapper';

const iconPaths = {
  mail: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
  linkedin: 'M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-4 0v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z M4 6a2 2 0 100-4 2 2 0 000 4z',
  github: 'M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22',
  twitter: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
  whatsapp: 'M12 2a10 10 0 00-8.94 14.5L2 22l5.67-1.49A10 10 0 1012 2z'
};

const ContactSection = () => (
  <SectionWrapper id="contact" className="pf-contact-section">
    <div className="pf-container">
      <div className="pf-contact-shell">
        <div>
          <SectionHeader
            align="left"
            eyebrow="Contact"
            title="Let's work together."
            description="Open to product work, growth roles, speaking, and good ideas worth building."
          />
          <div className="pf-contact-links">
            {contactLinks.map((link) => (
              <motion.a
                key={link.label}
                href={link.href}
                target={link.href.startsWith('http') ? '_blank' : undefined}
                rel={link.href.startsWith('http') ? 'noreferrer' : undefined}
                className="pf-contact-link"
                whileHover={{ y: -3 }}
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d={iconPaths[link.icon]} />
                </svg>
                {link.label}
              </motion.a>
            ))}
          </div>
        </div>

        <motion.div className="pf-contact-cta" whileHover={{ y: -4 }}>
          <h3>Ready to move?</h3>
          <p>Book a meeting, download my resume, or send a direct message.</p>
          <div className="pf-contact-actions">
            <a href="mailto:joseph.adesunkanmi@gmail.com?subject=Let's Build Something Great" className="pf-btn pf-btn-primary">
              Book a Meeting
            </a>
            <a
              href={heroContent.cvPath}
              download={heroContent.cvFileName}
              className="pf-btn pf-btn-secondary"
            >
              Download Resume
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  </SectionWrapper>
);

export default ContactSection;
