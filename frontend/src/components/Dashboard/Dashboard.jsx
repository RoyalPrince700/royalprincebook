import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import BookCard from '../Book/BookCard';
import ThemeToggle from '../ThemeToggle';
import NavIcon from '../NavIcon';
import PageLoader from '../PageLoader';
import { usePlatformDialog } from '../../contexts/PlatformDialogContext';
import { getBookReadPath } from '../../utils/bookAccess';
import './dashboard.css';

const DestinationCard = ({ to, label, description, icon, accent = 'slate' }) => (
  <Link to={to} className={`dashboard-dest-card dashboard-dest-card--${accent}`}>
    <div className="flex items-start justify-between gap-4">
      <span className={`dashboard-dest-icon dashboard-dest-icon--${accent}`}>
        <NavIcon name={icon} className="h-6 w-6" />
      </span>
      <span
        className={`dashboard-dest-arrow dashboard-dest-arrow--${accent} mt-1 text-sm font-semibold`}
        aria-hidden="true"
      >
        →
      </span>
    </div>
    <h2 className="dashboard-dest-title">{label}</h2>
    <p className="dashboard-dest-copy">{description}</p>
  </Link>
);

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
  const { confirm, notify } = usePlatformDialog();

  const destinations = useMemo(() => {
    const items = [
      {
        to: '/taskboard',
        label: 'Taskboard',
        description: 'Plan tasks, track progress, and execute your week.',
        icon: 'taskboard',
        accent: 'amber'
      },
      {
        to: '/noteboard',
        label: 'Noteboard',
        description: 'Capture ideas on sticky notes and visual boards.',
        icon: 'noteboard',
        accent: 'yellow'
      },
      {
        to: '/all-books',
        label: 'Books',
        description: 'Browse titles, read your library, and discover new work.',
        icon: 'book',
        accent: 'blue'
      },
      {
        to: '/blog',
        label: 'Blog',
        description: 'Read articles, insights, and project updates.',
        icon: 'blog',
        accent: 'violet'
      },
      {
        to: '/',
        label: 'Portfolio',
        description: 'Return home to explore projects, work, and writing.',
        icon: 'home',
        accent: 'slate'
      }
    ];

    if (user?.role === 'admin') {
      items.push({
        to: '/admin',
        label: 'Admin',
        description: 'Manage books, users, traffic, and platform settings.',
        icon: 'admin',
        accent: 'rose'
      });
    }

    return items;
  }, [user?.role, user]);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await axios.get('/books/purchased');
      setBooks(response.data.books || []);
    } catch (fetchError) {
      console.error('Failed to fetch books:', fetchError);
      setError('Failed to load books');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBook = async (event) => {
    event.preventDefault();
    try {
      await axios.post('/books', newBook);
      setNewBook({ title: '', description: '', genre: '' });
      setShowCreateForm(false);
      setError('');
      notify({
        title: 'Book created',
        message: 'It is available on the Books page.',
        variant: 'success'
      });
    } catch (createError) {
      console.error('Failed to create book:', createError);
      setError('Failed to create book');
    }
  };

  const handleDeleteBook = async (bookId) => {
    const shouldDelete = await confirm({
      kicker: 'Delete book',
      title: 'Remove this book?',
      message: 'This book will be permanently deleted. This cannot be undone.',
      confirmLabel: 'Delete',
      cancelLabel: 'Cancel',
      variant: 'danger'
    });
    if (!shouldDelete) {
      return;
    }

    try {
      await axios.delete(`/books/${bookId}`);
      setBooks(books.filter((book) => book._id !== bookId));
    } catch (deleteError) {
      console.error('Failed to delete book:', deleteError);
      setError('Failed to delete book');
    }
  };

  if (loading) {
    return (
      <PageLoader
        title="Loading your dashboard"
        message="Setting up your workspace shortcuts and library."
      />
    );
  }

  const displayName = user?.username || user?.name || 'there';

  return (
    <div className="dashboard-page">
      <section className="dashboard-hero">
        <div className="dashboard-hero-bg" />
        <div className="dashboard-hero-fade" />
        <div className="dashboard-hero-glow" />
        <div className="dashboard-theme-toggle">
          <ThemeToggle />
        </div>

        <div className="dashboard-inner">
          <div className="text-center">
            <span className="dashboard-eyebrow">Dashboard</span>
            <h1 className="dashboard-title">Welcome back, {displayName}.</h1>
            <p className="dashboard-subtitle">
              Jump into your tools, reading, and writing from one place.
            </p>
          </div>

          <div className="dashboard-grid">
            {destinations.map((item) => (
              <DestinationCard key={item.to} {...item} />
            ))}
          </div>

          <div className="dashboard-stats">
            <div className="dashboard-stat-card">
              <p className="dashboard-stat-label">Library</p>
              <p className="dashboard-stat-value">{books.length}</p>
              <p className="dashboard-stat-meta">
                {books.length === 1 ? 'book owned' : 'books owned'}
              </p>
            </div>
            <div className="dashboard-stat-card">
              <p className="dashboard-stat-label">Account</p>
              <p className="dashboard-stat-value capitalize">{user?.role || 'Reader'}</p>
              <p className="dashboard-stat-meta">Signed in and ready</p>
            </div>
            <div className="dashboard-stat-card">
              <p className="dashboard-stat-label">Quick tip</p>
              <p className="dashboard-stat-meta" style={{ marginTop: '0.75rem' }}>
                Use Taskboard for execution and Noteboard for ideas — both stay synced to your
                account.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="dashboard-body">
        <div className="dashboard-inner">
          {error ? <div className="dashboard-error">{error}</div> : null}

          {showCreateForm && user?.role === 'admin' ? (
            <div className="dashboard-admin-form">
              <div className="mb-6">
                <p className="dashboard-panel-kicker">Admin</p>
                <h2 className="dashboard-panel-title">Create a new book</h2>
              </div>

              <form onSubmit={handleCreateBook} className="grid gap-5">
                <div>
                  <label htmlFor="title" className="dashboard-form-label">
                    Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={newBook.title}
                    onChange={(event) => setNewBook({ ...newBook, title: event.target.value })}
                    required
                    className="dashboard-form-input"
                  />
                </div>

                <div>
                  <label htmlFor="description" className="dashboard-form-label">
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={newBook.description}
                    onChange={(event) =>
                      setNewBook({ ...newBook, description: event.target.value })
                    }
                    rows="4"
                    className="dashboard-form-input"
                  />
                </div>

                <div>
                  <label htmlFor="genre" className="dashboard-form-label">
                    Genre
                  </label>
                  <input
                    type="text"
                    id="genre"
                    value={newBook.genre}
                    onChange={(event) => setNewBook({ ...newBook, genre: event.target.value })}
                    placeholder="e.g. Leadership, Growth, Business"
                    className="dashboard-form-input"
                  />
                </div>

                <div className="flex flex-wrap gap-3">
                  <button type="submit" className="dashboard-btn">
                    Create Book
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="dashboard-btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          ) : null}

          <div className="dashboard-panel">
            <div className="dashboard-panel-head">
              <div>
                <p className="dashboard-panel-kicker">My Library</p>
                <h2 className="dashboard-panel-title">Continue reading</h2>
                <p className="dashboard-panel-copy">
                  Pick up where you left off with the books you own.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link to="/all-books" className="dashboard-btn-secondary">
                  Browse all books
                </Link>
                {user?.role === 'admin' ? (
                  <button
                    type="button"
                    onClick={() => setShowCreateForm((prev) => !prev)}
                    className="dashboard-btn-admin"
                  >
                    {showCreateForm ? 'Close form' : 'Create book'}
                  </button>
                ) : null}
              </div>
            </div>

            {books.length === 0 ? (
              <div className="dashboard-empty">
                <h3 className="dashboard-empty-title">No purchased books yet</h3>
                <p className="dashboard-empty-copy">
                  Visit the{' '}
                  <Link to="/all-books" className="dashboard-link">
                    Books
                  </Link>{' '}
                  page to explore and purchase titles.
                </p>
              </div>
            ) : (
              <div className="dashboard-books-grid">
                {books.map((book) => (
                  <BookCard
                    key={book._id}
                    book={book}
                    isOwned
                    onRead={() => navigate(getBookReadPath(book))}
                    onDelete={handleDeleteBook}
                    showActions
                    showAdminActions={user?.role === 'admin'}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
