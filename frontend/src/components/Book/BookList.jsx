import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import BookCard from './BookCard';
import { useFlutterwave, closePaymentModal } from 'flutterwave-react-v3';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [buyingBookId, setBuyingBookId] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const [flwPublicKey, setFlwPublicKey] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newBook, setNewBook] = useState({
    title: '',
    description: '',
    genre: ''
  });
  const { user, refreshProfile, addPurchasedBook } = useAuth();
  const navigate = useNavigate();

  const paymentConfig = {
    public_key: flwPublicKey || 'FLW_PUBLIC_KEY',
    tx_ref: `${Date.now()}-${selectedBook?._id || 'book'}`,
    amount: selectedBook?.price || 0,
    currency: 'NGN',
    payment_options: 'card,mobilemoney,ussd',
    customer: {
      email: user?.email || '',
      name: user?.username || '',
    },
    customizations: {
      title: selectedBook ? `Purchase ${selectedBook.title}` : 'Purchase Book',
      description: 'Payment for book access'
    }
  };

  const triggerFlutterwavePayment = useFlutterwave(paymentConfig);

  useEffect(() => {
    fetchBooks();
    fetchPublicKey();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await axios.get('/books');
      
      let fetchedBooks = response.data.books;
      
      setBooks(fetchedBooks);
    } catch (error) {
      console.error('Failed to fetch books:', error);
      setError('Failed to load books');
    } finally {
      setLoading(false);
    }
  };

  const fetchPublicKey = async () => {
    try {
      const response = await axios.get('/config/flutterwave-public-key');
      setFlwPublicKey(response.data.publicKey || '');
    } catch (fetchError) {
      console.error('Failed to fetch Flutterwave public key:', fetchError);
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

  const handleBuyBook = (book) => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (!flwPublicKey) {
      alert('Payment is not ready yet. Please try again in a moment.');
      return;
    }
    if (!book?.price || book.price <= 0) {
      alert('This book is free and does not require payment.');
      return;
    }

    setSelectedBook(book);
    setBuyingBookId(book._id);
  };

  useEffect(() => {
    if (!selectedBook || !buyingBookId) return;

    triggerFlutterwavePayment({
      callback: async (response) => {
        closePaymentModal();

        if (response.status !== 'successful') {
          setBuyingBookId(null);
          setSelectedBook(null);
          alert('Payment was not successful.');
          return;
        }

        try {
          await axios.post('/payment/verify', {
            transaction_id: response.transaction_id,
            bookId: book._id
          });

          addPurchasedBook(book._id);
          await refreshProfile();
          alert('Payment successful. You can now read this book.');
        } catch (verifyError) {
          console.error('Payment verification failed:', verifyError);
          alert('Payment verification failed. Please contact support.');
        } finally {
          setBuyingBookId(null);
          setSelectedBook(null);
        }
      },
      onClose: () => {
        setBuyingBookId(null);
        setSelectedBook(null);
      }
    });
  }, [selectedBook, buyingBookId, triggerFlutterwavePayment, refreshProfile, addPurchasedBook]);

  const handleReadBook = (book) => {
    navigate(`/books/${book._id}/read`);
  };

  const getIsOwned = (book) => {
    if (!user) return false;
    if (user.role === 'admin') return true;
    const purchasedBooks = Array.isArray(user.purchasedBooks) ? user.purchasedBooks : [];
    return purchasedBooks.includes(book._id) || !book.price || book.price === 0;
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
      </div>
    </div>
  );
};

export default BookList;
