import React from 'react';
import { motion } from 'framer-motion';
import { caseStudies } from '../data/portfolioData';
import SectionWrapper, { SectionHeader } from './SectionWrapper';

const GrowthChart = ({ before, after, metric }) => {
  const max = Math.max(before, after);
  const beforeHeight = (before / max) * 100;
  const afterHeight = (after / max) * 100;

  return (
    <div className="pf-growth-chart">
      <div className="pf-growth-bars">
        <div className="pf-growth-bar-wrap">
          <motion.div
            className="pf-growth-bar pf-growth-bar-before"
            initial={{ height: 0 }}
            whileInView={{ height: `${beforeHeight}%` }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          />
          <span className="pf-growth-value">{before.toLocaleString()}</span>
          <span className="pf-growth-label">Before</span>
        </div>
        <div className="pf-growth-bar-wrap">
          <motion.div
            className="pf-growth-bar pf-growth-bar-after"
            initial={{ height: 0 }}
            whileInView={{ height: `${afterHeight}%` }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.35 }}
          />
          <span className="pf-growth-value">{after.toLocaleString()}</span>
          <span className="pf-growth-label">After</span>
        </div>
      </div>
      <p className="pf-growth-metric">{metric}</p>
    </div>
  );
};

const CaseStudiesSection = () => (
  <SectionWrapper id="case-studies" className="pf-case-studies-section">
    <div className="pf-container">
      <SectionHeader
        eyebrow="Growth Case Studies"
        title="Work that moved the needle."
        description="What I did and what changed."
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
            <p className="pf-case-challenge">
              <strong>Challenge:</strong> {study.challenge}
            </p>

            <div className="pf-case-block">
              <span className="pf-case-label">Strategy</span>
              <ul className="pf-case-list">
                {study.strategy.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <p className="pf-case-execution">
              <strong>Execution:</strong> {study.execution}
            </p>

            <p className="pf-case-result">
              <strong>Result:</strong> {study.result}
            </p>

            {study.before && study.after && (
              <GrowthChart before={study.before} after={study.after} metric={study.metric} />
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
