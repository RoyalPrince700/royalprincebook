import React from 'react';
import NavIcon from '../../../components/NavIcon';

const DEMO_LABEL = ({ children }) => (
  <span className="c4-demo-label">{children}</span>
);

export const TypographyScaleDemo = () => (
  <div className="c4-demo c4-demo-typography">
    <p className="c4-demo-intro">
      Scroll through each row. Every line is rendered at the <strong>actual size</strong> used on Royal Prince Hub.
      The badge on the right shows the Tailwind class.
    </p>
    <div className="c4-type-scale">
      <div className="c4-type-row">
        <span className="c4-eyebrow">First Book Release</span>
        <DEMO_LABEL>text-[11px] uppercase tracking-[0.2em] — Eyebrow / label</DEMO_LABEL>
      </div>
      <div className="c4-type-row">
        <h1 className="c4-h1">Ownership. Curiosity. Execution.</h1>
        <DEMO_LABEL>text-4xl → text-7xl — Hero H1 (one per page)</DEMO_LABEL>
      </div>
      <div className="c4-type-row">
        <h2 className="c4-h2">Featured Books</h2>
        <DEMO_LABEL>text-2xl → text-3xl — Section H2</DEMO_LABEL>
      </div>
      <div className="c4-type-row">
        <h3 className="c4-h3">Build with AI: From Zero to Full-Stack Developer</h3>
        <DEMO_LABEL>text-lg font-semibold — Card / item H3</DEMO_LABEL>
      </div>
      <div className="c4-type-row">
        <p className="c4-body">
          Learn MERN stack development with Cursor AI — from landing pages to full e-commerce
          applications. This is body text: readable, relaxed line-height, muted colour.
        </p>
        <DEMO_LABEL>text-base → text-lg text-slate-600 — Body paragraph</DEMO_LABEL>
      </div>
      <div className="c4-type-row">
        <p className="c4-caption">© 2026 Royal Prince · Launch offer price · 2 min read</p>
        <DEMO_LABEL>text-xs text-slate-500 — Caption / meta</DEMO_LABEL>
      </div>
    </div>
  </div>
);

export const FontWeightDemo = () => (
  <div className="c4-demo c4-demo-weights">
    <p className="c4-demo-intro">Same font family (Inter), same size — only the <strong>weight</strong> changes.</p>
    <div className="c4-weight-grid">
      {[
        { class: 'c4-w-normal', label: 'font-normal (400)', use: 'Body paragraphs' },
        { class: 'c4-w-medium', label: 'font-medium (500)', use: 'Nav links, buttons' },
        { class: 'c4-w-semibold', label: 'font-semibold (600)', use: 'Headings, card titles' },
        { class: 'c4-w-bold', label: 'font-bold (700)', use: 'Strong emphasis — use sparingly' }
      ].map((item) => (
        <div key={item.label} className="c4-weight-card">
          <p className={item.class}>The quick brown fox jumps over the lazy dog.</p>
          <DEMO_LABEL>{item.label}</DEMO_LABEL>
          <span className="c4-weight-use">{item.use}</span>
        </div>
      ))}
    </div>
  </div>
);

