import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useAuth } from '../../contexts/AuthContext';
import ThemeToggle from '../ThemeToggle';
import axios from 'axios';

const BookEditor = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [book, setBook] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageData, setPageData] = useState({
    title: '',
    rawContent: '',
    formattedContent: '',
    status: 'draft'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const quillRef = useRef(null);
  const saveTimeoutRef = useRef(null);

  useEffect(() => {
    if (user && user.role !== 'admin') {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  useEffect(() => {
    fetchBook();
  }, [bookId]);

  useEffect(() => {
    if (book) {
      loadPage(currentPage);
    }
  }, [book, currentPage]);

  // Auto-save functionality
  useEffect(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      if (book && pageData.rawContent !== getCurrentPageContent()) {
        savePage();
      }
    }, 2000); // Auto-save after 2 seconds of inactivity

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [pageData, currentPage]);

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

  const getCurrentPageContent = () => {
    if (!book) return '';
    const page = book.pages.find(p => p.pageNumber === currentPage);
    return page ? page.rawContent : '';
  };

  const loadPage = (pageNumber) => {
    if (!book) return;

    const page = book.pages.find(p => p.pageNumber === pageNumber);
    if (page) {
      setPageData({
        title: page.title || '',
        rawContent: page.rawContent || '',
        formattedContent: page.formattedContent || '',
        status: page.status || 'draft'
      });
    } else {
      setPageData({
        title: '',
        rawContent: '',
        formattedContent: '',
        status: 'draft'
      });
    }
  };

  const savePage = async () => {
    if (!book) return;

    setSaving(true);
    try {
      await axios.put(`/books/${bookId}/pages/${currentPage}`, {
        title: pageData.title,
        rawContent: pageData.rawContent,
        formattedContent: pageData.rawContent, // For now, using raw content as formatted
        status: pageData.status
      });

      setSuccess('Page saved successfully');
      setTimeout(() => setSuccess(''), 3000);

      // Refresh book data to get updated page info
      await fetchBook();
    } catch (error) {
      console.error('Failed to save page:', error);
      setError('Failed to save page');
      setTimeout(() => setError(''), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handleContentChange = (content) => {
    setPageData(prev => ({
      ...prev,
      rawContent: content
    }));
  };

  const handleTitleChange = (e) => {
    setPageData(prev => ({
      ...prev,
      title: e.target.value
    }));
  };

  const handleStatusChange = (e) => {
    setPageData(prev => ({
      ...prev,
      status: e.target.value
    }));
  };

  const addNewPage = () => {
    const nextPageNumber = Math.max(...book.pages.map(p => p.pageNumber), 0) + 1;
    setCurrentPage(nextPageNumber);
  };

  const deleteCurrentPage = async () => {
    if (!window.confirm('Are you sure you want to delete this page?')) {
      return;
    }

    try {
      await axios.delete(`/books/${bookId}/pages/${currentPage}`);
      await fetchBook();

      // Navigate to previous page or first page
      const remainingPages = book.pages.filter(p => p.pageNumber !== currentPage);
      if (remainingPages.length > 0) {
        const prevPage = remainingPages
          .filter(p => p.pageNumber < currentPage)
          .sort((a, b) => b.pageNumber - a.pageNumber)[0];
        setCurrentPage(prevPage ? prevPage.pageNumber : remainingPages[0].pageNumber);
      } else {
        setCurrentPage(1);
      }
    } catch (error) {
      console.error('Failed to delete page:', error);
      setError('Failed to delete page');
    }
  };

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      ['blockquote', 'code-block'],
      ['link'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'align': [] }],
      ['clean']
    ],
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div className="card text-center">
          <h3>Loading book...</h3>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div className="card text-center">
          <h3>Book not found</h3>
          <Link to="/dashboard">Back to Dashboard</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)' }}>
      {/* Header */}
      <header style={{
        backgroundColor: 'var(--card-bg)',
        padding: '1rem 2rem',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link to="/dashboard" style={{ textDecoration: 'none', color: 'var(--primary-color)' }}>
            ← Back to Dashboard
          </Link>
          <div>
            <h1 style={{ margin: '0', fontSize: '1.5rem', color: 'var(--text-primary)' }}>{book.title}</h1>
            <small style={{ color: 'var(--text-secondary)' }}>
              Page {currentPage} | Status: {book.status} | Total Words: {book.totalWordCount || 0}
            </small>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <ThemeToggle />
          {saving && <span style={{ color: 'var(--text-secondary)' }}>Saving...</span>}
          {success && <span style={{ color: 'var(--success)' }}>{success}</span>}
          {error && <span style={{ color: 'var(--danger)' }}>{error}</span>}

          <Link to={`/books/${bookId}/read`} style={{ textDecoration: 'none' }}>
            <button className="btn-success">
              Read Mode
            </button>
          </Link>

          <button
            className="btn-primary"
            onClick={savePage}
            disabled={saving}
          >
            Save Page
          </button>

          <button
            className="btn-secondary"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? 'Hide' : 'Show'} Sidebar
          </button>
        </div>
      </header>

      <div style={{ display: 'flex', minHeight: 'calc(100vh - 80px)' }}>
        {/* Sidebar */}
        {sidebarOpen && (
          <div style={{
            width: '300px',
            backgroundColor: 'var(--card-bg)',
            borderRight: '1px solid var(--border-color)',
            padding: '1rem',
            overflowY: 'auto'
          }}>
            <h3 style={{ color: 'var(--text-primary)' }}>Book Pages</h3>

            <div style={{ marginBottom: '1rem' }}>
              <button
                className="btn-success w-full"
                onClick={addNewPage}
                style={{ marginBottom: '1rem' }}
              >
                Add New Page
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {[...Array(Math.max(...book.pages.map(p => p.pageNumber), 1))].map((_, index) => {
                const pageNumber = index + 1;
                const page = book.pages.find(p => p.pageNumber === pageNumber);
                const isActive = pageNumber === currentPage;

                return (
                  <button
                    key={pageNumber}
                    className={isActive ? 'btn-primary' : 'btn-secondary'}
                    onClick={() => setCurrentPage(pageNumber)}
                    style={{
                      textAlign: 'left',
                      padding: '0.5rem',
                      fontSize: '0.9rem',
                      backgroundColor: isActive ? 'var(--primary-color)' : 'var(--input-bg)',
                      color: isActive ? '#fff' : 'var(--text-primary)',
                      border: 'none',
                    }}
                  >
                    Page {pageNumber}
                    {page && (
                      <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>
                        {page.title || 'Untitled'} • {page.wordCount || 0} words
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {book.pages.length > 0 && (
              <div style={{ marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                <button
                  className="btn-danger w-full"
                  onClick={deleteCurrentPage}
                  disabled={book.pages.length === 0}
                >
                  Delete Current Page
                </button>
              </div>
            )}
          </div>
        )}

        {/* Main Editor */}
        <div style={{ flex: 1, padding: '2rem', backgroundColor: 'var(--bg-color)' }}>
          <div className="card" style={{ maxWidth: '800px', margin: '0 auto', backgroundColor: 'var(--card-bg)' }}>
            {/* Page Header */}
            <div style={{ marginBottom: '1rem' }}>
              <input
                type="text"
                placeholder="Page Title (optional)"
                value={pageData.title}
                onChange={handleTitleChange}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  fontSize: '1.2rem',
                  fontWeight: 'bold',
                  border: '1px solid var(--border-color)',
                  borderRadius: '4px',
                  marginBottom: '1rem',
                  backgroundColor: 'var(--input-bg)',
                  color: 'var(--text-primary)'
                }}
              />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-primary)' }}>
                <span>Status:</span>
                <select
                  value={pageData.status}
                  onChange={handleStatusChange}
                  style={{ padding: '0.25rem 0.5rem', backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}
                >
                  <option value="draft">Draft</option>
                  <option value="review">Review</option>
                  <option value="approved">Approved</option>
                </select>
              </div>
            </div>

            {/* Rich Text Editor */}
            <ReactQuill
              ref={quillRef}
              theme="snow"
              value={pageData.rawContent}
              onChange={handleContentChange}
              modules={quillModules}
              placeholder="Start writing your book content here..."
              style={{
                backgroundColor: 'white', // Keep editor white for WYSIWYG consistency or adapt carefully
                color: 'black', // Quill editor content usually expects black text on white
                borderRadius: '4px'
              }}
            />

            <div style={{
              marginTop: '1rem',
              padding: '1rem',
              backgroundColor: 'var(--input-bg)',
              borderRadius: '4px',
              fontSize: '0.9rem',
              color: 'var(--text-secondary)'
            }}>
              <strong>Word Count:</strong> {pageData.rawContent.replace(/<[^>]*>/g, '').split(/\s+/).filter(word => word.length > 0).length}
              <br />
              <strong>Status:</strong> {pageData.status}
              <br />
              <small>Changes are auto-saved every 2 seconds. Manual save available in header.</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookEditor;