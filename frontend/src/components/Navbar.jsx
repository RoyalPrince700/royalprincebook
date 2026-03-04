import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
// import ThemeToggle from './ThemeToggle';
import '../App.css'; 

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

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
                  className="px-3 py-1 text-xs text-white !text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-colors"
                >
                  Sign up
                </Link>
              </>
            )}
            {/* <div className="ml-2">
              <ThemeToggle />
            </div> */}
          </nav>

          {/* Mobile Menu Button (simplified) */}
          <div className="md:hidden flex items-center gap-4">
             {/* <ThemeToggle /> */}
            {user ? (
               <Link to="/dashboard" className="text-sm font-medium text-gray-900">
                 Dashboard
               </Link>
            ) : (
               <Link to="/login" className="text-sm font-medium text-gray-900">
                 Log in
               </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
