import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import BookCard from '../Book/BookCard';
import PageLoader from '../PageLoader';

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
      <PageLoader
        title="Loading your library"
        message="Pulling in your purchased books and dashboard actions."
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
              Dashboard
            </span>
            <h1 className="mx-auto mt-6 max-w-4xl text-4xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-6xl">
              Your library, organized with clarity.
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
              Access your purchased books, continue reading, and manage key actions from a cleaner premium dashboard.
            </p>
          </div>

          <div className="mx-auto mt-10 grid max-w-5xl gap-4 md:grid-cols-3">
            <div className="rounded-4xl border border-white/70 bg-white/75 p-6 shadow-sm backdrop-blur">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Purchased</p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">{books.length}</p>
            </div>
            <div className="rounded-4xl border border-white/70 bg-white/75 p-6 shadow-sm backdrop-blur">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Account</p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 capitalize">
                {user?.role || 'Reader'}
              </p>
            </div>
            <div className="rounded-4xl border border-white/70 bg-white/75 p-6 shadow-sm backdrop-blur">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Experience</p>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Continue reading, revisit your library, and keep the interface focused on the books.
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to="/all-books"
              className="inline-flex min-w-40 items-center justify-center rounded-full bg-slate-950 px-8 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
              style={{ color: 'white' }}>
              Browse Books
            </Link>
            {user?.role === 'admin' && (
              <>
                <button
                  type="button"
                  onClick={() => setShowCreateForm((prev) => !prev)}
                  className="inline-flex min-w-40 items-center justify-center rounded-full border border-blue-200 bg-blue-50 px-8 py-3 text-sm font-medium text-blue-700 transition hover:bg-blue-100"
                >
                  {showCreateForm ? 'Close Form' : 'Create New Book'}
                </button>
                <Link
                  to="/admin"
                  className="inline-flex min-w-40 items-center justify-center rounded-full border border-slate-300 bg-white/80 px-8 py-3 text-sm font-medium text-slate-800 transition hover:border-slate-400 hover:bg-white"
                >
                  Admin Overview
                </Link>
              </>
            )}
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

          <div className="mb-8 rounded-4xl border border-white/70 bg-white/80 p-6 shadow-xl backdrop-blur">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Quick Actions
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
                  Move faster through your library
                </h2>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/all-books"
                  className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-800 transition hover:border-slate-400 hover:bg-slate-50"
                >
                  Explore More Books
                </Link>
                {user?.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-800 transition hover:border-slate-400 hover:bg-slate-50"
                  >
                    Admin Overview
                  </Link>
                )}
              </div>
            </div>
          </div>

          <div className="rounded-4xl border border-white/70 bg-white/80 p-6 shadow-xl backdrop-blur">
            <div className="mb-8 flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                  My Library
                </p>
                <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
                  Purchased books
                </h2>
                <p className="mt-2 text-sm text-slate-600">
                  Revisit the books you own and continue reading anytime.
                </p>
              </div>
              <div className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700">
                {books.length} {books.length === 1 ? 'book' : 'books'}
              </div>
            </div>

            {books.length === 0 ? (
              <div className="rounded-4xl border border-slate-200 bg-slate-50 px-6 py-16 text-center">
                <h3 className="text-2xl font-semibold tracking-tight text-slate-950">
                  No purchased books yet
                </h3>
                <p className="mx-auto mt-3 max-w-2xl text-slate-600">
                  Visit the <Link to="/all-books" className="font-medium text-slate-900 underline">Books</Link> page to explore and purchase titles.
                </p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {books.map((book) => (
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
      </section>
    </div>
  );
};

export default Dashboard;