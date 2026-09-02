import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { getRedirectPath } from '../utils/authRedirect';
import { buildLoginPath } from '../utils/requireAuth';
import { isPremiumUser } from '../utils/bookAccess';
import NavIcon from './NavIcon';
import BrandMark from './BrandMark';
import '../portfolio/styles/portfolio.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const menuButtonRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMenuOpen(false);
  };

  const closeMenu = () => setIsMenuOpen(false);
  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  const isAdmin = user?.role === 'admin';
  const isPremium = isPremiumUser(user);
  const redirectPath = getRedirectPath(location);
  const loginHref = buildLoginPath(redirectPath);

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

  if (isPremium) {
    navLinks.push({ to: '/event', label: 'Event', icon: 'event' });
  }

  if (isAdmin) {
    navLinks.push({ to: '/admin', label: 'Admin', icon: 'admin' });
  }

  const isActive = (to) => {
    if (to === '/') return location.pathname === '/';
    return location.pathname === to || location.pathname.startsWith(`${to}/`);
  };

  useEffect(() => {
    closeMenu();
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current?.contains(event.target) ||
        menuButtonRef.current?.contains(event.target)
      ) {
        return;
      }
      closeMenu();
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        closeMenu();
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isMenuOpen]);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const mobileMenu = (
    <div
      className={`pf-site-nav-mobile ${isMenuOpen ? 'pf-site-nav-mobile-open' : ''} ${
        theme === 'dark' ? 'pf-site-nav-dark' : ''
      }`}
    >
      <button
        type="button"
        className="pf-site-nav-mobile-backdrop"
        onClick={closeMenu}
        aria-label="Close menu"
      />
      <div ref={menuRef} id="site-mobile-menu" className="pf-site-nav-mobile-panel">
        <div className="pf-site-nav-mobile-header">
          <Link to="/" className="pf-site-nav-mobile-brand" onClick={closeMenu}>
            <BrandMark />
            <span className="pf-site-nav-mobile-brand-text">Royal Prince Hub</span>
          </Link>
          <button type="button" onClick={closeMenu} className="pf-site-nav-close" aria-label="Close menu">
            <NavIcon name="close" />
          </button>
        </div>

        <nav className="pf-site-nav-mobile-links" aria-label="Main navigation">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`pf-site-nav-mobile-link ${
                isActive(link.to) ? 'pf-site-nav-mobile-link-active' : ''
              }`}
              onClick={closeMenu}
            >
              <NavIcon name={link.icon} className="pf-site-nav-mobile-link-icon" />
              <span>{link.label}</span>
            </Link>
          ))}
        </nav>

        <div className="pf-site-nav-mobile-footer">
          <button type="button" className="pf-site-nav-mobile-theme" onClick={toggleTheme}>
            <NavIcon name={theme === 'light' ? 'moon' : 'sun'} className="pf-site-nav-mobile-link-icon" />
            <span>{theme === 'light' ? 'Dark mode' : 'Light mode'}</span>
          </button>

          {user ? (
            <>
              <div className="pf-site-nav-mobile-user-row">
                <p className="pf-site-nav-mobile-user">{user.username}</p>
                {isPremium ? <span className="pf-premium-badge">Premium</span> : null}
              </div>
              <button type="button" onClick={handleLogout} className="pf-site-nav-auth-btn pf-site-nav-auth-btn-full">
                Log out
              </button>
            </>
          ) : (
            <Link to={loginHref} className="pf-site-nav-auth-btn pf-site-nav-auth-btn-full" onClick={closeMenu}>
              Sign in
            </Link>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <header
        className={`pf-desktop-section-nav pf-site-nav ${theme === 'dark' ? 'pf-site-nav-dark' : ''}`}
      >
      <div className="pf-container pf-desktop-section-nav-inner">
        <Link to="/" className="pf-desktop-section-nav-brand" onClick={closeMenu} aria-label="Royal Prince Hub home">
          <BrandMark />
          <span className="pf-site-nav-brand-text">Royal Prince Hub</span>
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
              <div className="pf-site-nav-user-row">
                <span className="pf-site-nav-user">{user.username}</span>
                {isPremium ? <span className="pf-premium-badge">Premium</span> : null}
              </div>
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
            className="pf-desktop-section-nav-theme pf-site-nav-theme-desktop"
            onClick={toggleTheme}
            title={theme === 'light' ? 'Dark mode' : 'Light mode'}
            aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          >
            <NavIcon name={theme === 'light' ? 'moon' : 'sun'} />
          </button>

          <button
            type="button"
            ref={menuButtonRef}
            onClick={toggleMenu}
            className="pf-site-nav-menu-btn"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMenuOpen}
            aria-controls="site-mobile-menu"
          >
            <NavIcon name={isMenuOpen ? 'close' : 'menu'} />
          </button>
        </div>
      </div>
      </header>
      {createPortal(mobileMenu, document.body)}
    </>
  );
};

export default Navbar;
