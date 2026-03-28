import React from 'react';

const ChapterReader = ({ title, content }) => {
  return (
    <article className="chapter-reader">
      {title && (
        <h2 className="chapter-heading">
          {title}
        </h2>
      )}
      
      <div 
        className="chapter-content"
        dangerouslySetInnerHTML={{ __html: content }} 
      />
    </article>
  );
};

export default ChapterReader;
