import React, { useEffect, useRef, useState } from 'react';

const MOBILE_QUERY = '(max-width: 767px)';

const SwipeCardRail = ({
  children,
  className = '',
  ariaLabel = 'Swipe to browse',
  variant = 'default',
}) => {
  const trackRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [slideCount, setSlideCount] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(MOBILE_QUERY);
    const updateViewport = () => setIsMobile(mediaQuery.matches);

    updateViewport();
    mediaQuery.addEventListener('change', updateViewport);

    return () => mediaQuery.removeEventListener('change', updateViewport);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || !isMobile) {
      setSlideCount(0);
      return undefined;
    }

    const slides = Array.from(track.children);
    setSlideCount(slides.length);

    const handleScroll = () => {
      if (!slides.length) return;

      const center = track.scrollLeft + track.clientWidth / 2;
      let closestIndex = 0;
      let minDistance = Infinity;

      slides.forEach((slide, index) => {
        const slideCenter = slide.offsetLeft + slide.offsetWidth / 2;
        const distance = Math.abs(center - slideCenter);
        if (distance < minDistance) {
          minDistance = distance;
          closestIndex = index;
        }
      });

      setActiveIndex(closestIndex);
    };

    handleScroll();
    track.addEventListener('scroll', handleScroll, { passive: true });

    return () => track.removeEventListener('scroll', handleScroll);
  }, [children, isMobile]);

  const scrollToIndex = (index) => {
    const track = trackRef.current;
    const slide = track?.children[index];
    if (!slide) return;

    slide.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
  };

  const variantClass = variant !== 'default' ? `pf-swipe-rail-${variant}` : '';

  return (
    <div
      className={`pf-swipe-rail ${variantClass} ${className}`.trim()}
      role="region"
      aria-label={ariaLabel}
    >
      <div className="pf-swipe-rail-track" ref={trackRef}>
        {children}
      </div>

      {isMobile && slideCount > 1 && (
        <div className="pf-swipe-rail-footer">
          <div className="pf-swipe-rail-dots" role="tablist" aria-label="Card position">
            {Array.from({ length: slideCount }, (_, index) => (
              <button
                key={index}
                type="button"
                role="tab"
                className={`pf-swipe-rail-dot ${index === activeIndex ? 'pf-swipe-rail-dot-active' : ''}`}
                aria-label={`Go to card ${index + 1} of ${slideCount}`}
                aria-selected={index === activeIndex}
                onClick={() => scrollToIndex(index)}
              />
            ))}
          </div>
          <p className="pf-swipe-rail-hint">Swipe to explore</p>
        </div>
      )}
    </div>
  );
};

export default SwipeCardRail;
