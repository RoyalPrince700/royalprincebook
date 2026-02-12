import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ThemeToggle from './ThemeToggle';
import '../App.css'; // Ensure styles are available

const Navbar = ({ isHome }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className={`navbar ${isHome ? 'home-mode' : ''}`}>
      <Link
        to="/"
        style={{
          textDecoration: 'none',
          color: 'inherit'
        }}
      >
        <h1 className="navbar-logo-text">
          <span className="show-desktop">Royal Prince Book</span>
          <span className="show-mobile">RPB</span>
        </h1>
      </Link>
      <div className="navbar-actions">
        <div className="desktop-nav-items">
          <ThemeToggle />
        </div>
        {user ? (
          <>
            <div className="desktop-nav-items">
              <span style={{ color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                Welcome, {user.username}!
              </span>
            </div>
            <Link to="/dashboard">
              <button className="btn-primary">
                Dashboard
              </button>
            </Link>
            <div className="desktop-nav-items">
              <button
                onClick={handleLogout}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: 'transparent',
                  border: '1px solid var(--text-primary)',
                  borderRadius: '4px',
                  color: 'var(--text-primary)',
                  cursor: 'pointer'
                }}
              >
                Logout
              </button>
            </div>
          </>
        ) : (
          <>
            <Link to="/register">
              <button className="btn-netflix hero-cta">
                <span>Explore My Books</span>
                <span style={{ fontSize: '1.2em' }}>→</span>
              </button>
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Navbar;
