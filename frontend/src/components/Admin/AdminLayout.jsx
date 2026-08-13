import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const NavIcon = ({ name, className = 'h-5 w-5' }) => {
  const props = {
    className,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '1.8',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true
  };

  switch (name) {
    case 'overview':
      return (
        <svg {...props}>
          <rect x="3" y="3" width="7" height="9" rx="1.5" />
          <rect x="14" y="3" width="7" height="5" rx="1.5" />
          <rect x="14" y="12" width="7" height="9" rx="1.5" />
          <rect x="3" y="16" width="7" height="5" rx="1.5" />
        </svg>
      );
    case 'traffic':
      return (
        <svg {...props}>
          <path d="M3 17l6-6 4 4 7-8" />
          <path d="M14 7h6v6" />
        </svg>
      );
    case 'books':
      return (
        <svg {...props}>
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
      );
    case 'users':
      return (
        <svg {...props}>
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );
    case 'finance':
      return (
        <svg {...props}>
          <line x1="12" y1="1" x2="12" y2="23" />
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      );
    case 'game':
      return (
        <svg {...props}>
          <path d="M6 12h4" />
          <path d="M8 10v4" />
          <circle cx="15.5" cy="10.5" r="0.8" fill="currentColor" stroke="none" />
          <circle cx="17.5" cy="13.5" r="0.8" fill="currentColor" stroke="none" />
          <path d="M2 14a5 5 0 0 0 5 5h1.5l1.5-3h5l1.5 3H18a5 5 0 0 0 5-5v-1a6 6 0 0 0-6-6H8a6 6 0 0 0-6 6z" />
        </svg>
      );
    case 'workboard':
      return (
        <svg {...props}>
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <path d="M3 10h18" />
          <path d="M9 4v16" />
        </svg>
      );
    case 'dashboard':
      return (
        <svg {...props}>
          <path d="M15 18l-6-6 6-6" />
        </svg>
      );
    case 'browse':
      return (
        <svg {...props}>
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4.3-4.3" />
        </svg>
      );
    default:
      return null;
  }
};

const allNavItems = [
  { to: '/admin', label: 'Overview', shortLabel: 'Home', icon: 'overview', roles: ['admin'] },
  { to: '/admin/traffic', label: 'Traffic', shortLabel: 'Traffic', icon: 'traffic', roles: ['admin'] },
  { to: '/admin/books', label: 'Books', shortLabel: 'Books', icon: 'books', roles: ['admin'] },
  { to: '/admin/users', label: 'Users', shortLabel: 'Users', icon: 'users', roles: ['admin'] },
  { to: '/admin/finance', label: 'Finance', shortLabel: 'Finance', icon: 'finance', roles: ['admin'] },
  { to: '/admin/game', label: 'Game', shortLabel: 'Game', icon: 'game', roles: ['admin'] },
  { to: '/admin/workboard', label: 'Workboard', shortLabel: 'Board', icon: 'workboard', roles: ['admin', 'superior'] }
];

const PanelIcon = ({ open }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {open ? (
      <>
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <path d="M9 4v16" />
        <polyline points="15 9 12 12 15 15" />
      </>
    ) : (
      <>
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <path d="M9 4v16" />
        <polyline points="12 9 15 12 12 15" />
      </>
    )}
  </svg>
);

