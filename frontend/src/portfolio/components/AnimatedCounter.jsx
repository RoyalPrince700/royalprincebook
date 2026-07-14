import React, { useEffect, useRef, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

const AnimatedCounter = ({ value, suffix = '', display }) => {
  const [started, setStarted] = useState(false);
  const ref = useRef(null);

  const spring = useSpring(0, { stiffness: 60, damping: 20 });
  const rounded = useTransform(spring, (latest) => Math.round(latest).toLocaleString());
  const [output, setOutput] = useState('0');

  useEffect(() => {
    if (!value || !started) return;
    spring.set(value);
  }, [value, started, spring]);

  useEffect(() => {
    const unsubscribe = rounded.on('change', (latest) => setOutput(latest));
    return () => unsubscribe();
  }, [rounded]);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setStarted(true);
      },
      { threshold: 0.35 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  if (display) {
    return (
      <span ref={ref} className="pf-stat-value">
        {display}
      </span>
    );
  }

  return (
    <span ref={ref} className="pf-stat-value">
      {started ? output : '0'}
      {suffix}
    </span>
  );
};

export default AnimatedCounter;
