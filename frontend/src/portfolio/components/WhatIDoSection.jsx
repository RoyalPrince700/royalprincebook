import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { whatIDo } from '../data/portfolioData';
import SectionWrapper, { SectionHeader } from './SectionWrapper';
import SwipeCardRail from './SwipeCardRail';

const iconMap = {
  code: '⌘',
  chart: '◈',
  megaphone: '◎',
  users: '◉',
  flag: '⚑',
  compass: '✦',
  camera: '◌',
  mic: '◍',
  handshake: '⬡',
  settings: '⚙'
};

const WhatIDoSection = () => {
  const [active, setActive] = useState(null);

  return (
    <SectionWrapper id="services">
      <div className="pf-container">
        <SectionHeader eyebrow="What I Do" title="I don't just plan. I build." />
        <SwipeCardRail className="pf-services-grid" ariaLabel="Services">
          {whatIDo.map((item) => (
            <motion.article
              key={item.title}
              className={`pf-service-card ${active === item.title ? 'pf-service-card-active' : ''}`}
              onMouseEnter={() => setActive(item.title)}
              onMouseLeave={() => setActive(null)}
              whileHover={{ y: -5 }}
              layout
            >
              <span className="pf-service-icon">{iconMap[item.icon]}</span>
              <h3 className="pf-service-title">{item.title}</h3>
              <motion.p
                className="pf-service-summary"
                animate={{ opacity: active === item.title ? 1 : 0.78, height: 'auto' }}
              >
                {item.summary}
              </motion.p>
            </motion.article>
          ))}
        </SwipeCardRail>
      </div>
    </SectionWrapper>
  );
};

export default WhatIDoSection;
