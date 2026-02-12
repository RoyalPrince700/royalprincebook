import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import ThemeToggle from '../ThemeToggle';
import axios from 'axios';
import leadingFromWithinImage from '../../assets/leadingfromwithin.jpg';
import collegeBlueprintImage from '../../assets/collegeblueprint.png';
import academicMasteryImage from '../../assets/academicmastery.png';
import uniHackImage from '../../assets/unihack.png';
import understandingLoveLanguagesImage from '../../assets/understandinglovelanguages.png';
import buildingLastingTrustImage from '../../assets/buildinglastingtrust.png';

const getBookCover = (title) => {
  if (!title) return 'https://placehold.co/300x450/e9ecef/333333?text=No+Cover';
  
  const lowerTitle = title.toLowerCase();
  
  if (lowerTitle.includes('leading from within')) {
    return leadingFromWithinImage;
  } else if (lowerTitle.includes('college') || lowerTitle.includes('blueprint')) {
    return collegeBlueprintImage;
  } else if (lowerTitle.includes('academic') || lowerTitle.includes('mastery')) {
    return academicMasteryImage;
  } else if (lowerTitle.includes('hack') || lowerTitle.includes('uni')) {
    return uniHackImage;
  } else if (lowerTitle.includes('love languages') || lowerTitle.includes('understanding love')) {
    return understandingLoveLanguagesImage;
  } else if (lowerTitle.includes('trust') || lowerTitle.includes('building lasting')) {
    return buildingLastingTrustImage;
  }
  
  return 'https://placehold.co/300x450/e9ecef/333333?text=' + encodeURIComponent(title);
};

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newBook, setNewBook] = useState({
    title: '',
    description: '',
    genre: ''
  });
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await axios.get('/books');
      setBooks(response.data.books);
    } catch (error) {
      console.error('Failed to fetch books:', error);
      setError('Failed to load books');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBook = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/books', newBook);
      setBooks([...books, response.data.book]);
      setNewBook({ title: '', description: '', genre: '' });
      setShowCreateForm(false);
    } catch (error) {
      console.error('Failed to create book:', error);
      setError('Failed to create book');
    }
  };

  const handleDeleteBook = async (bookId) => {
    if (!window.confirm('Are you sure you want to delete this book?')) {
      return;
    }

    try {
      await axios.delete(`/books/${bookId}`);
      setBooks(books.filter(book => book._id !== bookId));
    } catch (error) {
      console.error('Failed to delete book:', error);
      setError('Failed to delete book');
    }
  };

  const handleExport = async (bookId, format) => {
    try {
      const response = await axios.get(`/export/${format}/${bookId}`, {
        responseType: 'blob'
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `book.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(`Failed to export book as ${format}:`, error);
      setError(`Failed to export book as ${format.toUpperCase()}`);
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--bg-color)',
        color: 'var(--text-primary)'
      }}>
        <div className="card text-center">
          <h3>Loading books...</h3>
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
          {user?.role === 'admin' && (
            <Link to="/dashboard" style={{ textDecoration: 'none', color: 'var(--primary-color)' }}>
              ← Back to Dashboard
            </Link>
          )}
          <h1 style={{ margin: 0, color: 'var(--text-primary)' }}>All Books</h1>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <ThemeToggle />
          {user?.role === 'admin' && (
            <>
              <Link to="/admin/users" style={{ textDecoration: 'none' }}>
                <button className="btn-secondary">
                  User Management
                </button>
              </Link>
              <button
                className="btn-success"
                onClick={() => setShowCreateForm(!showCreateForm)}
              >
                {showCreateForm ? 'Cancel' : 'Create New Book'}
              </button>
            </>
          )}
        </div>
      </header>

      <div className="container">
        {error && (
          <div style={{
            color: '#dc3545',
            backgroundColor: '#f8d7da',
            padding: '10px',
            borderRadius: '4px',
            marginBottom: '1rem',
            border: '1px solid #f5c6cb'
          }}>
            {error}
          </div>
        )}

        {/* Create Book Form */}
        {showCreateForm && user?.role === 'admin' && (
          <div className="card" style={{ marginBottom: '2rem' }}>
            <h3>Create New Book</h3>
            <form onSubmit={handleCreateBook}>
              <div className="mb-3">
                <label htmlFor="title" style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                  Title:
                </label>
                <input
                  type="text"
                  id="title"
                  value={newBook.title}
                  onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                  required
                  style={{ width: '100%', backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', padding: '0.5rem', borderRadius: '4px' }}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="description" style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                  Description:
                </label>
                <textarea
                  id="description"
                  value={newBook.description}
                  onChange={(e) => setNewBook({ ...newBook, description: e.target.value })}
                  rows="3"
                  style={{ width: '100%', backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', padding: '0.5rem', borderRadius: '4px' }}
                />
              </div>

              <div className="mb-4">
                <label htmlFor="genre" style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                  Genre:
                </label>
                <input
                  type="text"
                  id="genre"
                  value={newBook.genre}
                  onChange={(e) => setNewBook({ ...newBook, genre: e.target.value })}
                  placeholder="e.g., Fiction, Non-fiction, Mystery, etc."
                  style={{ width: '100%', backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', padding: '0.5rem', borderRadius: '4px' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button type="submit" className="btn-success">
                  Create Book
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowCreateForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Books List */}
        <div className="card">
          <h3>All Books ({books.length})</h3>
          {books.length === 0 ? (
            <p>No books found. Create your first book above!</p>
          ) : (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
              gap: '2rem' 
            }}>
              {books.map(book => (
                <div key={book._id} style={{
                  border: '1px solid var(--border-color)',
                  borderRadius: '12px',
                  backgroundColor: 'var(--card-bg)',
                  overflow: 'hidden',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  display: 'flex',
                  flexDirection: 'column'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 10px 15px rgba(0,0,0,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.05)';
                }}
                >
                  {/* Book Cover Image */}
                  <div style={{
                    width: '100%',
                    height: '350px',
                    backgroundColor: 'var(--input-bg)',
                    backgroundImage: `url(${getBookCover(book.title)})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    borderBottom: '1px solid var(--border-color)'
                  }} />

                  <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <h4 style={{ 
                      margin: '0 0 0.5rem 0', 
                      color: 'var(--text-primary)',
                      fontSize: '1.1rem',
                      lineHeight: '1.4',
                      height: '2.8em', // Limit to 2 lines approximately
                      overflow: 'hidden',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical'
                    }}>
                      {book.title}
                    </h4>
                    
                    <div style={{ 
                      fontSize: '0.85rem', 
                      color: 'var(--text-secondary)', 
                      marginBottom: '1rem',
                      display: 'flex',
                      gap: '0.5rem',
                      flexWrap: 'wrap'
                    }}>
                      <span style={{ 
                        backgroundColor: 'var(--bg-color)', 
                        padding: '0.2rem 0.5rem', 
                        borderRadius: '4px',
                        color: 'var(--text-secondary)'
                      }}>
                        {book.genre || 'General'}
                      </span>
                    </div>

                    <p style={{ 
                      margin: '0 0 1rem 0', 
                      color: 'var(--text-secondary)', 
                      fontSize: '0.9rem',
                      flex: 1,
                      overflow: 'hidden',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical'
                    }}>
                      {book.description || 'No description available.'}
                    </p>

                    {/* Actions */}
                    <div style={{ 
                      marginTop: 'auto',
                      paddingTop: '1rem',
                      borderTop: '1px solid var(--border-color)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <Link 
                        to={`/books/${book._id}/read`} 
                        title="Read Book"
                        style={{ 
                          textDecoration: 'none', 
                          color: 'var(--text-secondary)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          fontSize: '0.9rem',
                          fontWeight: '500'
                        }}
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                        </svg>
                        Read
                      </Link>
                      
                      {user?.role === 'admin' && (
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <Link 
                            to={`/books/${book._id}`} 
                            title="Edit Book"
                            style={{ 
                              textDecoration: 'none', 
                              color: '#3b82f6',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              padding: '0.5rem',
                              borderRadius: '4px',
                              transition: 'background 0.2s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#eff6ff'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                          >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                          </Link>

                          <button
                            onClick={() => handleDeleteBook(book._id)}
                            title="Delete Book"
                            style={{ 
                              background: 'none', 
                              border: 'none', 
                              cursor: 'pointer',
                              color: 'var(--danger)',
                              padding: '0.5rem',
                              borderRadius: '4px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'background 0.2s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fef2f2'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                          >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="3 6 5 6 21 6"></polyline>
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookList;