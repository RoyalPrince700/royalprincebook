import React from 'react';
import { Link } from 'react-router-dom';
import NavIcon from './NavIcon';

const BoardWebsiteLink = ({ className = '' }) => (
  <Link
    to="/"
    className={`wb-website-link ${className}`.trim()}
    aria-label="Back to website"
    title="Back to website"
  >
    <NavIcon name="home" className="wb-website-link-icon" />
  </Link>
);

export default BoardWebsiteLink;
