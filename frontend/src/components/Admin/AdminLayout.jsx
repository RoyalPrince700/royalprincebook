import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const navItems = [
  { to: '/admin', label: 'Overview', shortLabel: 'Home', icon: '⌂', helper: 'Performance snapshot' },
  { to: '/admin/traffic', label: 'Traffic', shortLabel: 'Traffic', icon: '↗', helper: 'Visitors and site speed' },
  { to: '/admin/books', label: 'Books', shortLabel: 'Books', icon: 'B', helper: 'Catalog and sales' },
  { to: '/admin/users', label: 'Users', shortLabel: 'Users', icon: 'U', helper: 'Roles and access' },
  { to: '/admin/finance', label: 'Finance', shortLabel: 'Finance', icon: '₦', helper: 'Revenue and payments' },
  { to: '/admin/game', label: 'Game', shortLabel: 'Game', icon: 'G', helper: 'English & speech mastery' }
];

const AdminLayout = ({ eyebrow = 'Admin', title, description, stats = [], actions, children }) => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen overflow-hidden bg-slate-50 pb-28 text-slate-900 lg:pb-0">
      <section className="relative px-3 pb-10 pt-14 sm:px-6 sm:pb-16 sm:pt-20 md:pt-28 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.96),rgba(241,245,249,0.92)_45%,rgba(226,232,240,0.7)_100%)]" />
        <div className="absolute inset-x-0 top-0 h-64 sm:h-80 bg-linear-to-b from-white via-white/80 to-transparent" />
        <div className="absolute left-1/2 top-20 sm:top-28 h-64 w-64 sm:h-80 sm:w-80 -translate-x-1/2 rounded-full bg-blue-200/25 blur-3xl" />

        <div className="relative mx-auto max-w-7xl">
          <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
            <aside className="hidden h-fit rounded-4xl border border-white/70 bg-white/82 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur lg:sticky lg:top-28 lg:block max-w-full">
              <div className="rounded-[1.75rem] border border-slate-200/80 bg-slate-50/90 p-4 sm:p-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">
                  RoyalPrince Hub
                </p>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
                  Admin Panel
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  Track visitors, books, revenue, and recent purchase activity from one place.
                </p>
                <div className="mt-4 rounded-2xl border border-slate-200 bg-white px-4 py-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Signed in
                  </p>
                  <p className="mt-1 text-sm font-medium text-slate-900">{user?.username}</p>
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{user?.role}</p>
                </div>
              </div>

              <nav className="mt-5 flex flex-col gap-2">
                {navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === '/admin'}
                    className={({ isActive }) =>
                    `rounded-3xl border px-3.5 py-3 transition-all active:scale-[0.985] lg:active:scale-100 ${
                        isActive
                          ? 'border-slate-950 bg-slate-950 text-white shadow-lg'
                          : 'border-white/70 bg-white/70 text-slate-700 hover:border-slate-200 hover:bg-white'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <p className={`text-sm font-semibold ${isActive ? 'text-white' : 'text-slate-900'}`}>
                          {item.label}
                        </p>
                        <p className={`mt-1 text-xs ${isActive ? 'text-white/70' : 'text-slate-500'}`}>
                          {item.helper}
                        </p>
                      </>
                    )}
                  </NavLink>
                ))}
              </nav>

              <div className="mt-6 flex flex-col gap-3">
                <Link
                  to="/dashboard"
                  className="inline-flex items-center justify-center rounded-3xl border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-800 transition hover:border-slate-400 hover:bg-slate-50 active:scale-95"
                >
                  ← Dashboard
                </Link>
                <Link
                  to="/all-books"
                  className="inline-flex items-center justify-center rounded-3xl bg-slate-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800 active:scale-95"
                  style={{ color: 'white' }}
                >
                  Browse Books
                </Link>
              </div>
            </aside>

            <main className="min-w-0">
              <div className="rounded-[1.75rem] border border-white/70 bg-white/80 p-4 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur sm:rounded-4xl sm:p-6 lg:p-8">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                  <div className="flex-1">
                    <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">
                      {eyebrow}
                    </p>
                    <h1 className="mt-3 text-2xl font-semibold leading-tight tracking-[-0.04em] text-slate-950 sm:text-3xl lg:text-5xl">
                      {title}
                    </h1>
                    <p className="mt-4 max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-base">
                      {description}
                    </p>
                  </div>
                  {actions ? (
                    <div className="flex w-full flex-col gap-3 pt-2 sm:w-auto sm:flex-row sm:flex-wrap lg:pt-0">
                      {actions}
                    </div>
                  ) : null}
                </div>

                {stats.length > 0 ? (
                  <div className="mt-6 grid grid-cols-1 gap-3 sm:mt-8 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
                    {stats.map((stat) => (
                      <div
                        key={stat.label}
                        className="rounded-3xl border border-slate-200 bg-slate-50/90 p-4 transition-all hover:shadow-sm sm:p-6"
                      >
                        <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                          {stat.label}
                        </p>
                        <p className="mt-3 wrap-break-word text-2xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                          {stat.value}
                        </p>
                        {stat.helper ? (
                          <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-tight">{stat.helper}</p>
                        ) : null}
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>

              <div className="mt-5 space-y-5 sm:mt-6 sm:space-y-6">{children}</div>
            </main>
          </div>
        </div>
      </section>
      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200/80 bg-white/95 px-2 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] pt-2 shadow-[0_-14px_30px_rgba(15,23,42,0.12)] backdrop-blur lg:hidden">
        <div className="mx-auto grid max-w-lg grid-cols-6 gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/admin'}
              className={({ isActive }) =>
                `flex min-w-0 flex-col items-center justify-center rounded-2xl px-1.5 py-2 text-[10px] font-semibold transition active:scale-95 ${
                  isActive
                    ? 'bg-slate-950 text-white shadow-lg'
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                }`
              }
            >
              <span className="mb-0.5 flex h-6 w-6 items-center justify-center rounded-full text-sm leading-none">
                {item.icon}
              </span>
              <span className="max-w-full truncate">{item.shortLabel}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default AdminLayout;
