import React, { useState } from 'react';
import Chapter5NavbarPreview from '../components/Chapter5NavbarPreview';
import Chapter5SitePreview from '../components/Chapter5SitePreview';
import PortfolioPreviewShell from '../components/PortfolioPreviewShell';
import HeroSection from '../../../portfolio/components/HeroSection';
import BookCard from '../../../components/Book/BookCard';
import Footer from '../../../components/Footer';
import NavIcon from '../../../components/NavIcon';
import { chapter5SampleBooks } from '../data/chapter5ReferenceData';
import '../../../portfolio/styles/portfolio.css';

const CursorPrompt = ({ title = 'Recreate in Cursor', prompt }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt.trim());
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="c5-cursor-prompt">
      <div className="c5-cursor-prompt-header">
        <NavIcon name="spark" className="c5-cursor-prompt-icon" />
        <strong>{title}</strong>
        <button type="button" className="c5-copy-btn" onClick={handleCopy}>
          {copied ? 'Copied!' : 'Copy prompt'}
        </button>
      </div>
      <p className="c5-cursor-prompt-note">Paste into Cursor Agent mode after studying the UI above.</p>
      <pre className="c5-cursor-prompt-text">{prompt.trim()}</pre>
    </div>
  );
};

const AnnotatedList = ({ items }) => (
  <ul className="c5-annotate-list">
    {items.map((item) => (
      <li key={item}>{item}</li>
    ))}
  </ul>
);

export const NavbarUIDemo = () => (
  <div className="c5-demo">
    <p className="c5-demo-eyebrow">Live UI · Navbar</p>
    <div className="c5-demo-frame">
      <Chapter5SitePreview variant="nav">
        <Chapter5NavbarPreview activePath="/all-books" />
      </Chapter5SitePreview>
    </div>
    <AnnotatedList
      items={[
        'RP brand mark on the left — users expect logo/home there',
        'Each link shows icon + text (from Chapter 4)',
        'Active page is highlighted so users know where they are',
        'Sign in + theme toggle on the right — actions, not navigation'
      ]}
    />
    <CursorPrompt
      prompt={`Recreate this navbar UI for my React + Tailwind project.

Visual requirements:
- Brand mark "RP" (or my initials) linking to home, top-left
- Horizontal nav links with SVG icons beside text labels: Home, Books, Blog
- Highlight the active link with a subtle background pill
- Sign in button + moon/sun theme toggle on the right
- Rounded pill shape, clean spacing, mobile-friendly (collapse to menu on small screens)

Match the polished look of Royal Prince Hub. Use a reusable NavIcon component with currentColor SVG strokes. Explain each part after you generate the code.`}
    />
  </div>
);

export const HeroUIDemo = () => (
  <div className="c5-demo">
    <p className="c5-demo-eyebrow">Live UI · Hero section</p>
    <div className="c5-demo-frame c5-demo-frame-hero">
      <Chapter5SitePreview variant="hero">
        <HeroSection />
      </Chapter5SitePreview>
    </div>
    <AnnotatedList
      items={[
        'Large multi-line headline — the first thing visitors read',
        'One short subheading explaining who you are',
        'Single primary button — "View My Work" (one clear action)',
        'Tech tags below — quick skill signals',
        'Portrait on the right — human connection + premium feel'
      ]}
    />
    <CursorPrompt
      prompt={`Recreate this hero section UI for my portfolio landing page.

Visual requirements:
- Soft gradient/grid background (not a busy stock photo)
- Large semibold headline (3 short lines or one powerful line)
- Muted subheading underneath (1–2 sentences max)
- One primary pill button (e.g. "View My Work" or "Hire Me")
- Row of small tech tags (React, Node, Tailwind, etc.)
- Portrait or product image on the right with subtle glow/shadow
- Mobile-first: stack text above image on small screens

Use React + Tailwind. Match the spacing and hierarchy from Royal Prince Hub's home page hero. Do not write backend code — UI only.`}
    />
  </div>
);

