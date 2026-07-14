import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { featuredProjects, clientProjects } from '../data/portfolioData';
import SectionWrapper, { SectionHeader } from './SectionWrapper';

const ProjectVisual = ({ project }) => {
  const visualClass = `pf-project-visual bg-linear-to-br ${project.gradient}`;

  if (project.image) {
    const isCover = project.imageVariant === 'cover';
    return (
      <div className={`${visualClass} ${isCover ? 'pf-project-visual-cover' : ''}`}>
        <img
          src={project.image}
          alt={project.title}
          className={isCover ? 'pf-project-cover-image' : 'pf-project-image'}
          loading="lazy"
        />
      </div>
    );
  }

  if (project.logo) {
    return (
      <div className={`${visualClass} pf-project-visual-logo`}>
        <img src={project.logo} alt={project.title} className="pf-project-logo" loading="lazy" />
      </div>
    );
  }

  return (
    <div className={visualClass}>
      <div className="pf-project-mockup">
        <span className="pf-project-mockup-title">{project.title}</span>
        <span className="pf-project-mockup-url">{project.url?.replace('https://', '').replace(/\/$/, '')}</span>
      </div>
    </div>
  );
};

const ProjectCard = ({ project }) => {
  const [expanded, setExpanded] = useState(false);
  const href = project.internalLink || project.url;
  const isExternal = !project.internalLink;

  return (
    <motion.article className="pf-project-card" layout whileHover={{ y: -4 }}>
      <ProjectVisual project={project} />

      <div className="pf-project-body">
        <div className="pf-project-head">
          <div>
            <p className="pf-project-category">Featured Project</p>
            <h3 className="pf-project-title">{project.title}</h3>
          </div>
          <button
            type="button"
            className="pf-expand-btn"
            onClick={() => setExpanded((prev) => !prev)}
            aria-expanded={expanded}
          >
            {expanded ? 'Less' : 'Details'}
          </button>
        </div>
        <p className="pf-project-description">{project.description}</p>

        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              className="pf-project-details"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
            >
              <Detail label="Problem" value={project.problem} />
              <Detail label="My Role" value={project.role} />
              <Detail label="Technologies" value={project.technologies.join(' · ')} />
              <Detail label="Business Impact" value={project.impact} />
              <Detail label="Lessons Learned" value={project.lessons} />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="pf-project-actions">
          {isExternal ? (
            <a href={href} target="_blank" rel="noreferrer" className="pf-btn pf-btn-primary pf-btn-sm">
              Visit Website
            </a>
          ) : (
            <Link to={href} className="pf-btn pf-btn-primary pf-btn-sm">
              Visit Website
            </Link>
          )}
          <button
            type="button"
            className="pf-btn pf-btn-secondary pf-btn-sm"
            onClick={() => setExpanded((prev) => !prev)}
          >
            {expanded ? 'Hide Case Study' : 'Case Study'}
          </button>
        </div>
      </div>
    </motion.article>
  );
};

const Detail = ({ label, value }) => (
  <div className="pf-project-detail">
    <span className="pf-project-detail-label">{label}</span>
    <p className="pf-project-detail-value">{value}</p>
  </div>
);

const ProjectsSection = () => (
  <SectionWrapper id="projects">
    <div className="pf-container">
      <SectionHeader
        eyebrow="Featured Projects"
        title="Things I've built and shipped."
        description="Real problems, my role in each, and what changed."
      />
      <div className="pf-projects-grid">
        {featuredProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      <div className="pf-client-projects">
        <h3 className="pf-client-projects-title">Other Client Projects</h3>
        <div className="pf-client-grid">
          {clientProjects.map((project) => {
            const cardContent = (
              <>
                {project.logo && (
                  <img src={project.logo} alt={project.title} className="pf-client-logo" loading="lazy" />
                )}
                <span className="pf-client-sector">{project.sector}</span>
                <h4 className="pf-client-title">{project.title}</h4>
                <p className="pf-client-summary">{project.summary}</p>
              </>
            );

            if (project.url) {
              return (
                <motion.a
                  key={project.title}
                  href={project.url}
                  target="_blank"
                  rel="noreferrer"
                  className="pf-client-card"
                  whileHover={{ y: -4 }}
                >
                  {cardContent}
                </motion.a>
              );
            }

            return (
              <motion.article key={project.title} className="pf-client-card" whileHover={{ y: -4 }}>
                {cardContent}
              </motion.article>
            );
          })}
        </div>
      </div>
    </div>
  </SectionWrapper>
);

export default ProjectsSection;
