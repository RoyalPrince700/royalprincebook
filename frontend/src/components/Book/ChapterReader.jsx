import React from 'react';

const ChapterReader = ({ title, content }) => {
  return (
    <div className="chapter-reader" style={{
      maxWidth: '800px',
      margin: '0 auto',
      padding: '2rem',
      backgroundColor: 'var(--card-bg)',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      borderRadius: '8px',
      lineHeight: '1.8',
      fontSize: '1.1rem',
      color: 'var(--text-primary)'
    }}>
      {title && (
        <h2 style={{
          textAlign: 'center',
          marginBottom: '2rem',
          fontSize: '2rem',
          color: 'var(--text-primary)',
          borderBottom: '2px solid var(--border-color)',
          paddingBottom: '1rem'
        }}>
          {title}
        </h2>
      )}
      
      <div 
        className="chapter-content"
        dangerouslySetInnerHTML={{ __html: content }} 
        style={{
          fontFamily: "'Merriweather', 'Georgia', serif"
        }}
      />
    </div>
  );
};

export default ChapterReader;