export const ProductCardsUIDemo = () => (
  <div className="c5-demo">
    <p className="c5-demo-eyebrow">Live UI · Product / book cards</p>
    <div className="c5-demo-frame">
      <Chapter5SitePreview variant="cards">
        <div className="c5-card-grid">
          {chapter5SampleBooks.map((book) => (
            <BookCard key={book._id} book={book} showAdminActions={false} />
          ))}
        </div>
      </Chapter5SitePreview>
    </div>
    <AnnotatedList
      items={[
        'Cover image fills the top — first thing the eye catches',
        'Genre badge + price overlay on the image',
        'Title and description in the card body',
        'One primary action button per card (Read / View Book)',
        'Responsive grid — 3 columns desktop, 1–2 on mobile'
      ]}
    />
    <CursorPrompt
      prompt={`Recreate this product card grid UI for a digital bookstore.

Visual requirements:
- Responsive grid of cards (3 columns desktop, 1 column mobile)
- Each card: cover image top, genre badge, price (NGN format), title, short description
- Rounded corners, subtle border/shadow, consistent card height
- Primary button: "Read" or "View Book"
- Optional strikethrough for launch offer pricing

Use React + Tailwind. Hard-code 3 sample books for now — no backend yet. Match the card style from Royal Prince Hub /all-books.`}
    />
  </div>
);

const LoginPanelPreview = () => (
  <div className="c5-login-preview">
    <div className="c5-login-panel">
      <span className="c5-login-badge">Sign In</span>
      <h3 className="c5-login-title">Welcome back</h3>
      <p className="c5-login-muted">
        Sign in with Google to access your account across books, blog, and tools.
      </p>
      <div className="c5-login-google-box">
        <p className="c5-login-label">Continue with Google</p>
        <button type="button" className="pf-btn pf-btn-primary c5-login-google-btn">
          <svg className="c5-google-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="#EA4335"
              d="M12 10.2v3.9h5.4c-.2 1.3-1.5 3.9-5.4 3.9-3.2 0-5.9-2.7-5.9-6s2.7-6 5.9-6c1.8 0 3 .8 3.7 1.4l2.5-2.4C16.6 3.5 14.5 2.5 12 2.5 6.8 2.5 2.6 6.7 2.6 12S6.8 21.5 12 21.5c6.9 0 9.1-4.8 9.1-7.3 0-.5-.1-.9-.1-1.3H12Z"
            />
          </svg>
          Continue with Google
        </button>
      </div>
    </div>
    <form className="c5-contact-form" onSubmit={(e) => e.preventDefault()}>
      <p className="c5-form-section-label">Contact form pattern</p>
      <label htmlFor="c5-name">Full name</label>
      <input id="c5-name" type="text" placeholder="Your name" />
      <label htmlFor="c5-email">Email</label>
      <input id="c5-email" type="email" placeholder="you@example.com" />
      <label htmlFor="c5-msg">Message</label>
      <textarea id="c5-msg" rows="3" placeholder="How can I help?" />
      <button type="submit" className="pf-btn pf-btn-primary">
        Send Message
      </button>
    </form>
  </div>
);

export const FormsUIDemo = () => (
  <div className="c5-demo">
    <p className="c5-demo-eyebrow">Live UI · Forms & buttons</p>
    <div className="c5-demo-frame">
      <div className="c5-button-showcase">
        <button type="button" className="pf-btn pf-btn-primary">
          Primary — main action
        </button>
        <button type="button" className="pf-btn pf-btn-secondary">
          Secondary — alternative
        </button>
        <button type="button" className="pf-btn pf-btn-primary pf-btn-sm">
          Small — inside cards
        </button>
      </div>
      <LoginPanelPreview />
    </div>
    <AnnotatedList
      items={[
        'Primary button = filled, dark — the action you want most',
        'Secondary = outline or softer — alternative choice',
        'Every input has a visible label — never mystery fields',
        'Login uses one obvious action: Continue with Google',
        'Forms use the same rounded, glassy style as the rest of the site'
      ]}
    />
    <CursorPrompt
      prompt={`Recreate these form and button UIs for my site.

Part 1 — Buttons:
- Primary pill button (dark fill, white text)
- Secondary outline button
- Small variant for use inside cards

Part 2 — Contact form:
- Labelled fields: name, email, message
- Rounded inputs, clear submit button
- Frontend validation only for now

Part 3 — Login panel (visual only):
- Centered card with "Welcome back" heading
- One "Continue with Google" button with Google icon
- Clean spacing, matches Royal Prince Hub /login style

React + Tailwind. UI only — no OAuth wiring yet.`}
    />
  </div>
);