const AdminLayout = ({
  eyebrow = 'Admin',
  title,
  description,
  stats = [],
  actions,
  children,
  chrome = 'default',
  hero = 'default'
}) => {
  const { user } = useAuth();
  const navItems = allNavItems.filter((item) => item.roles.includes(user?.role));
  const mobileCols = Math.min(Math.max(navItems.length, 1), 7);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const isMinimal = chrome === 'minimal';
  const isImmersive = chrome === 'immersive';
  const hideNav = isImmersive;
  const isSplitHero = hero === 'split' && stats.length > 0;

  return (
    <div
      className={`text-slate-900 ${
        isImmersive
          ? 'h-[100dvh] min-h-0 overflow-hidden bg-[var(--wb-board,#f7f1e8)]'
          : `min-h-screen pb-28 lg:pb-0 ${isMinimal ? 'bg-[var(--wb-board,#f7f1e8)]' : 'bg-slate-50'}`
      }`}
    >
      {!hideNav ? (
      <aside
        className={`fixed bottom-4 left-4 top-4 z-40 hidden flex-col overflow-hidden rounded-4xl border border-white/70 bg-white/90 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur transition-[width,padding] duration-300 ease-out lg:flex ${
          sidebarOpen ? 'w-[280px] p-5' : 'w-[76px] p-3'
        }`}
      >
        <div className={`mb-4 flex ${sidebarOpen ? 'justify-end' : 'justify-center'}`}>
          <button
            type="button"
            onClick={() => setSidebarOpen((open) => !open)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 active:scale-95"
            title={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            aria-expanded={sidebarOpen}
          >
            <PanelIcon open={sidebarOpen} />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-2 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/admin'}
              title={item.label}
              className={({ isActive }) =>
                `rounded-3xl border transition-all active:scale-[0.985] lg:active:scale-100 ${
                  sidebarOpen ? 'px-3.5 py-3' : 'flex h-12 w-12 items-center justify-center self-center p-0'
                } ${
                  isActive
                    ? 'border-slate-950 bg-slate-950 text-white shadow-lg'
                    : 'border-white/70 bg-white/70 text-slate-700 hover:border-slate-200 hover:bg-white'
                }`
              }
            >
              {({ isActive }) =>
                sidebarOpen ? (
                  <div className="flex items-center gap-3">
                    <span
                      className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl ${
                        isActive ? 'bg-white/15 text-white' : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      <NavIcon name={item.icon} />
                    </span>
                    <p className={`text-sm font-semibold ${isActive ? 'text-white' : 'text-slate-900'}`}>
                      {item.label}
                    </p>
                  </div>
                ) : (
                  <NavIcon name={item.icon} className="h-5 w-5" />
                )
              }
            </NavLink>
          ))}
        </nav>

        <div className={`mt-6 flex flex-col gap-3 ${sidebarOpen ? '' : 'items-center'}`}>
          <Link
            to="/dashboard"
            title="Dashboard"
            className={`inline-flex items-center justify-center rounded-3xl border border-slate-300 bg-white text-sm font-medium text-slate-800 transition hover:border-slate-400 hover:bg-slate-50 active:scale-95 ${
              sidebarOpen ? 'px-5 py-3' : 'h-12 w-12'
            }`}
          >
            {sidebarOpen ? '← Dashboard' : <NavIcon name="dashboard" />}
          </Link>
          <Link
            to="/all-books"
            title="Browse Books"
            className={`inline-flex items-center justify-center rounded-3xl bg-slate-950 text-sm font-medium text-white transition hover:bg-slate-800 active:scale-95 ${
              sidebarOpen ? 'px-5 py-3' : 'h-12 w-12'
            }`}
            style={{ color: 'white' }}
          >
            {sidebarOpen ? 'Browse Books' : <NavIcon name="browse" />}
          </Link>
        </div>
      </aside>
      ) : null}

      <section
        className={
          isImmersive
            ? 'relative h-full min-h-0 overflow-hidden p-0'
            : `relative transition-[padding] duration-300 ease-out lg:pr-8 ${
                isMinimal
                  ? 'px-3 pb-8 pt-4 sm:px-5 sm:pb-10 sm:pt-4'
                  : 'px-3 pb-10 pt-4 sm:px-6 sm:pb-16 sm:pt-6'
              } ${sidebarOpen ? 'lg:pl-[312px]' : 'lg:pl-[108px]'}`
        }
      >
        {isImmersive ? null : !isMinimal ? (
          <>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.96),rgba(241,245,249,0.92)_45%,rgba(226,232,240,0.7)_100%)]" />
            <div className="absolute inset-x-0 top-0 h-64 sm:h-80 bg-linear-to-b from-white via-white/80 to-transparent" />
            <div className="absolute left-1/2 top-20 sm:top-28 h-64 w-64 sm:h-80 sm:w-80 -translate-x-1/2 rounded-full bg-blue-200/25 blur-3xl" />
          </>
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,252,245,0.9),rgba(247,241,232,0.95)_50%,rgba(240,230,214,0.85)_100%)]" />
        )}

        <div
          className={`relative ${
            isImmersive ? 'mx-0 h-full max-w-none' : `mx-auto ${isMinimal ? 'max-w-[90rem]' : 'max-w-7xl'}`
          }`}
        >
          <main className={isImmersive ? 'h-full min-w-0' : 'min-w-0'}>
            {!isMinimal && !isImmersive ? (
              <div className="rounded-[1.75rem] border border-white/70 bg-white/80 p-4 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur sm:rounded-4xl sm:p-6 lg:p-8">
                <div
                  className={
                    isSplitHero
                      ? 'grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.85fr)] lg:items-center lg:gap-10'
                      : 'flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between'
                  }
                >
                  <div className="min-w-0">
                    <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">
                      {eyebrow}
                    </p>
                    <h1
                      className={`mt-3 font-semibold leading-[1.12] tracking-[-0.04em] text-balance text-slate-950 ${
                        isSplitHero
                          ? 'max-w-xl text-3xl sm:text-4xl lg:text-[2.75rem]'
                          : 'text-2xl sm:text-3xl lg:text-5xl'
                      }`}
                    >
                      {title}
                    </h1>
                    <p
                      className={`mt-4 text-sm leading-relaxed text-slate-600 sm:text-base ${
                        isSplitHero ? 'max-w-lg' : 'max-w-3xl'
                      }`}
                    >
                      {description}
                    </p>
                    {isSplitHero && actions ? (
                      <div className="mt-5 flex flex-wrap gap-3">{actions}</div>
                    ) : null}
                  </div>

                  {isSplitHero ? (
                    <div className="grid grid-cols-2 gap-3 rounded-[1.5rem] bg-slate-950 p-3 text-white sm:gap-4 sm:p-4">
                      {stats.map((stat) => (
                        <div key={stat.label} className="min-w-0 rounded-2xl bg-white/10 px-3.5 py-4 sm:px-4 sm:py-5">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/50 sm:text-[11px]">
                            {stat.label}
                          </p>
                          <p className="mt-2 wrap-break-word text-xl font-semibold tracking-tight sm:text-2xl lg:text-[1.7rem]">
                            {stat.value}
                          </p>
                          {stat.helper ? (
                            <p className="mt-2 text-xs leading-tight text-white/55">{stat.helper}</p>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  ) : actions ? (
                    <div className="flex w-full shrink-0 flex-col gap-3 pt-2 sm:w-auto sm:flex-row sm:flex-wrap lg:pt-0">
                      {actions}
                    </div>
                  ) : null}
                </div>

                {!isSplitHero && stats.length > 0 ? (
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
            ) : null}

            <div
              className={
                isImmersive
                  ? 'h-full'
                  : isMinimal
                    ? 'space-y-3'
                    : 'mt-5 space-y-5 sm:mt-6 sm:space-y-6'
              }
            >
              {children}
            </div>
          </main>
        </div>
      </section>

      {!hideNav ? (
      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200/80 bg-white/95 px-2 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] pt-2 shadow-[0_-14px_30px_rgba(15,23,42,0.12)] backdrop-blur lg:hidden">
        <div
          className="mx-auto grid max-w-lg gap-1"
          style={{ gridTemplateColumns: `repeat(${mobileCols}, minmax(0, 1fr))` }}
        >
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
                <NavIcon name={item.icon} className="h-4 w-4" />
              </span>
              <span className="max-w-full truncate">{item.shortLabel}</span>
            </NavLink>
          ))}
        </div>
      </nav>
      ) : null}
    </div>
  );
};

export default AdminLayout;
