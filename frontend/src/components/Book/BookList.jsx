import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import BookCard from './BookCard';
import { useCart } from '../../contexts/CartContext';
import useBookPurchase from '../../hooks/useBookPurchase';
import PageLoader from '../PageLoader';

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
  const { addToCart, isInCart, itemCount, removeFromCart } = useCart();
  const navigate = useNavigate();
  const { checkoutBook, buyingBookId } = useBookPurchase({
    onPurchaseSuccess: async (book) => {
      removeFromCart(book._id);
    }
  });

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await axios.get('/books');
      setBooks(response.data.books || []);
    } catch (fetchError) {
      console.error('Failed to fetch books:', fetchError);
      setError('Failed to load books');
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
    if (!window.confirm('Are you sure you want to delete this book?')) {
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

  const handleAddBookToCart = (book) => {
    addToCart(book);
  };

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
      <PageLoader
        title="Loading the collection"
        message="Fetching available books, cart details, and store highlights."
      />
    );
  }

  return (
    <div className="min-h-screen overflow-hidden bg-slate-50 text-slate-900">
      <section className="relative px-4 pb-12 pt-20 sm:px-6 md:pt-28 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.96),rgba(241,245,249,0.92)_45%,rgba(226,232,240,0.7)_100%)]" />
        <div className="absolute inset-x-0 top-0 h-80 bg-linear-to-b from-white via-white/80 to-transparent" />
        <div className="absolute left-1/2 top-32 h-72 w-72 -translate-x-1/2 rounded-full bg-blue-200/25 blur-3xl" />

        <div className="relative mx-auto max-w-7xl">
          <div className="text-center">
            <span className="inline-flex items-center rounded-full border border-slate-200 bg-white/80 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-600 shadow-sm backdrop-blur">
              Library
            </span>
            <h1 className="mx-auto mt-6 max-w-4xl text-4xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-6xl">
              Explore the full collection.
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
              Browse every title in a cleaner, more focused storefront designed to keep attention on the books.
            </p>
          </div>

          <div className="mx-auto mt-10 grid max-w-5xl gap-4 md:grid-cols-3">
            <div className="rounded-4xl border border-white/70 bg-white/75 p-6 shadow-sm backdrop-blur">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Titles</p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">{books.length}</p>
            </div>
            <div className="rounded-4xl border border-white/70 bg-white/75 p-6 shadow-sm backdrop-blur">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Cart</p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">{itemCount}</p>
            </div>
            <div className="rounded-4xl border border-white/70 bg-white/75 p-6 shadow-sm backdrop-blur">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Experience</p>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Fast checkout, clean browsing, and a product-first layout.
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to="/cart"
              className="inline-flex min-w-40 items-center justify-center rounded-full bg-slate-950 px-8 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
              style={{ color: 'white' }}
            >
              View Cart{itemCount > 0 ? ` (${itemCount})` : ''}
            </Link>
            {user?.role === 'admin' ? (
              <>
                <Link
                  to="/dashboard"
                  className="inline-flex min-w-40 items-center justify-center rounded-full border border-slate-300 bg-white/80 px-8 py-3 text-sm font-medium text-slate-800 transition hover:border-slate-400 hover:bg-white"
                >
                  Dashboard
                </Link>
                <button
                  type="button"
                  onClick={() => setShowCreateForm((prev) => !prev)}
                  className="inline-flex min-w-40 items-center justify-center rounded-full border border-blue-200 bg-blue-50 px-8 py-3 text-sm font-medium text-blue-700 transition hover:bg-blue-100"
                >
                  {showCreateForm ? 'Close Form' : 'Create New Book'}
                </button>
                <Link
                  to="/admin/users"
                  className="inline-flex min-w-40 items-center justify-center rounded-full border border-slate-300 bg-white/80 px-8 py-3 text-sm font-medium text-slate-800 transition hover:border-slate-400 hover:bg-white"
                >
                  User Management
                </Link>
              </>
            ) : null}
          </div>
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {error && (
            <div className="mb-6 rounded-3xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {showCreateForm && user?.role === 'admin' && (
            <div className="mb-8 rounded-4xl border border-white/70 bg-white/80 p-6 shadow-xl backdrop-blur">
              <div className="mb-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Admin
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
                  Create a new book
                </h2>
              </div>

              <form onSubmit={handleCreateBook} className="grid gap-5">
                <div>
                  <label htmlFor="title" className="mb-2 block text-sm font-medium text-slate-700">
                    Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={newBook.title}
                    onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                    required
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400"
                  />
                </div>

                <div>
                  <label htmlFor="description" className="mb-2 block text-sm font-medium text-slate-700">
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={newBook.description}
                    onChange={(e) => setNewBook({ ...newBook, description: e.target.value })}
                    rows="4"
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400"
                  />
                </div>

                <div>
                  <label htmlFor="genre" className="mb-2 block text-sm font-medium text-slate-700">
                    Genre
                  </label>
                  <input
                    type="text"
                    id="genre"
                    value={newBook.genre}
                    onChange={(e) => setNewBook({ ...newBook, genre: e.target.value })}
                    placeholder="e.g. Leadership, Growth, Business"
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400"
                  />
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
                  >
                    Create Book
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-medium text-slate-800 transition hover:border-slate-400 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                Collection
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
                All books
              </h2>
            </div>
          </div>

          {books.length === 0 ? (
            <div className="rounded-4xl border border-white/70 bg-white/80 px-6 py-16 text-center shadow-xl backdrop-blur">
              <h3 className="text-2xl font-semibold tracking-tight text-slate-950">No books found</h3>
              <p className="mt-3 text-slate-600">
                Add a book to start building the collection.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {books.map((book) => (
                <BookCard
                  key={book._id}
                  book={book}
                  isOwned={getIsOwned(book)}
                  isInCart={isInCart(book._id)}
                  onRead={handleReadBook}
                  onBuy={handleBuyBook}
                  onAddToCart={handleAddBookToCart}
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
    </div>
  );
};

export default BookList;