export const FontSizeScaleDemo = () => (
  <div className="c4-demo c4-demo-sizes">
    <p className="c4-demo-intro">Tailwind size scale — do not pick random pixel values. Use the scale.</p>
    <div className="c4-size-list">
      {[
        { cls: 'text-xs', px: '12px', sample: 'Extra small — fine print' },
        { cls: 'text-sm', px: '14px', sample: 'Small — buttons, compact UI' },
        { cls: 'text-base', px: '16px', sample: 'Base — default body text' },
        { cls: 'text-lg', px: '18px', sample: 'Large — comfortable reading' },
        { cls: 'text-xl', px: '20px', sample: 'XL — subheadings' },
        { cls: 'text-2xl', px: '24px', sample: '2XL — section titles' },
        { cls: 'text-4xl', px: '36px', sample: '4XL — hero headlines (mobile)' },
        { cls: 'text-6xl', px: '60px', sample: '6XL — hero headlines (desktop)' }
      ].map((row) => (
        <div key={row.cls} className="c4-size-row">
          <span className={`c4-size-sample c4-size-${row.cls.replace('text-', '')}`}>{row.sample}</span>
          <div className="c4-size-meta">
            <DEMO_LABEL>{row.cls}</DEMO_LABEL>
            <span className="c4-size-px">{row.px}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const IconGalleryDemo = () => {
  const icons = [
    { name: 'home', label: 'Home', use: 'Navbar — return to start' },
    { name: 'book', label: 'Books', use: 'Store / library links' },
    { name: 'blog', label: 'Blog', use: 'Writing section' },
    { name: 'taskboard', label: 'Taskboard', use: 'App tools' },
    { name: 'noteboard', label: 'Noteboard', use: 'Notes / canvas' },
    { name: 'dashboard', label: 'Dashboard', use: 'User account hub' },
    { name: 'admin', label: 'Admin', use: 'Settings / control' },
    { name: 'user', label: 'User', use: 'Account menu' },
    { name: 'moon', label: 'Moon', use: 'Switch to dark mode' },
    { name: 'sun', label: 'Sun', use: 'Switch to light mode' },
    { name: 'mail', label: 'Mail', use: 'Contact / email' },
    { name: 'cart', label: 'Cart', use: 'Shopping' }
  ];

  return (
    <div className="c4-demo c4-demo-icons">
      <p className="c4-demo-intro">
        Real SVG icons from <code>NavIcon.jsx</code> on this site — not emoji. Each uses{' '}
        <code>stroke="currentColor"</code> so the icon inherits text colour.
      </p>
      <div className="c4-icon-grid">
        {icons.map((icon) => (
          <div key={icon.name} className="c4-icon-card">
            <div className="c4-icon-visual">
              <NavIcon name={icon.name} className="c4-icon-svg" />
            </div>
            <strong>{icon.label}</strong>
            <span className="c4-icon-use">{icon.use}</span>
            <DEMO_LABEL>NavIcon name=&quot;{icon.name}&quot;</DEMO_LABEL>
          </div>
        ))}
      </div>
    </div>
  );
};

export const IconInContextDemo = () => (
  <div className="c4-demo c4-demo-icon-context">
    <p className="c4-demo-intro">
      Icons in navigation always sit <strong>beside a text label</strong>. This is the exact navbar pattern from{' '}
      <code>Navbar.jsx</code>.
    </p>
    <div className="c4-icon-nav-preview">
      {[
        { name: 'home', label: 'Home', active: true },
        { name: 'book', label: 'Books' },
        { name: 'blog', label: 'Blog' },
        { name: 'taskboard', label: 'Taskboard' }
      ].map((link) => (
        <span key={link.label} className={`c4-icon-nav-link ${link.active ? 'is-active' : ''}`}>
          <NavIcon name={link.name} className="c4-icon-nav-svg" />
          <span>{link.label}</span>
        </span>
      ))}
      <button type="button" className="c4-icon-nav-theme" aria-label="Theme toggle demo">
        <NavIcon name="moon" className="c4-icon-nav-svg" />
      </button>
    </div>
    <p className="c4-demo-note">
      Wrong: icon alone with no label. Right: icon + text, or icon + <code>aria-label</code> for screen readers.
    </p>
  </div>
);

export const ColorPaletteDemo = () => {
  const slate = [
    { name: 'slate-50', hex: '#f8fafc', role: 'Page background' },
    { name: 'slate-100', hex: '#f1f5f9', role: 'Subtle sections' },
    { name: 'slate-200', hex: '#e2e8f0', role: 'Borders' },
    { name: 'slate-400', hex: '#94a3b8', role: 'Disabled / muted' },
    { name: 'slate-600', hex: '#475569', role: 'Body text' },
    { name: 'slate-950', hex: '#020617', role: 'Headlines, primary buttons' }
  ];

  const brand = [
    { name: 'primary', hex: '#4f46e5', role: 'Links, focus (light mode)' },
    { name: 'gold accent', hex: '#c9a227', role: 'Tags, premium badges' },
    { name: 'success', hex: '#047857', role: 'Confirmations' },
    { name: 'danger', hex: '#ef4444', role: 'Delete, errors' }
  ];

  return (
    <div className="c4-demo c4-demo-colors">
      <p className="c4-demo-intro">Tap each swatch mentally to your project. Headlines dark, body muted, accent sparingly.</p>
      <h4 className="c4-demo-subhead">Neutral scale (Slate)</h4>
      <div className="c4-swatch-row">
        {slate.map((c) => (
          <div key={c.name} className="c4-swatch">
            <div className="c4-swatch-color" style={{ background: c.hex }} />
            <strong>{c.name}</strong>
            <span>{c.hex}</span>
            <span className="c4-swatch-role">{c.role}</span>
          </div>
        ))}
      </div>
      <h4 className="c4-demo-subhead">Brand & semantic</h4>
      <div className="c4-swatch-row c4-swatch-row-brand">
        {brand.map((c) => (
          <div key={c.name} className="c4-swatch">
            <div className="c4-swatch-color" style={{ background: c.hex }} />
            <strong>{c.name}</strong>
            <span>{c.hex}</span>
            <span className="c4-swatch-role">{c.role}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const Color6010Demo = () => (
  <div className="c4-demo c4-demo-6010">
    <p className="c4-demo-intro">The 60-30-10 rule on one screen — same proportions pros use on landing pages.</p>
    <div className="c4-layout-6010">
      <div className="c4-zone c4-zone-60">
        <span>60% — Dominant background</span>
        <code>bg-slate-50</code>
      </div>
      <div className="c4-zone-30">
        <span>30% — Cards & surfaces</span>
        <code>bg-white border shadow</code>
        <div className="c4-zone-card">Book card · Nav bar · Content panel</div>
      </div>
      <div className="c4-zone-10">
        <span>10% — Accent only</span>
        <button type="button" className="c4-accent-btn">Order Now</button>
        <span className="c4-gold-tag">Launch Offer</span>
      </div>
    </div>
  </div>
);

export const ContrastDemo = () => (
  <div className="c4-demo c4-demo-contrast">
    <p className="c4-demo-intro">Readable vs pretty-but-failed. Squint test: can you still read the bad example?</p>
    <div className="c4-contrast-grid">
      <div className="c4-contrast-card c4-contrast-good">
        <span className="c4-contrast-badge c4-contrast-badge-good">Good</span>
        <h4 className="c4-contrast-h">Featured Books</h4>
        <p className="c4-contrast-body-good">
          Body text uses slate-600 on white — enough contrast for comfortable reading.
        </p>
        <DEMO_LABEL>text-slate-950 + text-slate-600</DEMO_LABEL>
      </div>
      <div className="c4-contrast-card c4-contrast-bad">
        <span className="c4-contrast-badge c4-contrast-badge-bad">Too light</span>
        <h4 className="c4-contrast-h-bad">Featured Books</h4>
        <p className="c4-contrast-body-bad">
          Body text too faint — looks &quot;minimal&quot; but fails accessibility and strains the eye.
        </p>
        <DEMO_LABEL>text-slate-300 on white — avoid</DEMO_LABEL>
      </div>
    </div>
  </div>
);

export const ButtonStylesDemo = () => (
  <div className="c4-demo c4-demo-buttons">
    <p className="c4-demo-intro">Same button classes used across Royal Prince Hub — primary draws the eye first.</p>
    <div className="c4-button-row">
      <button type="button" className="pf-btn pf-btn-primary">Primary — View My Work</button>
      <button type="button" className="pf-btn pf-btn-secondary">Secondary — Learn More</button>
      <button type="button" className="pf-btn pf-btn-primary pf-btn-sm">Small — Read</button>
    </div>
    <div className="c4-button-meta">
      <DEMO_LABEL>pf-btn-primary</DEMO_LABEL>
      <DEMO_LABEL>pf-btn-secondary</DEMO_LABEL>
      <DEMO_LABEL>pf-btn-sm</DEMO_LABEL>
    </div>
    <p className="c4-demo-note">
      Use <code>&lt;Link&gt;</code> when navigating to another page. Use <code>&lt;button&gt;</code> for toggles and form submit.
    </p>
  </div>
);

export const SpacingDemo = () => (
  <div className="c4-demo c4-demo-spacing">
    <p className="c4-demo-intro">Consistent padding and gap — when a layout feels &quot;off&quot;, spacing is often the cause.</p>
    <div className="c4-spacing-grid">
      <div className="c4-spacing-card c4-p-tight">
        <span>p-2 · gap-2</span>
        <p>Too tight — cramped, amateur</p>
      </div>
      <div className="c4-spacing-card c4-p-good">
        <span>p-5 · gap-4</span>
        <p>Balanced — card padding on this site</p>
      </div>
      <div className="c4-spacing-card c4-p-loose">
        <span>p-8 · gap-6</span>
        <p>Generous — hero sections, feature blocks</p>
      </div>
    </div>
  </div>
);

export const ThemeVariablesDemo = () => (
  <div className="c4-demo c4-demo-theme">
    <p className="c4-demo-intro">Light vs dark — CSS variables from <code>index.css</code>. Toggle theme on this site to see them swap live.</p>
    <div className="c4-theme-columns">
      <div className="c4-theme-panel c4-theme-light">
        <span>Light mode</span>
        <div className="c4-theme-swatch" style={{ background: '#f3f4f6' }}>--bg-color</div>
        <div className="c4-theme-swatch" style={{ background: '#ffffff', color: '#111827' }}>--card-bg</div>
        <div className="c4-theme-swatch" style={{ background: '#111827', color: '#fff' }}>--text-primary</div>
        <div className="c4-theme-swatch" style={{ background: '#4f46e5', color: '#fff' }}>--primary-color</div>
      </div>
      <div className="c4-theme-panel c4-theme-dark">
        <span>Dark mode</span>
        <div className="c4-theme-swatch" style={{ background: '#111827', color: '#f9fafb' }}>--bg-color</div>
        <div className="c4-theme-swatch" style={{ background: '#1f2937', color: '#f9fafb' }}>--card-bg</div>
        <div className="c4-theme-swatch" style={{ background: '#f9fafb', color: '#111827' }}>--text-primary</div>
        <div className="c4-theme-swatch" style={{ background: '#6366f1', color: '#fff' }}>--primary-color</div>
      </div>
    </div>
  </div>
);

export const chapter4DemoMap = {
  'typography-scale': TypographyScaleDemo,
  'font-weights': FontWeightDemo,
  'font-sizes': FontSizeScaleDemo,
  'icon-gallery': IconGalleryDemo,
  'icon-in-context': IconInContextDemo,
  'color-palette': ColorPaletteDemo,
  'color-6010': Color6010Demo,
  contrast: ContrastDemo,
  buttons: ButtonStylesDemo,
  spacing: SpacingDemo,
  'theme-variables': ThemeVariablesDemo
};
