import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { usePlatformDialog } from '../contexts/PlatformDialogContext';
import ChapterReader from '../components/Book/ChapterReader';
import InteractiveChapterReader from '../chapters/build-with-ai/InteractiveChapterReader';
import { chapterDemoMaps } from '../chapters/build-with-ai';
import { useFlutterwave, closePaymentModal } from 'flutterwave-react-v3';
import { getOriginalBookPrice } from '../utils/bookUtils';
import PageLoader from '../components/PageLoader';
import { getRedirectPath } from '../utils/authRedirect';
import { buildLoginPath } from '../utils/requireAuth';
import './ReadBook.css';
import { getLocalBook, getLocalBookForApiBook, isLocalBookId } from '../utils/localBookService';
import { getReadBookId, userHasBookAccess } from '../utils/bookAccess';

const ReadBook = () => {
  const { bookId } = useParams();
  const { user, refreshProfile, syncPurchasedBooks } = useAuth();
  const { notify } = usePlatformDialog();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPageNum, setCurrentPageNum] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [downloadDropdownOpen, setDownloadDropdownOpen] = useState(false);
  const [flwPublicKey, setFlwPublicKey] = useState('');
  const paymentHandledRef = useRef(false);

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
    const isMobile = window.innerWidth < 768;
    if (isMobile && sidebarOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
    return undefined;
  }, [sidebarOpen]);

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
      if (isLocalBookId(bookId)) {
        setBook(getLocalBook(bookId));
        return;
      }

      const response = await axios.get(`/books/details/${bookId}`);
      const apiBook = response.data.book;
      const localBook = getLocalBookForApiBook(apiBook);
      setBook(localBook || apiBook);
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
      notify({
        title: 'Download failed',
        message: 'Unable to download this book right now.',
        variant: 'error'
      });
    }
  };

  // Payment Configuration
  const config = {
    public_key: flwPublicKey,
    tx_ref: `${Date.now()}-${book?._id || 'book'}`,
    amount: book?.price || 0,
    currency: 'NGN',
    payment_options: 'card,mobilemoney,ussd',
    customer: {
      email: user?.email,
      name: user?.username,
    },
    meta: {
      bookId: book?._id || '',
      userId: user?.id || user?._id || ''
    },
    customizations: {
      title: `Purchase ${book?.title}`,
      description: 'Payment for book access',
      logo: 'https://st2.depositphotos.com/4403291/7418/v/450/depositphotos_74189661-stock-illustration-online-shop-log.jpg',
    },
  };

  const handleFlutterwavePayment = useFlutterwave(config);

  const handlePayment = () => {
    if (!user) {
      navigate(buildLoginPath(getRedirectPath(location)), { state: { from: location } });
      return;
    }

    if (!flwPublicKey) {
      notify({
        title: 'Payment not ready',
        message: 'Payment system is initializing. Please try again in a moment.',
        variant: 'warning'
      });
      return;
    }
    
    paymentHandledRef.current = false;

    handleFlutterwavePayment({
      callback: async (response) => {
        if (paymentHandledRef.current) {
          return;
        }
        paymentHandledRef.current = true;

        closePaymentModal();
        if (['successful', 'success', 'completed'].includes(String(response.status || '').toLowerCase())) {
           try {
             const verifyResponse = await axios.post('/payment/verify', {
               transaction_id: response.transaction_id || response.id,
               bookId: book._id
             });

             if (Array.isArray(verifyResponse.data?.purchasedBooks)) {
               syncPurchasedBooks(verifyResponse.data.purchasedBooks);
             } else {
               await refreshProfile();
             }

             navigate(`/books/${getReadBookId(book)}/read`, { replace: true });
             notify({
               title: 'Payment successful',
               message: 'You can now read the book.',
               variant: 'success'
             });
           } catch (err) {
             console.error("Verification failed", err);
             notify({
               title: 'Verification failed',
               message: 'Payment verification failed. Please contact support.',
               variant: 'error'
             });
           }
        } else {
          notify({
            title: 'Payment failed',
            message: 'Your payment was not completed.',
            variant: 'error'
          });
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
          <Link to="/all-books" className="reader-link-button">
            Back to Books
          </Link>
        </div>
      </div>
    );
  }

  // Check access
  const isAuthor = user && book.author && (user.id === book.author._id || user.id === book.author);
  const isAdmin = user && user.role === 'admin';
  const hasPurchased = userHasBookAccess(user, book);
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
              {originalPrice ? 'Launch offer price' : 'Price'}
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
              ? `Launch offer is live now at NGN ${book.price.toLocaleString()}. Standard price returns to NGN ${originalPrice.toLocaleString()}.`
              : `Buy now for NGN ${book.price.toLocaleString()}.`}
          </p>
          <button 
            className="reader-primary-button" 
            onClick={handlePayment}
          >
            {user ? 'Buy Now' : 'Sign in to Buy'}
          </button>
          <Link to={`/books/${bookId}/details`} className="reader-text-link">View Book Details</Link>
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
          <Link
            to={`/books/${bookId}/details`}
            className="reader-back-button"
            aria-label="Back to book details"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </Link>
          <button
            type="button"
            className="reader-chapters-button"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open table of contents"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
            <span>Chapters</span>
          </button>
          <div className="header-title-block">
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

      {sidebarOpen && (
        <button
          type="button"
          className="sidebar-overlay"
          aria-label="Close table of contents"
          onClick={() => setSidebarOpen(false)}
        />
      )}

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

        <div className={`content-area ${currentPage?.interactive ? 'content-area-wide' : ''}`}>
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
              {currentPage.interactive && currentPage.segments ? (
                <InteractiveChapterReader
                  title={currentPage.title}
                  segments={currentPage.segments}
                  demoMap={chapterDemoMaps[currentPage.demoMapKey] || {}}
                />
              ) : (
                <ChapterReader
                  title={currentPage.title}
                  content={currentPage.formattedContent || currentPage.rawContent}
                />
              )}

              <div className="nav-controls">
                <button
                  className="reader-secondary-button nav-button nav-button-prev"
                  onClick={handlePrevPage}
                  disabled={currentPageNum <= 1}
                >
                  <span className="nav-button-full">Previous Chapter</span>
                  <span className="nav-button-short">Prev</span>
                </button>
                
                <span className="reader-page-indicator">
                  {currentPageNum} / {totalPages}
                </span>

                <button
                  className="reader-primary-button nav-button nav-button-next"
                  onClick={handleNextPage}
                  disabled={currentPageNum >= maxPageNumber}
                >
                  <span className="nav-button-full">Next Chapter</span>
                  <span className="nav-button-short">Next</span>
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
