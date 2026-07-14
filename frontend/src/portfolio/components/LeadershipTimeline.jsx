import React from 'react';
import { motion } from 'framer-motion';
import { leadershipTimeline } from '../data/portfolioData';
import SectionWrapper, { SectionHeader } from './SectionWrapper';

const LeadershipTimeline = () => (
  <SectionWrapper id="leadership">
    <div className="pf-container">
      <SectionHeader eyebrow="Leadership Journey" title="Jobs I've held and work I've done." />
      <div className="pf-timeline">
        {leadershipTimeline.map((item, index) => (
          <motion.div
            key={`${item.title}-${item.period}`}
            className="pf-timeline-item"
            initial={{ opacity: 0, x: index % 2 === 0 ? -24 : 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ delay: index * 0.06, duration: 0.55 }}
          >
            <div className="pf-timeline-marker">
              <span className="pf-timeline-dot" />
              {index < leadershipTimeline.length - 1 && <span className="pf-timeline-line" />}
            </div>
            <article className="pf-timeline-card">
              <div className="pf-timeline-card-head">
                <div>
                  <span className="pf-timeline-period">{item.period}</span>
                  <h3 className="pf-timeline-title">{item.title}</h3>
                  {item.org && <p className="pf-timeline-org">{item.org}</p>}
                </div>
                {item.logo && (
                  <img src={item.logo} alt={item.org || item.title} className="pf-timeline-logo" loading="lazy" />
                )}
              </div>
              <p className="pf-timeline-summary">{item.summary}</p>
              {item.highlights && (
                <ul className="pf-timeline-highlights">
                  {item.highlights.map((highlight) => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul>
              )}
            </article>
          </motion.div>
        ))}
      </div>
    </div>
  </SectionWrapper>
);

export default LeadershipTimeline;
