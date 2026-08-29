import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { getRedirectPath } from '../utils/authRedirect';
import NavIcon from './NavIcon';
import '../portfolio/styles/portfolio.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const closeMenu = () => setIsMenuOpen(false);
  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  const isAdmin = user?.role === 'admin';
  const redirectPath = getRedirectPath(location);
  const loginHref = redirectPath
    ? `/login?redirect=${encodeURIComponent(redirectPath)}`
    : '/login';

  const navLinks = [
    { to: '/', label: 'Home', icon: 'home' },
    { to: '/all-books', label: 'Books', icon: 'book' },
    { to: '/blog', label: 'Blog', icon: 'blog' },
    { to: '/taskboard', label: 'Taskboard', icon: 'taskboard' },
    { to: '/noteboard', label: 'Noteboard', icon: 'noteboard' }
  ];

  if (user) {
    navLinks.push({ to: '/dashboard', label: 'Dashboard', icon: 'dashboard' });
  }

  if (isAdmin) {
    navLinks.push({ to: '/admin', label: 'Admin', icon: 'admin' });
  }

  const isActive = (to) => {
    if (to === '/') return location.pathname === '/';
    return location.pathname === to || location.pathname.startsWith(`${to}/`);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        closeMenu();
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  return (
    <header
      className={`pf-desktop-section-nav pf-site-nav ${theme === 'dark' ? 'pf-site-nav-dark' : ''}`}
    >
      <div className="pf-container pf-desktop-section-nav-inner">
        <Link to="/" className="pf-desktop-section-nav-brand" onClick={closeMenu} aria-label="Royal Prince home">
          <span className="pf-desktop-section-nav-brand-mark">RP</span>
        </Link>

        <nav className="pf-desktop-section-nav-scroll" aria-label="Main navigation">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`pf-desktop-section-nav-link ${
                isActive(link.to) ? 'pf-desktop-section-nav-link-active' : ''
              }`}
              onClick={closeMenu}
            >
              <NavIcon name={link.icon} />
              <span>{link.label}</span>
            </Link>
          ))}
        </nav>

        <div className="pf-site-nav-end">
          {user ? (
            <div className="pf-site-nav-auth pf-site-nav-auth-desktop">
              <span className="pf-site-nav-user">{user.username}</span>
              <button type="button" onClick={handleLogout} className="pf-site-nav-auth-btn">
                Log out
              </button>
            </div>
          ) : (
            <Link to={loginHref} className="pf-site-nav-auth-btn pf-site-nav-auth-desktop" onClick={closeMenu}>
              Sign in
            </Link>
          )}

          <button
            type="button"
            className="pf-desktop-section-nav-theme"
            onClick={toggleTheme}
            title={theme === 'light' ? 'Dark mode' : 'Light mode'}
            aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          >
            <NavIcon name={theme === 'light' ? 'moon' : 'sun'} />
          </button>

          <button
            type="button"
            onClick={toggleMenu}
            className="pf-site-nav-menu-btn"
            aria-label="Open account menu"
            aria-expanded={isMenuOpen}
          >
            <NavIcon name="user" />
          </button>
        </div>
      </div>

      <div className={`pf-site-nav-mobile ${isMenuOpen ? 'pf-site-nav-mobile-open' : ''}`}>
        <button
          type="button"
          className="pf-site-nav-mobile-backdrop"
          onClick={closeMenu}
          aria-hidden="true"
        />
        <div ref={menuRef} className="pf-site-nav-mobile-panel">
          <div className="pf-site-nav-mobile-header">
            <div>
              <p className="pf-section-label">Account</p>
              <h2 className="pf-section-heading">{user ? user.username : 'Welcome'}</h2>
            </div>
            <button type="button" onClick={closeMenu} className="pf-site-nav-close" aria-label="Close menu">
              ×
            </button>
          </div>

          <div className="pf-site-nav-mobile-footer">
            {user ? (
              <button type="button" onClick={handleLogout} className="pf-site-nav-auth-btn pf-site-nav-auth-btn-full">
                Log out
              </button>
            ) : (
              <Link to={loginHref} className="pf-site-nav-auth-btn pf-site-nav-auth-btn-full" onClick={closeMenu}>
                Sign in
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
