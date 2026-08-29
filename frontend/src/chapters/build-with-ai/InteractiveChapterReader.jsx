import React from 'react';
import './chapter4-demos.css';
import './chapter5-demos.css';
import './chapter6-demos.css';
import '../../portfolio/styles/portfolio.css';

const InteractiveChapterReader = ({ title, segments = [], demoMap = {} }) => (
  <article className="chapter-reader chapter-reader-interactive">
    {title && <h2 className="chapter-heading">{title}</h2>}

    <div className="chapter-content chapter-content-interactive">
      {segments.map((segment, index) => {
        if (segment.type === 'demo') {
          const DemoComponent = demoMap[segment.id];
          if (!DemoComponent) return null;
          return (
            <div key={`demo-${segment.id}-${index}`} className="chapter-demo-block">
              <DemoComponent />
            </div>
          );
        }

        return (
          <div
            key={`html-${index}`}
            dangerouslySetInnerHTML={{ __html: segment.content }}
          />
        );
      })}
    </div>
  </article>
);

export default InteractiveChapterReader;
