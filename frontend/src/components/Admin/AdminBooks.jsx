import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AdminLayout from './AdminLayout';
import PageLoader from '../PageLoader';
import { formatCurrency, formatDate } from './adminUtils';

const AdminBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get('/admin/books');
        setBooks(response.data.books || []);
      } catch (fetchError) {
        console.error('Failed to load admin books:', fetchError);
        setError('Failed to load admin books.');
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const stats = useMemo(() => {
    const totalRevenue = books.reduce((sum, book) => sum + (book.revenue || 0), 0);
    const soldBooks = books.filter((book) => (book.purchaseCount || 0) > 0).length;
    const publishedBooks = books.filter((book) => book.status === 'published').length;

    return {
      totalBooks: books.length,
      publishedBooks,
      soldBooks,
      totalRevenue
    };
  }, [books]);

  if (loading) {
    return (
      <PageLoader
        title="Loading admin books"
        message="Reviewing catalog inventory and sales performance."
      />
    );
  }

  return (
    <AdminLayout
      eyebrow="Admin Books"
      title="Track your catalog at a glance."
      description="See how many books you have, which titles are selling, and how each book is performing inside the catalog."
      stats={[
        { label: 'Total Books', value: stats.totalBooks, helper: 'Titles across the store' },
        { label: 'Published', value: stats.publishedBooks, helper: 'Books ready for readers' },
        { label: 'Sold Titles', value: stats.soldBooks, helper: 'Books with at least one verified sale' },
        { label: 'Revenue', value: formatCurrency(stats.totalRevenue), helper: 'Combined verified sales by title' }
      ]}
      actions={
        <Link
          to="/all-books"
          className="inline-flex items-center justify-center rounded-full bg-slate-950 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
          style={{ color: 'white' }}
        >
          Open Storefront
        </Link>
      }
    >
      {error ? (
        <div className="rounded-4xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <section className="rounded-4xl border border-white/70 bg-white/80 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
              Books
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
              Catalog performance
            </h2>
          </div>
          <div className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700">
            {books.length} {books.length === 1 ? 'book' : 'books'}
          </div>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-3">
            <thead>
              <tr className="text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                <th className="px-4 py-2">Book</th>
                <th className="px-4 py-2">Author</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Price</th>
                <th className="px-4 py-2">Purchases</th>
                <th className="px-4 py-2">Revenue</th>
                <th className="px-4 py-2">Updated</th>
              </tr>
            </thead>
            <tbody>
              {books.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-4 py-10 text-center text-sm text-slate-600">
                    No books found.
                  </td>
                </tr>
              ) : (
                books.map((book) => (
                  <tr key={book._id} className="rounded-3xl bg-slate-50/90 text-sm text-slate-700">
                    <td className="rounded-l-3xl border border-r-0 border-slate-200 px-4 py-4">
                      <div>
                        <p className="font-semibold text-slate-950">{book.title}</p>
                        <p className="mt-1 text-xs text-slate-500">
                          {book.genre || 'General'} • {book.pagesCount || 0} pages
                        </p>
                      </div>
                    </td>
                    <td className="border border-l-0 border-r-0 border-slate-200 px-4 py-4">
                      {book.author?.username || 'Unknown'}
                    </td>
                    <td className="border border-l-0 border-r-0 border-slate-200 px-4 py-4">
                      <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
                        {book.status || 'draft'}
                      </span>
                    </td>
                    <td className="border border-l-0 border-r-0 border-slate-200 px-4 py-4 font-medium text-slate-900">
                      {formatCurrency(book.price || 0)}
                    </td>
                    <td className="border border-l-0 border-r-0 border-slate-200 px-4 py-4">
                      {book.purchaseCount || 0}
                    </td>
                    <td className="border border-l-0 border-r-0 border-slate-200 px-4 py-4 font-medium text-slate-900">
                      {formatCurrency(book.revenue || 0)}
                    </td>
                    <td className="rounded-r-3xl border border-l-0 border-slate-200 px-4 py-4">
                      {formatDate(book.updatedAt)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </AdminLayout>
  );
};

export default AdminBooks;
