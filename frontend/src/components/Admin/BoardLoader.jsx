import React from 'react';
import './BoardLoader.css';

const BoardLoader = ({ label = 'Loading…' }) => (
  <div className="board-loader" role="status" aria-live="polite" aria-label={label}>
    <div className="board-loader-dot" aria-hidden="true" />
    <p className="board-loader-label">{label}</p>
  </div>
);

export default BoardLoader;
