import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import BookCard from './BookCard';
import ContentPageShell from '../ContentPageShell';
import PageHero from '../PageHero';
import useBookPurchase from '../../hooks/useBookPurchase';
import { usePlatformDialog } from '../../contexts/PlatformDialogContext';
import PageLoader from '../PageLoader';
import { mergeBooksForCatalog } from '../../utils/localBookService';
import { getBookReadPath, userHasBookAccess } from '../../utils/bookAccess';
import BuildWithAiOfferCountdown from './BuildWithAiOfferCountdown';

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
  const { confirm } = usePlatformDialog();
  const { checkoutBook, buyingBookId } = useBookPurchase();

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await axios.get('/books');
      setBooks(mergeBooksForCatalog(response.data.books || []));
      setError('');
    } catch (fetchError) {
      console.error('Failed to fetch books:', fetchError);
      // Still show locally authored titles when the API is offline.
      setBooks(mergeBooksForCatalog([]));
      setError('');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBook = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/books', newBook);
      setBooks((prev) => [...prev, response.data.book]);
      setNewBook({ title: '', description: '', genre: '' });
      setShowCreateForm(false);
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
      setBooks((prev) => prev.filter((book) => book._id !== bookId));
    } catch (deleteError) {
      console.error('Failed to delete book:', deleteError);
      setError('Failed to delete book');
    }
  };

  const handleBuyBook = (book) => {
    checkoutBook(book);
  };

  const handleReadBook = (book) => {
    navigate(getBookReadPath(book));
  };

  const getIsOwned = (book) => userHasBookAccess(user, book);

  if (loading) {
    return (
      <PageLoader
        title="Loading the collection"
        message="Fetching available books and store highlights."
      />
    );
  }

  return (
    <ContentPageShell>
      <PageHero
        eyebrow="Library"
        title="Explore the full collection."
        description="Browse every title in a cleaner, more focused storefront designed to keep attention on the books."
        centered
      >
        <BuildWithAiOfferCountdown />

        <div className="pf-stat-grid">
          <div className="pf-stat-card">
            <p className="pf-stat-label">Titles</p>
            <p className="pf-stat-value">{books.length}</p>
          </div>
          <div className="pf-stat-card">
            <p className="pf-stat-label">Checkout</p>
            <p className="pf-stat-text">Buy any book instantly with secure payment.</p>
          </div>
          <div className="pf-stat-card">
            <p className="pf-stat-label">Experience</p>
            <p className="pf-stat-text">
              Fast checkout, clean browsing, and a product-first layout.
            </p>
          </div>
        </div>

        <div className="pf-page-hero-actions">
          {user?.role === 'admin' ? (
            <>
              <Link to="/dashboard" className="pf-btn pf-btn-secondary">
                Dashboard
              </Link>
              <button
                type="button"
                onClick={() => setShowCreateForm((prev) => !prev)}
                className="pf-btn pf-btn-secondary pf-btn-admin"
              >
                {showCreateForm ? 'Close Form' : 'Create New Book'}
              </button>
              <Link to="/admin" className="pf-btn pf-btn-secondary">
                Admin Overview
              </Link>
            </>
          ) : null}
        </div>
      </PageHero>

      <section className="pf-content-section">
        <div className="pf-container">
          {error && <div className="pf-alert-error">{error}</div>}

          {showCreateForm && user?.role === 'admin' && (
            <div className="pf-panel" style={{ marginBottom: '2rem' }}>
              <p className="pf-section-label">Admin</p>
              <h2 className="pf-section-heading">Create a new book</h2>

              <form onSubmit={handleCreateBook} className="pf-form-grid" style={{ marginTop: '1.5rem' }}>
                <div>
                  <label htmlFor="title" className="pf-form-label">
                    Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={newBook.title}
                    onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                    required
                    className="pf-form-input"
                  />
                </div>

                <div>
                  <label htmlFor="description" className="pf-form-label">
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={newBook.description}
                    onChange={(e) => setNewBook({ ...newBook, description: e.target.value })}
                    rows="4"
                    className="pf-form-input"
                  />
                </div>

                <div>
                  <label htmlFor="genre" className="pf-form-label">
                    Genre
                  </label>
                  <input
                    type="text"
                    id="genre"
                    value={newBook.genre}
                    onChange={(e) => setNewBook({ ...newBook, genre: e.target.value })}
                    placeholder="e.g. Leadership, Growth, Business"
                    className="pf-form-input"
                  />
                </div>

                <div className="pf-cta-panel-actions">
                  <button type="submit" className="pf-btn pf-btn-primary pf-btn-sm">
                    Create Book
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="pf-btn pf-btn-secondary pf-btn-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          <div style={{ marginBottom: '2rem' }}>
            <p className="pf-section-label">Collection</p>
            <h2 className="pf-section-heading">All books</h2>
          </div>

          {books.length === 0 ? (
            <div className="pf-empty-state">
              <h3>No books found</h3>
              <p>Add a book to start building the collection.</p>
            </div>
          ) : (
            <div className="pf-content-grid">
              {books.map((book) => (
                <BookCard
                  key={book._id}
                  book={book}
                  isOwned={getIsOwned(book)}
                  onRead={handleReadBook}
                  onBuy={handleBuyBook}
                  onDelete={handleDeleteBook}
                  showActions={true}
                  showAdminActions={user?.role === 'admin'}
                  buying={buyingBookId === book._id}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </ContentPageShell>
  );
};

export default BookList;
