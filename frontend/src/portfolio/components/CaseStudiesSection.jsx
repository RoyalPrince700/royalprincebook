import React from 'react';
import { motion } from 'framer-motion';
import { caseStudies } from '../data/portfolioData';
import GrowthBarChart from './GrowthBarChart';
import SectionWrapper, { SectionHeader } from './SectionWrapper';

const CaseStudiesSection = () => (
  <SectionWrapper id="case-studies" className="pf-case-studies-section">
    <div className="pf-container">
      <SectionHeader
        eyebrow="Project Deep Dives"
        title="Projects I've shipped."
        description="What each one is, how it works, and who it's for."
      />
      <div className="pf-case-studies-grid">
        {caseStudies.map((study, index) => (
          <motion.article
            key={study.id}
            className="pf-case-card"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.08, duration: 0.55 }}
            whileHover={{ y: -5 }}
          >
            <span className="pf-case-index">0{index + 1}</span>
            <h3 className="pf-case-title">{study.title}</h3>
            {study.url && (
              <a
                href={study.url}
                target="_blank"
                rel="noreferrer"
                className="pf-case-link"
              >
                {study.urlLabel || 'View project'}
              </a>
            )}
            <p className="pf-case-challenge">
              <strong>{study.challengeLabel || 'Problem'}:</strong> {study.challenge}
            </p>

            <div className="pf-case-block">
              <span className="pf-case-label">{study.strategyLabel || 'Approach'}</span>
              <ul className="pf-case-list">
                {study.strategy.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <p className="pf-case-execution">
              <strong>{study.executionLabel || 'How it works'}:</strong> {study.execution}
            </p>

            <p className="pf-case-result">
              <strong>{study.resultLabel || 'Outcome'}:</strong> {study.result}
            </p>

            {study.before && study.after && (
              <GrowthBarChart before={study.before} after={study.after} metric={study.metric} />
            )}

            {study.timeline && (
              <div className="pf-timeline-mini">
                {study.timeline.map((step, stepIndex) => (
                  <div key={step} className="pf-timeline-mini-step">
                    <span className="pf-timeline-mini-dot" />
                    <span>{step}</span>
                    {stepIndex < study.timeline.length - 1 && <span className="pf-timeline-mini-line" />}
                  </div>
                ))}
              </div>
            )}

            {study.highlights && (
              <div className="pf-case-highlights">
                {study.highlights.map((item) => (
                  <span key={item} className="pf-tag">
                    {item}
                  </span>
                ))}
              </div>
            )}
          </motion.article>
        ))}
      </div>
    </div>
  </SectionWrapper>
);

export default CaseStudiesSection;
