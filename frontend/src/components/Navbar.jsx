import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
// import ThemeToggle from './ThemeToggle';
import '../App.css'; 

const Navbar = () => {
  const { user, logout } = useAuth();
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
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

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

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
        scrolled || !isHome 
          ? 'bg-white/80 backdrop-blur-md border-b border-gray-200/50 supports-[backdrop-filter]:bg-white/60' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-12">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-gray-900 font-semibold tracking-tight hover:opacity-80 transition-opacity">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/all-books" className="text-xs text-gray-700 hover:text-black transition-colors">
              Books
            </Link>
            <Link to="/about-author" className="text-xs text-gray-700 hover:text-black transition-colors">
              About Author
            </Link>
            {user ? (
              <>
                <Link to="/dashboard" className="text-xs text-gray-700 hover:text-black transition-colors">
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-xs text-gray-700 hover:text-black transition-colors"
                >
                  Log out
                </button>
                <div className="w-px h-4 bg-gray-300 mx-2"></div>
                <span className="text-xs text-gray-500">
                  {user.username}
                </span>
              </>
            ) : (
              <>
                <Link to="/login" className="text-xs text-gray-700 hover:text-black transition-colors">
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="px-3 py-1 text-xs text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-colors"
                >
                  Sign up
                </Link>
              </>
            )}
            {/* <div className="ml-2">
              <ThemeToggle />
            </div> */}
          </nav>

          {/* Hamburger Menu Button - Only visible on smaller screens */}
          <button
            onClick={toggleMenu}
            className="md:hidden flex flex-col justify-center items-center w-8 h-8 space-y-1 hover:bg-gray-100 rounded-md transition-colors p-1"
            aria-label="Toggle menu"
          >
            <span className={`block w-5 h-0.5 bg-gray-700 transition-transform duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
            <span className={`block w-5 h-0.5 bg-gray-700 transition-opacity duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`block w-5 h-0.5 bg-gray-700 transition-transform duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
          </button>
        </div>
      </div>

      {/* Hamburger Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 transition-all duration-500 ease-in-out ${
          isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      >
        <div
          ref={menuRef}
          className={`absolute top-0 left-0 h-full w-80 bg-white shadow-2xl transform transition-transform duration-500 ease-in-out ${
            isMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {/* Menu Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
            <button
              onClick={closeMenu}
              className="p-2 hover:bg-gray-100 rounded-md transition-colors"
              aria-label="Close menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Menu Content */}
          <nav className="flex flex-col py-4">
            <Link
              to="/all-books"
              className="px-6 py-3 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
              onClick={closeMenu}
            >
              Books
            </Link>
            <Link
              to="/about-author"
              className="px-6 py-3 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
              onClick={closeMenu}
            >
              About Author
            </Link>

            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="px-6 py-3 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                  onClick={closeMenu}
                >
                  Dashboard
                </Link>
                <div className="border-t border-gray-200 my-2"></div>
                <div className="px-6 py-2">
                  <span className="text-sm text-gray-500 block mb-2">Welcome, {user.username}</span>
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    closeMenu();
                  }}
                  className="px-6 py-3 text-left text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <div className="border-t border-gray-200 my-2"></div>
                <Link
                  to="/login"
                  className="px-6 py-3 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                  onClick={closeMenu}
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="mx-6 my-3 px-4 py-2 text-center text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-colors"
                  style={{ color: 'white' }}
                  onClick={closeMenu}
                >
                  Sign up
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
