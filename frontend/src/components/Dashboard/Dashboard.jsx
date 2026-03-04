import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import BookCard from '../Book/BookCard';

const Dashboard = () => {
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
      const response = await axios.get('/books/purchased');
      setBooks(response.data.books || []);
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
      await axios.post('/books', newBook);
      setNewBook({ title: '', description: '', genre: '' });
      setShowCreateForm(false);
      setError('');
      alert('Book created successfully. It is available on the Books page.');
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

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div className="card text-center">
          <h3>Loading your purchased books...</h3>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)' }}>
      {/* Main Content */}
      <div className="container">
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2rem',
            marginTop: '2rem'
          }}>
            <h2>My Purchased Books</h2>
          </div>

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

        {/* Quick Actions */}
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h3>Quick Actions</h3>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {user?.role === 'admin' && (
              <Link to="/admin/users" style={{ textDecoration: 'none' }}>
                <button className="btn-primary" style={{ backgroundColor: '#6f42c1', borderColor: '#6f42c1' }}>
                  Manage Users
                </button>
              </Link>
            )}
            {user?.role === 'admin' && (
              <button
                className="btn-success"
                onClick={() => setShowCreateForm(!showCreateForm)}
              >
                {showCreateForm ? 'Cancel' : 'Create New Book'}
              </button>
            )}
            {user?.role === 'admin' && (
              <button className="btn-secondary" disabled>
                Import Book
              </button>
            )}
          </div>
        </div>

        {/* Purchased Books */}
        <div className="card">
          <h3>My Purchased Books ({books.length})</h3>
          {books.length === 0 ? (
            <p>You haven't purchased any books yet. Visit the <Link to="/all-books" style={{ color: 'var(--primary-color)', textDecoration: 'underline' }}>Books</Link> page to browse and purchase books.</p>
          ) : (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
              gap: '2rem' 
            }}>
              {books.map(book => (
                <BookCard 
                  key={book._id}
                  book={book}
                  isOwned={true}
                  onRead={() => navigate(`/books/${book._id}/read`)}
                  onDelete={handleDeleteBook}
                  showActions={true}
                  showAdminActions={user?.role === 'admin'}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;