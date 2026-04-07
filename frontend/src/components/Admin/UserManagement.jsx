import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import AdminLayout from './AdminLayout';
import PageLoader from '../PageLoader';
import { formatCurrency, formatDate } from './adminUtils';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { user: currentUser } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/admin/users');
        setUsers(response.data.users || []);
      } catch (fetchError) {
        console.error('Failed to fetch users:', fetchError);
        setError('Failed to load users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const stats = useMemo(() => {
    const totalAdmins = users.filter((user) => user.role === 'admin').length;
    const paidUsers = users.filter((user) => user.hasPaid).length;

    return {
      totalUsers: users.length,
      totalAdmins,
      readers: users.length - totalAdmins,
      paidUsers
    };
  }, [users]);

  const handleRoleUpdate = async (userId, newRole) => {
    try {
      setError('');
      setSuccess('');
      await axios.put(`/auth/users/${userId}/role`, { role: newRole });

      setUsers(users.map((user) => (
        user._id === userId ? { ...user, role: newRole } : user
      )));

      setSuccess('User role updated successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (updateError) {
      console.error('Failed to update role:', updateError);
      setError('Failed to update user role');
    }
  };

  if (loading) {
    return (
      <PageLoader
        title="Loading user management"
        message="Fetching team accounts, roles, and access controls."
      />
    );
  }

  return (
    <AdminLayout
      eyebrow="Admin Users"
      title="Manage roles with better visibility."
      description="Review all users, see who has paid, and update access levels from a layout that matches the rest of the site."
      stats={[
        { label: 'Total Users', value: stats.totalUsers, helper: 'All accounts in the system' },
        { label: 'Admins', value: stats.totalAdmins, helper: 'Users with elevated access' },
        { label: 'Readers', value: stats.readers, helper: 'Standard user accounts' },
        { label: 'Paid Users', value: stats.paidUsers, helper: 'Accounts with purchase activity' }
      ]}
    >
      {error ? (
        <div className="rounded-4xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {success ? (
        <div className="rounded-4xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-700">
          {success}
        </div>
      ) : null}

      <section className="rounded-4xl border border-white/70 bg-white/80 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
              Users
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
              Account directory
            </h2>
          </div>
          <div className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700">
            {users.length} {users.length === 1 ? 'user' : 'users'}
          </div>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-3">
            <thead>
              <tr className="text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                <th className="px-4 py-2">User</th>
                <th className="px-4 py-2">Role</th>
                <th className="px-4 py-2">Paid</th>
                <th className="px-4 py-2">Books</th>
                <th className="px-4 py-2">Spent</th>
                <th className="px-4 py-2">Joined</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-4 py-10 text-center text-sm text-slate-600">
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((user) => {
                  const isCurrentUser = String(user._id) === String(currentUser?.id || currentUser?._id);

                  return (
                    <tr key={user._id} className="rounded-3xl bg-slate-50/90 text-sm text-slate-700">
                      <td className="rounded-l-3xl border border-r-0 border-slate-200 px-4 py-4">
                        <p className="font-semibold text-slate-950">{user.username}</p>
                        <p className="text-xs text-slate-500">{user.email}</p>
                      </td>
                      <td className="border border-l-0 border-r-0 border-slate-200 px-4 py-4">
                        <span className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${
                          user.role === 'admin'
                            ? 'border-blue-200 bg-blue-50 text-blue-700'
                            : 'border-slate-200 bg-white text-slate-600'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="border border-l-0 border-r-0 border-slate-200 px-4 py-4">
                        <span className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${
                          user.hasPaid
                            ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                            : 'border-slate-200 bg-white text-slate-500'
                        }`}>
                          {user.hasPaid ? 'Paid' : 'Not yet'}
                        </span>
                      </td>
                      <td className="border border-l-0 border-r-0 border-slate-200 px-4 py-4">
                        {user.booksUnlockedCount ?? user.purchasedBooksCount ?? 0}
                      </td>
                      <td className="border border-l-0 border-r-0 border-slate-200 px-4 py-4 font-medium text-slate-900">
                        {formatCurrency(user.totalSpent || 0)}
                      </td>
                      <td className="border border-l-0 border-r-0 border-slate-200 px-4 py-4">
                        {formatDate(user.createdAt)}
                      </td>
                      <td className="rounded-r-3xl border border-l-0 border-slate-200 px-4 py-4">
                        {isCurrentUser ? (
                          <span className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                            Current user
                          </span>
                        ) : (
                          <select
                            value={user.role}
                            onChange={(event) => handleRoleUpdate(user._id, event.target.value)}
                            className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm text-slate-800 outline-none transition focus:border-slate-500"
                          >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                          </select>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </AdminLayout>
  );
};

export default UserManagement;