export const SidebarUIDemo = () => {
  const links = ['Overview', 'Navbar', 'Hero', 'Products', 'Footer'];
  const [active, setActive] = useState('Hero');

  return (
    <div className="c5-demo">
      <p className="c5-demo-eyebrow">Live UI · Sidebar layout</p>
      <div className="c5-demo-frame">
        <div className="c5-sidebar-layout">
          <aside className="c5-sidebar">
            <p className="c5-sidebar-title">App sections</p>
            <nav className="c5-sidebar-nav">
              {links.map((link) => (
                <button
                  key={link}
                  type="button"
                  className={active === link ? 'is-active' : ''}
                  onClick={() => setActive(link)}
                >
                  <NavIcon name="layers" className="c5-sidebar-icon" />
                  {link}
                </button>
              ))}
            </nav>
          </aside>
          <main className="c5-sidebar-main">
            <p className="c5-sidebar-main-label">Main content area</p>
            <h3>{active}</h3>
            <p>
              The sidebar stays fixed while this panel changes — used in dashboards, course
              platforms, admin tools, and this book reader. Landing pages usually skip
              the sidebar and use a top navbar only.
            </p>
          </main>
        </div>
      </div>
      <AnnotatedList
        items={[
          'Vertical nav on the left — secondary navigation',
          'Active item highlighted — same principle as navbar',
          'Main content takes the rest of the width',
          'On mobile: sidebar becomes a drawer or hides behind a menu'
        ]}
      />
      <CursorPrompt
      prompt={`Recreate this sidebar + main content layout UI.

Visual requirements:
- Left sidebar (~240px) with section title and vertical nav links
- Highlight active link with background + bold text
- Main content panel on the right with heading and body text
- On mobile (<768px): sidebar collapses to a toggle drawer
- Clean borders, subtle background difference between sidebar and main

Use React + Tailwind. This is for an app/dashboard — not a marketing landing page. No backend.`}
    />
    </div>
  );
};

export const FooterUIDemo = () => (
  <div className="c5-demo">
    <p className="c5-demo-eyebrow">Live UI · Footer</p>
    <div className="c5-demo-frame c5-demo-frame-footer">
      <Footer />
    </div>
    <AnnotatedList
      items={[
        'Quote or brand line — personality at the bottom',
        'Secondary links — contact, social, legal',
        'Copyright with current year — builds trust',
        'Same footer on every page — build once, reuse everywhere'
      ]}
    />
    <CursorPrompt
      prompt={`Recreate this footer UI for my website.

Visual requirements:
- Centered or column layout with a short quote or tagline
- Row of text links (Contact, Blog, Privacy, Terms)
- Copyright line: © [year] [Your Name]. All rights reserved.
- Muted background, smaller text than body — clearly "end of page"
- Use new Date().getFullYear() for the year in React

React + Tailwind. Reusable Footer component I can import on every page.`}
    />
  </div>
);

export const FullPageUIDemo = () => (
  <div className="c5-demo">
    <p className="c5-demo-eyebrow">Live UI · Full page assembled</p>
    <div className="c5-demo-frame c5-demo-frame-full">
      <PortfolioPreviewShell className="c5-full-page">
        <Chapter5NavbarPreview />
        <div className="c5-full-hero-wrap">
          <HeroSection />
        </div>
        <section className="c5-full-store">
          <p className="c5-full-store-label">Featured Books</p>
          <h3 className="c5-full-store-heading">Store section</h3>
          <div className="c5-card-grid c5-card-grid-compact">
            {chapter5SampleBooks.slice(0, 2).map((book) => (
              <BookCard key={book._id} book={book} showAdminActions={false} />
            ))}
          </div>
        </section>
        <Footer />
      </PortfolioPreviewShell>
    </div>
    <AnnotatedList
      items={[
        'Navbar → Hero → Content/Store → Footer — the landing page blueprint',
        'Each section uses the same spacing and colour language',
        'Project 1: swap text and images, keep this structure',
        'Build one section at a time in Cursor — not the whole page in one prompt'
      ]}
    />
    <CursorPrompt
      prompt={`Help me assemble a full landing page from components I will build step by step.

Page order:
1. Navbar (brand + icon links + theme toggle)
2. Hero (headline, subtext, CTA button, portrait)
3. Featured products/services grid (3 sample cards)
4. Footer (quote, links, copyright)

For now, create the page shell in React + Tailwind that imports placeholder components: Navbar, Hero, ProductGrid, Footer. Use consistent max-width container and vertical spacing (py-16 or py-20 between sections).

Match Royal Prince Hub's visual polish. Mobile-first. Explain the assembly order.`}
    />
  </div>
);

export const chapter5DemoMap = {
  'navbar-ui': NavbarUIDemo,
  'hero-ui': HeroUIDemo,
  'product-cards-ui': ProductCardsUIDemo,
  'forms-ui': FormsUIDemo,
  'sidebar-ui': SidebarUIDemo,
  'footer-ui': FooterUIDemo,
  'full-page-ui': FullPageUIDemo
};
