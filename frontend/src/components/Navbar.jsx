import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import '../App.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Handle scroll effect for Apple-style navbar
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const isAdmin = user?.role === 'admin';

  // Handle click outside to close menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        closeMenu();
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const isHome = location.pathname === '/';
  const cartLabel = itemCount > 0 ? `Cart (${itemCount})` : 'Cart';
  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/all-books', label: 'Books' },
    { to: '/blog', label: 'Blog' },
    { to: '/cart', label: cartLabel },
    { to: '/about-author', label: 'About Author' }
  ];

  if (user) {
    navLinks.push({ to: '/dashboard', label: 'Dashboard' });
  }

  if (isAdmin) {
    navLinks.push({ to: '/admin', label: 'Admin' });
  }

  const isTransparent = isHome && !scrolled && !isMenuOpen;
  const shellClass = isTransparent
    ? 'border-transparent bg-transparent shadow-none'
    : 'border-white/70 bg-white/78 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl';

  const getLinkClassName = (to) => {
    const isActive = location.pathname === to;
    return `rounded-full px-4 py-2 text-sm font-medium transition ${
      isActive
        ? 'bg-slate-950 text-white'
        : 'text-slate-600 hover:bg-white/80 hover:text-slate-950'
    }`;
  };

  const getLinkStyle = (to) => (
    location.pathname === to ? { color: '#fff' } : undefined
  );

  return (
    <header className="fixed left-0 right-0 top-0 z-50 transition-all duration-300 ease-out">
      <div className="mx-auto max-w-7xl px-4  sm:px-6 lg:px-8">
        <div
          className={`flex min-h-16 items-center justify-between rounded-4xl border px-4 py-3 transition-all duration-300 sm:px-5 ${shellClass}`}
        >
          <div className="flex shrink-0 items-center">
            <Link
              to="/"
              className="inline-flex items-center gap-3 rounded-full px-2 py-1 text-slate-950 transition hover:opacity-85"
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white/90 shadow-sm">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </span>
              <span className="hidden sm:block">
                <span className="block text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                  RoyalPrince
                </span>
                <span className="block text-sm font-semibold tracking-tight text-slate-950">
                  Hub
                </span>
              </span>
            </Link>
          </div>

          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={getLinkClassName(link.to)}
                style={getLinkStyle(link.to)}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            {user ? (
              <>
                <div className="rounded-full border border-slate-200 bg-white/75 px-4 py-2 text-sm font-medium text-slate-500">
                  {user.username}
                </div>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white/80 px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-white"
                >
                  Log out
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-full bg-slate-950 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
             style={{ color: 'white' }}>
                Sign in
              </Link>
            )}
          </div>

          <button
            onClick={toggleMenu}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white/85 text-slate-700 transition hover:bg-white md:hidden"
            aria-label="Toggle menu"
          >
            <div className="flex flex-col gap-1">
              <span className={`block h-0.5 w-5 bg-current transition-transform duration-300 ${isMenuOpen ? 'translate-y-1.5 rotate-45' : ''}`}></span>
              <span className={`block h-0.5 w-5 bg-current transition-opacity duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`block h-0.5 w-5 bg-current transition-transform duration-300 ${isMenuOpen ? '-translate-y-1.5 -rotate-45' : ''}`}></span>
            </div>
          </button>
        </div>
      </div>

      <div className={`fixed inset-0 z-40 md:hidden ${isMenuOpen ? 'visible' : 'invisible'}`}>
        <div
          className={`absolute inset-0 bg-slate-950/30 backdrop-blur-sm transition-opacity duration-300 ${
            isMenuOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={closeMenu}
          aria-hidden="true"
        />
        <div
          ref={menuRef}
          className={`absolute right-4 top-4 w-[calc(100%-2rem)] max-w-sm rounded-4xl border border-white/70 bg-white/92 p-5 shadow-[0_24px_80px_rgba(15,23,42,0.16)] backdrop-blur-xl transition-all duration-300 ${
            isMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-3 opacity-0'
          }`}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                Navigation
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
                Menu
              </h2>
            </div>
            <button
              onClick={closeMenu}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50"
              aria-label="Close menu"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <nav className="mt-6 flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`rounded-2xl px-4 py-3 text-sm font-medium transition ${
                  location.pathname === link.to
                    ? 'bg-slate-950 text-white'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
                style={getLinkStyle(link.to)}
                onClick={closeMenu}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="mt-6 border-t border-slate-200 pt-5">
            {user ? (
              <div className="space-y-3">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Signed in as
                  </p>
                  <p className="mt-1 text-sm font-medium text-slate-900">{user.username}</p>
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    closeMenu();
                  }}
                  className="inline-flex w-full items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
                >
                  Log out
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <Link
                  to="/login"
                  className="inline-flex w-full items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
                  onClick={closeMenu}
              style={{ color: 'white' }} >
                  Sign in
                </Link>
             
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
