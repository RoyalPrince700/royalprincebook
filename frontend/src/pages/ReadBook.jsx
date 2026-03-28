import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import ChapterReader from '../components/Book/ChapterReader';
import { useFlutterwave, closePaymentModal } from 'flutterwave-react-v3';
import { getOriginalBookPrice } from '../utils/bookUtils';
import PageLoader from '../components/PageLoader';
import './ReadBook.css';

const ReadBook = () => {
  const { bookId } = useParams();
  const { user, refreshProfile, addPurchasedBook } = useAuth();
  
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPageNum, setCurrentPageNum] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [downloadDropdownOpen, setDownloadDropdownOpen] = useState(false);
  const [flwPublicKey, setFlwPublicKey] = useState('');

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
    fetchPublicKey();
  }, [bookId]);

  const fetchPublicKey = async () => {
    try {
      const response = await axios.get('/config/flutterwave-public-key');
      setFlwPublicKey(response.data.publicKey);
    } catch (err) {
      console.error('Failed to fetch public key', err);
    }
  };

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

  // Payment Configuration
  const config = {
    public_key: flwPublicKey,
    tx_ref: Date.now(),
    amount: book?.price || 0,
    currency: 'NGN',
    payment_options: 'card,mobilemoney,ussd',
    customer: {
      email: user?.email,
      name: user?.username,
    },
    customizations: {
      title: `Purchase ${book?.title}`,
      description: 'Payment for book access',
      logo: 'https://st2.depositphotos.com/4403291/7418/v/450/depositphotos_74189661-stock-illustration-online-shop-log.jpg',
    },
  };

  const handleFlutterwavePayment = useFlutterwave(config);

  const handlePayment = () => {
    if (!flwPublicKey) {
      alert("Payment system initializing, please try again in a moment.");
      return;
    }
    
    handleFlutterwavePayment({
      callback: async (response) => {
        closePaymentModal();
        if (response.status === "successful") {
           try {
             // Verify payment on backend
             await axios.post('/payment/verify', {
               transaction_id: response.transaction_id,
               bookId: book._id
             });
             addPurchasedBook(book._id);
             await refreshProfile();
             alert("Payment successful! You can now read the book.");
           } catch (err) {
             console.error("Verification failed", err);
             alert("Payment verification failed. Please contact support.");
           }
        } else {
          alert("Payment failed.");
        }
      },
      onClose: () => {
        // Do nothing
      },
    });
  };

  if (loading) {
    return (
      <PageLoader
        title="Opening your book"
        message="Loading chapters, reader controls, and access details."
      />
    );
  }

  if (error || !book) {
    return (
      <div className="read-book-empty-state">
        <div className="read-book-message-card">
          <p className="reader-eyebrow">Reader</p>
          <h3 className="reader-message-title">{error || 'Book not found'}</h3>
          <Link to="/dashboard" className="reader-link-button">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // Check access
  const isAuthor = user && book.author && (user.id === book.author._id || user.id === book.author);
  const isAdmin = user && user.role === 'admin';
  const hasPurchased = user && user.purchasedBooks && user.purchasedBooks.includes(book._id);
  const isFree = !book.price || book.price === 0;
  const originalPrice = getOriginalBookPrice(book?.title, book?.price);

  const hasAccess = isAuthor || isAdmin || hasPurchased || isFree;

  if (!hasAccess) {
    return (
      <div className="read-book-empty-state">
        <div className="read-book-message-card read-book-purchase-card">
          <p className="reader-eyebrow">Premium Access</p>
          <h2 className="reader-message-title">{book.title}</h2>
          <p className="reader-message-copy">
            To continue into this reading experience, purchase the book and unlock full access.
          </p>
          <div className="reader-price-block">
            <span className="reader-price-label">
              {originalPrice ? 'Prelaunch price' : 'Price'}
            </span>
            <strong className="reader-price-value">NGN {book.price.toLocaleString()}</strong>
          </div>
          {originalPrice && (
            <p className="reader-original-price">
              Original price: NGN {originalPrice.toLocaleString()}
            </p>
          )}
          <p className="reader-message-copy">
            {originalPrice
              ? `Prelaunch access is live now at NGN ${book.price.toLocaleString()}. Standard price returns to NGN ${originalPrice.toLocaleString()}.`
              : `Buy now for NGN ${book.price.toLocaleString()}.`}
          </p>
          <button 
            className="reader-primary-button" 
            onClick={handlePayment}
          >
            Buy Now
          </button>
          <Link to="/dashboard" className="reader-text-link">Back to Dashboard</Link>
        </div>
      </div>
    );
  }

  const currentPage = getCurrentPage();
  const sortedPages = [...book.pages].sort((a, b) => a.pageNumber - b.pageNumber);
  const totalPages = sortedPages.length;
  const maxPageNumber = Math.max(...book.pages.map((p) => p.pageNumber), 0);

  return (
    <div className="read-book-container">
      <header className="reader-header">
        <div className="header-left">
          <div>
            <p className="reader-header-label">Now Reading</p>
            <h1 className="book-title">{book.title}</h1>
          </div>
        </div>

        <div className="header-right">
           <div className="reader-pill">
             Chapter {currentPageNum} / {totalPages}
           </div>

           <div className="download-wrap">
             <button 
               className="reader-secondary-button" 
               onClick={() => setDownloadDropdownOpen(!downloadDropdownOpen)}
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

           {user?.role === 'admin' && (
             <Link to={`/books/${bookId}`} className="edit-button-link">
              <button 
                className="reader-icon-button" 
                title="Edit Mode"
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
        <aside className={`sidebar-container ${sidebarOpen ? 'open' : 'closed'}`}>
          <div className="sidebar-content">
            <p className="reader-sidebar-label">Table of Contents</p>
            <div className="toc-list">
              {sortedPages.map((page) => (
                <button
                  key={page.pageNumber}
                  className={`toc-button ${currentPageNum === page.pageNumber ? 'active' : ''}`}
                  onClick={() => {
                    setCurrentPageNum(page.pageNumber);
                    window.scrollTo(0, 0);
                    if (window.innerWidth < 768) setSidebarOpen(false);
                  }}
                >
                  <span className="toc-number">{page.pageNumber}.</span>
                  <span>{page.title || 'Untitled Chapter'}</span>
                </button>
              ))}
            </div>
          </div>

          <button
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            title={sidebarOpen ? 'Collapse Sidebar' : 'Expand Sidebar'}
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
        </aside>

        <div className="content-area">
          <div className="reader-top-meta">
            <div>
              <p className="reader-content-label">Reading Experience</p>
              <h2 className="reader-content-title">
                {currentPage?.title || 'Current Chapter'}
              </h2>
            </div>
            <div className="reader-meta-card">
              <span>Page {currentPageNum}</span>
              <span className="reader-meta-divider" />
              <span>{totalPages} chapters</span>
            </div>
          </div>

          {currentPage ? (
            <>
              <ChapterReader 
                title={currentPage.title} 
                content={currentPage.formattedContent || currentPage.rawContent} 
              />

              <div className="nav-controls">
                <button
                  className="reader-secondary-button nav-button"
                  onClick={handlePrevPage}
                  disabled={currentPageNum <= 1}
                >
                  Previous Chapter
                </button>
                
                <span className="reader-page-indicator">
                  Page {currentPageNum} of {totalPages}
                </span>

                <button
                  className="reader-primary-button nav-button"
                  onClick={handleNextPage}
                  disabled={currentPageNum >= maxPageNumber}
                >
                  Next Chapter
                </button>
              </div>
            </>
          ) : (
            <div className="reader-no-content">
              <p>No content available for this page.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReadBook;
