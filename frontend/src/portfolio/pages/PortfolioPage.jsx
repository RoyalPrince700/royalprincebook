import React, { Suspense } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { usePortfolioSEO } from '../hooks/usePortfolioSEO';
import { usePortfolioNav } from '../context/PortfolioNavContext';
import { useScrollProgress, useShowBackToTop } from '../hooks/useScrollProgress';
import ScrollProgress from '../components/ScrollProgress';
import BackToTop from '../components/BackToTop';
import PortfolioSidebar from '../components/PortfolioSidebar';
import HeroSection from '../components/HeroSection';
import TrustSection from '../components/TrustSection';
import AboutSection from '../components/AboutSection';
import ImpactSection from '../components/ImpactSection';
import WhatIDoSection from '../components/WhatIDoSection';
import ProjectsSection from '../components/ProjectsSection';
import CaseStudiesSection from '../components/CaseStudiesSection';
import LeadershipTimeline from '../components/LeadershipTimeline';
import SkillsSection from '../components/SkillsSection';
import MediaSection from '../components/MediaSection';
import WritingSection from '../components/WritingSection';
import TestimonialsSection from '../components/TestimonialsSection';
import PhilosophySection from '../components/PhilosophySection';
import CurrentFocusSection from '../components/CurrentFocusSection';
import TechStackSection from '../components/TechStackSection';
import ContactSection from '../components/ContactSection';
import PortfolioFooter from '../components/PortfolioFooter';
import PageLoader from '../../components/PageLoader';
import '../styles/portfolio.css';

const PortfolioPage = () => {
  const { theme } = useTheme();
  const { sectionNavActive } = usePortfolioNav();
  const progress = useScrollProgress();
  const showBackToTop = useShowBackToTop();
  usePortfolioSEO();

  return (
    <div
      className={`portfolio-page ${theme === 'dark' ? 'portfolio-page-dark' : ''} ${
        sectionNavActive ? 'pf-section-nav-active' : ''
      }`}
    >
      <ScrollProgress progress={progress} />
      <PortfolioSidebar progress={progress} />
      <Suspense fallback={<PageLoader />}>
        <main className="pf-main">
          <HeroSection />
          <TrustSection />
          <AboutSection />
          <ImpactSection />
          <WhatIDoSection />
          <ProjectsSection />
          <CaseStudiesSection />
          <LeadershipTimeline />
          <SkillsSection />
          <MediaSection />
          <WritingSection />
          <TestimonialsSection />
          <PhilosophySection />
          <CurrentFocusSection />
          <TechStackSection />
          <ContactSection />
        </main>
      </Suspense>
      <PortfolioFooter />
      <BackToTop visible={showBackToTop} />
    </div>
  );
};

export default PortfolioPage;
