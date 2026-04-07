import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const navItems = [
  { to: '/admin', label: 'Overview', helper: 'Performance snapshot' },
  { to: '/admin/traffic', label: 'Traffic', helper: 'Visitors and site speed' },
  { to: '/admin/books', label: 'Books', helper: 'Catalog and sales' },
  { to: '/admin/users', label: 'Users', helper: 'Roles and access' },
  { to: '/admin/finance', label: 'Finance', helper: 'Revenue and payments' }
];

const AdminLayout = ({ eyebrow = 'Admin', title, description, stats = [], actions, children }) => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen overflow-hidden bg-slate-50 text-slate-900">
      <section className="relative px-4 pb-16 pt-20 sm:px-6 md:pt-28 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.96),rgba(241,245,249,0.92)_45%,rgba(226,232,240,0.7)_100%)]" />
        <div className="absolute inset-x-0 top-0 h-80 bg-linear-to-b from-white via-white/80 to-transparent" />
        <div className="absolute left-1/2 top-28 h-80 w-80 -translate-x-1/2 rounded-full bg-blue-200/25 blur-3xl" />

        <div className="relative mx-auto max-w-7xl">
          <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
            <aside className="h-fit rounded-4xl border border-white/70 bg-white/82 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur lg:sticky lg:top-28">
              <div className="rounded-[1.75rem] border border-slate-200/80 bg-slate-50/90 p-5">
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

              <nav className="mt-5 flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible">
                {navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === '/admin'}
                    className={({ isActive }) =>
                    `min-w-[180px] rounded-3xl border px-4 py-3 transition lg:min-w-0 ${
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

              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  to="/dashboard"
                  className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 transition hover:border-slate-400 hover:bg-slate-50"
                >
                  Dashboard
                </Link>
                <Link
                  to="/all-books"
                  className="inline-flex items-center justify-center rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
                  style={{ color: 'white' }}
                >
                  Browse Books
                </Link>
              </div>
            </aside>

            <main className="min-w-0">
              <div className="rounded-4xl border border-white/70 bg-white/80 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur sm:p-8">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">
                      {eyebrow}
                    </p>
                    <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-5xl">
                      {title}
                    </h1>
                    <p className="mt-4 max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-base">
                      {description}
                    </p>
                  </div>
                  {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
                </div>

                {stats.length > 0 ? (
                  <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {stats.map((stat) => (
                      <div
                        key={stat.label}
                        className="rounded-[1.75rem] border border-slate-200 bg-slate-50/90 p-5"
                      >
                        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                          {stat.label}
                        </p>
                        <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
                          {stat.value}
                        </p>
                        {stat.helper ? (
                          <p className="mt-2 text-sm text-slate-600">{stat.helper}</p>
                        ) : null}
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>

              <div className="mt-6 space-y-6">{children}</div>
            </main>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminLayout;
