import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminLayout from './AdminLayout';
import PageLoader from '../PageLoader';
import { formatCurrency, formatDate, formatDateTime } from './adminUtils';

const AdminFinance = () => {
  const [finance, setFinance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFinance = async () => {
      try {
        const response = await axios.get('/admin/finance');
        setFinance(response.data);
      } catch (fetchError) {
        console.error('Failed to load admin finance:', fetchError);
        setError('Failed to load finance data.');
      } finally {
        setLoading(false);
      }
    };

    fetchFinance();
  }, []);

  if (loading) {
    return (
      <PageLoader
        title="Loading finance data"
        message="Reviewing verified payments, revenue totals, and paid readers."
      />
    );
  }

  const stats = finance?.stats || {};
  const transactions = finance?.transactions || [];
  const paidUsers = finance?.paidUsers || [];

  return (
    <AdminLayout
      eyebrow="Admin Finance"
      title="Follow revenue with more confidence."
      description="Track verified payments, books unlocked, and the readers who have completed purchases so far."
      stats={[
        { label: 'Total Revenue', value: formatCurrency(stats.totalRevenue || 0), helper: 'From verified payment records' },
        { label: 'Transactions', value: stats.totalTransactions || 0, helper: 'Successful verified payments' },
        { label: 'Avg Order', value: formatCurrency(stats.averageOrderValue || 0), helper: 'Average value per verified payment' },
        { label: 'Paid Users', value: stats.paidUsers || 0, helper: `${stats.booksUnlocked || 0} books unlocked overall` }
      ]}
    >
      {error ? (
        <div className="rounded-4xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
        <section className="rounded-4xl border border-white/70 bg-white/80 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
              Transactions
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
              Verified purchase history
            </h2>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-y-3">
              <thead>
                <tr className="text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  <th className="px-4 py-2">User</th>
                  <th className="px-4 py-2">Book</th>
                  <th className="px-4 py-2">Amount</th>
                  <th className="px-4 py-2">Method</th>
                  <th className="px-4 py-2">Date</th>
                  <th className="px-4 py-2">Reference</th>
                </tr>
              </thead>
              <tbody>
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-4 py-10 text-center text-sm text-slate-600">
                      No verified transactions recorded yet.
                    </td>
                  </tr>
                ) : (
                  transactions.map((transaction) => (
                    <tr key={transaction._id} className="rounded-3xl bg-slate-50/90 text-sm text-slate-700">
                      <td className="rounded-l-3xl border border-r-0 border-slate-200 px-4 py-4">
                        <p className="font-semibold text-slate-950">{transaction.user?.username || 'Unknown'}</p>
                        <p className="text-xs text-slate-500">{transaction.user?.email || 'No email'}</p>
                      </td>
                      <td className="border border-l-0 border-r-0 border-slate-200 px-4 py-4">
                        {transaction.book?.title || 'Unknown book'}
                      </td>
                      <td className="border border-l-0 border-r-0 border-slate-200 px-4 py-4 font-medium text-slate-900">
                        {formatCurrency(transaction.amount || 0)}
                      </td>
                      <td className="border border-l-0 border-r-0 border-slate-200 px-4 py-4">
                        {transaction.paymentType || 'Flutterwave'}
                      </td>
                      <td className="border border-l-0 border-r-0 border-slate-200 px-4 py-4">
                        {formatDateTime(transaction.paidAt || transaction.createdAt)}
                      </td>
                      <td className="rounded-r-3xl border border-l-0 border-slate-200 px-4 py-4 font-mono text-xs text-slate-500">
                        {transaction.transactionId}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-4xl border border-white/70 bg-white/80 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
              Paid Users
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
              Readers with purchase activity
            </h2>
          </div>

          <div className="mt-6 space-y-3">
            {paidUsers.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center text-sm text-slate-600">
                No paid users yet.
              </div>
            ) : (
              paidUsers.map((user) => (
                <div
                  key={user._id}
                  className="rounded-3xl border border-slate-200 bg-slate-50/90 px-5 py-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-950">{user.username}</p>
                      <p className="text-sm text-slate-600">{user.email}</p>
                    </div>
                    <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                      {user.role}
                    </span>
                  </div>
                  <div className="mt-3 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
                    <p>Books unlocked: <span className="font-medium text-slate-900">{user.purchasedBooksCount || 0}</span></p>
                    <p>Payments: <span className="font-medium text-slate-900">{user.paymentCount || 0}</span></p>
                    <p>Total spent: <span className="font-medium text-slate-900">{formatCurrency(user.totalSpent || 0)}</span></p>
                    <p>Last payment: <span className="font-medium text-slate-900">{formatDate(user.lastPaymentAt)}</span></p>
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

export default AdminFinance;
