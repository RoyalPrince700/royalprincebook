import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AdminLayout from './AdminLayout';
import PageLoader from '../PageLoader';
import { formatCurrency, formatDateTime } from './adminUtils';

const AdminOverview = () => {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const response = await axios.get('/admin/overview');
        setOverview(response.data);
      } catch (fetchError) {
        console.error('Failed to load admin overview:', fetchError);
        setError('Failed to load admin overview.');
      } finally {
        setLoading(false);
      }
    };

    fetchOverview();
  }, []);

  if (loading) {
    return (
      <PageLoader
        title="Loading admin overview"
        message="Gathering your books, users, and revenue signals."
      />
    );
  }

  const stats = overview?.stats || {};
  const recentTransactions = overview?.recentTransactions || [];
  const recentBooks = overview?.recentBooks || [];

  return (
    <AdminLayout
      eyebrow="Admin Overview"
      title="A clearer view of your store."
      description="See how your catalog is growing, how many readers are active, and what verified revenue is coming in."
      stats={[
        { label: 'Total Books', value: stats.totalBooks || 0, helper: 'Titles currently in your catalog' },
        { label: 'Total Users', value: stats.totalUsers || 0, helper: `${stats.totalAdmins || 0} admins and ${stats.totalReaders || 0} readers` },
        { label: 'Paid Users', value: stats.paidUsers || 0, helper: `${stats.booksUnlocked || 0} unlocked books across accounts` },
        { label: 'Revenue', value: formatCurrency(stats.totalRevenue || 0), helper: `${stats.totalTransactions || 0} verified transactions` }
      ]}
      actions={
        <>
          <Link
            to="/admin/traffic"
            className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-800 transition hover:border-slate-400 hover:bg-slate-50"
          >
            View Traffic
          </Link>
          <Link
            to="/admin/books"
            className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-800 transition hover:border-slate-400 hover:bg-slate-50"
          >
            View Books
          </Link>
          <Link
            to="/admin/finance"
            className="inline-flex items-center justify-center rounded-full bg-slate-950 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
            style={{ color: 'white' }}
          >
            Open Finance
          </Link>
        </>
      }
    >
      {error ? (
        <div className="rounded-4xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <section className="rounded-4xl border border-white/70 bg-white/80 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                Recent Transactions
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
                Latest verified payments
              </h2>
            </div>
            <Link to="/admin/finance" className="text-sm font-medium text-slate-700">
              Finance
            </Link>
          </div>

          <div className="mt-6 space-y-3">
            {recentTransactions.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center text-sm text-slate-600">
                No verified transactions yet.
              </div>
            ) : (
              recentTransactions.map((transaction) => (
                <div
                  key={transaction._id}
                  className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-slate-50/90 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="text-sm font-semibold text-slate-950">
                      {transaction.user?.username || 'Unknown user'}
                    </p>
                    <p className="text-sm text-slate-600">
                      {transaction.book?.title || 'Unknown book'}
                    </p>
                  </div>
                  <div className="sm:text-right">
                    <p className="text-sm font-semibold text-slate-950">
                      {formatCurrency(transaction.amount)}
                    </p>
                    <p className="text-xs text-slate-500">{formatDateTime(transaction.paidAt || transaction.createdAt)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="rounded-4xl border border-white/70 bg-white/80 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                Catalog Activity
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
                Recently updated books
              </h2>
            </div>
            <Link to="/admin/books" className="text-sm font-medium text-slate-700">
              Books
            </Link>
          </div>

          <div className="mt-6 space-y-3">
            {recentBooks.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center text-sm text-slate-600">
                No books available yet.
              </div>
            ) : (
              recentBooks.map((book) => (
                <div
                  key={book._id}
                  className="rounded-3xl border border-slate-200 bg-slate-50/90 px-5 py-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-950">{book.title}</p>
                      <p className="text-sm text-slate-600">
                        {book.author?.username || 'Unknown author'} • {book.genre || 'General'}
                      </p>
                    </div>
                    <div className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                      {book.status || 'draft'}
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500">
                    <span className="rounded-full border border-slate-200 bg-white px-3 py-1">
                      {book.pagesCount || 0} pages
                    </span>
                    <span className="rounded-full border border-slate-200 bg-white px-3 py-1">
                      {formatCurrency(book.price || 0)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </AdminLayout>
  );
};

export default AdminOverview;
