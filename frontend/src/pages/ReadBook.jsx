import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import ChapterReader from '../components/Book/ChapterReader';
import './ReadBook.css';

const ReadBook = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPageNum, setCurrentPageNum] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [downloadDropdownOpen, setDownloadDropdownOpen] = useState(false);

  // Auto-close sidebar on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    // Initial check
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    fetchBook();
  }, [bookId]);

  const fetchBook = async () => {
    try {
      const response = await axios.get(`/books/${bookId}`);
      setBook(response.data.book);
    } catch (error) {
      console.error('Failed to fetch book:', error);
      setError('Failed to load book');
    } finally {
      setLoading(false);
    }
  };

  const getCurrentPage = () => {
    if (!book || !book.pages) return null;
    return book.pages.find(p => p.pageNumber === currentPageNum);
  };

  const handleNextPage = () => {
    const maxPage = Math.max(...book.pages.map(p => p.pageNumber));
    if (currentPageNum < maxPage) {
      setCurrentPageNum(prev => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePrevPage = () => {
    if (currentPageNum > 1) {
      setCurrentPageNum(prev => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleDownload = async (format) => {
    try {
      const response = await axios.get(`/export/${format}/${bookId}`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${book.title}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download book');
    }
  };

  if (loading) {
    return (
      <div className="read-book-container" style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div className="card text-center">
          <h3>Loading book...</h3>
        </div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="read-book-container" style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div className="card text-center">
          <h3>{error || 'Book not found'}</h3>
          <Link to="/dashboard">Back to Dashboard</Link>
        </div>
      </div>
    );
  }

  const currentPage = getCurrentPage();
  const totalPages = book.pages.length;

  return (
    <div className="read-book-container">
      {/* Reader Header */}
      <header className="reader-header">
        <div className="header-left">
          <h1 className="book-title">
            <span style={{ fontWeight: 'bold' }}>{book.title}</span>
          </h1>
        </div>

        <div className="header-right">
           {/* Download Dropdown */}
           <div style={{ position: 'relative' }}>
             <button 
               className="btn-secondary" 
               onClick={() => setDownloadDropdownOpen(!downloadDropdownOpen)}
               style={{ fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
             >
               Download ▾
             </button>
             
             {downloadDropdownOpen && (
               <div className="download-dropdown">
                 <button 
                   className="download-option"
                   onClick={() => {
                     handleDownload('pdf');
                     setDownloadDropdownOpen(false);
                   }}
                 >
                   Download as PDF
                 </button>
                 <button 
                   className="download-option"
                   onClick={() => {
                     handleDownload('docx');
                     setDownloadDropdownOpen(false);
                   }}
                 >
                   Download as Word
                 </button>
               </div>
             )}
           </div>

           {/* Edit Mode Icon Button */}
           {user?.role === 'admin' && (
             <Link to={`/books/${bookId}`} className="edit-button-link" style={{ textDecoration: 'none' }}>
              <button 
                className="btn-secondary" 
                title="Edit Mode"
                style={{ 
                  fontSize: '0.9rem',
                  padding: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '36px',
                  width: '36px'
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
              </button>
            </Link>
           )}
        </div>
      </header>

      <div className="reader-body">
        {/* Table of Contents Sidebar */}
        <div className={`sidebar-container ${sidebarOpen ? 'open' : 'closed'}`} style={{
            width: sidebarOpen ? '280px' : '0' // Keep inline style for desktop override if needed, but CSS handles mobile
        }}>
            <div className="sidebar-content" style={{ 
                display: sidebarOpen ? 'block' : 'none'
            }}>
                <h3 style={{ marginTop: 0, marginBottom: '1.5rem', fontSize: '1.1rem', color: '#888', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Table of Contents
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {book.pages
                    .sort((a, b) => a.pageNumber - b.pageNumber)
                    .map((page) => (
                    <button
                    key={page.pageNumber}
                    className="toc-button"
                    onClick={() => {
                        setCurrentPageNum(page.pageNumber);
                        window.scrollTo(0, 0);
                        if (window.innerWidth < 768) setSidebarOpen(false); // Auto-close on mobile selection
                    }}
                    style={{
                        backgroundColor: currentPageNum === page.pageNumber ? 'var(--input-bg)' : 'transparent',
                        color: currentPageNum === page.pageNumber ? 'var(--primary-color)' : 'var(--text-secondary)',
                        fontWeight: currentPageNum === page.pageNumber ? 'bold' : 'normal',
                    }}
                    >
                    <span style={{ opacity: 0.5, marginRight: '8px' }}>{page.pageNumber}.</span>
                    {page.title || 'Untitled Chapter'}
                    </button>
                ))}
                </div>
            </div>

            {/* Toggle Button on the Edge */}
            <button
                className="sidebar-toggle"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                title={sidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
            >
                {sidebarOpen ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                )}
            </button>
        </div>

        {/* Main Reading Area */}
        <div className="content-area">
          {currentPage ? (
            <>
              <ChapterReader 
                title={currentPage.title} 
                content={currentPage.formattedContent || currentPage.rawContent} 
              />
              
              {/* Navigation Controls */}
              <div className="nav-controls">
                <button
                  className="btn-secondary"
                  onClick={handlePrevPage}
                  disabled={currentPageNum <= 1}
                  style={{ visibility: currentPageNum <= 1 ? 'hidden' : 'visible' }}
                >
                  ← Previous Chapter
                </button>
                
                <span style={{ color: '#999' }}>
                  Page {currentPageNum} of {totalPages}
                </span>

                <button
                  className="btn-primary"
                  onClick={handleNextPage}
                  disabled={currentPageNum >= Math.max(...book.pages.map(p => p.pageNumber), 0)}
                  style={{ visibility: currentPageNum >= Math.max(...book.pages.map(p => p.pageNumber), 0) ? 'hidden' : 'visible' }}
                >
                  Next Chapter →
                </button>
              </div>
            </>
          ) : (
             <div style={{ textAlign: 'center', marginTop: '3rem', color: '#666' }}>
              <p>No content available for this page.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReadBook;