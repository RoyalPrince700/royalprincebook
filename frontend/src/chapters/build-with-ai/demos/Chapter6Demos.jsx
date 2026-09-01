import React, { useState } from 'react';
import NavIcon from '../../../components/NavIcon';

const DiyPrompt = ({
  step,
  title,
  trackLabel,
  expectedFiles = [],
  verifyBeforeNext = [],
  prompt,
  importantNote
}) => {
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
    <div className="c6-diy-prompt">
      <div className="c6-diy-prompt-top">
        <div>
          {trackLabel && <p className="c6-diy-track-label">{trackLabel}</p>}
          <h4 className="c6-diy-step-title">
            {step && <span className="c6-diy-step-badge">{step}</span>}
            {title}
          </h4>
        </div>
        <button type="button" className="c6-copy-btn" onClick={handleCopy}>
          {copied ? 'Copied!' : 'Copy prompt'}
        </button>
      </div>

      {importantNote && <p className="c6-diy-note">{importantNote}</p>}

      {expectedFiles.length > 0 && (
        <div className="c6-diy-panel">
          <p className="c6-diy-panel-label">After this step, you should see these files</p>
          <ul className="c6-diy-file-list">
            {expectedFiles.map((file) => (
              <li key={file}>
                <code>{file}</code>
              </li>
            ))}
          </ul>
        </div>
      )}

      {verifyBeforeNext.length > 0 && (
        <div className="c6-diy-panel c6-diy-panel-check">
          <p className="c6-diy-panel-label">Verify before the next prompt</p>
          <ul className="c6-diy-check-list">
            {verifyBeforeNext.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="c6-cursor-prompt">
        <div className="c6-cursor-prompt-header">
          <NavIcon name="spark" className="c6-cursor-prompt-icon" />
          <strong>Paste into Cursor</strong>
        </div>
        <pre className="c6-cursor-prompt-text">{prompt.trim()}</pre>
      </div>
    </div>
  );
};

const TrackIntro = ({ eyebrow, title, level, timeEstimate, description, includes }) => (
  <div className="c6-track-intro">
    <p className="c6-track-eyebrow">{eyebrow}</p>
    <h3 className="c6-track-title">{title}</h3>
    <div className="c6-track-meta">
      <span>{level}</span>
      <span>{timeEstimate}</span>
    </div>
    <p className="c6-track-desc">{description}</p>
    {includes?.length > 0 && (
      <ul className="c6-track-includes">
        {includes.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    )}
  </div>
);

/* ─── Track 1: Single landing page ─── */

export const DiyTrack1Intro = () => (
  <TrackIntro
    eyebrow="Track 1 · DIY Project"
    title="Single-page landing site"
    level="Beginner"
    timeEstimate="2–4 hours"
    description="Build one scrollable landing page — navbar, hero, sections, contact, footer. You paste one prompt at a time, run npm run dev, check the files listed, then move on."
    includes={[
      'Google Font setup (display + body pairing)',
      'Custom colour palette and Tailwind theme',
      'Six content sections + footer',
      'Mobile-responsive layout'
    ]}
  />
);

export const DiyStep0Scaffold = () => (
  <DiyPrompt
    step="Step 0"
    trackLabel="Track 1"
    title="Create the project folder"
    importantNote="Do this in an empty folder on your computer — not inside Royal Prince Hub. Name it something like my-landing-page."
    expectedFiles={[
      'my-landing-page/package.json',
      'my-landing-page/vite.config.js',
      'my-landing-page/src/App.jsx',
      'my-landing-page/src/main.jsx'
    ]}
    verifyBeforeNext={[
      'npm run dev starts without errors',
      'Browser shows the default Vite + React page at localhost:5173',
      'You can see src/App.jsx in the file tree'
    ]}
    prompt={`Create a new React project using Vite and JavaScript (not TypeScript).

Requirements:
- Project name: my-landing-page
- Use the React + Vite template
- Install and configure Tailwind CSS v3 (postcss + autoprefixer included)
- Replace the default App.jsx content with a simple placeholder: a centered heading that says "My Landing Page — Step 0 complete"
- Add a clean README.md with: project name, how to run (npm install, npm run dev), and a note that this is a DIY landing page project

Do not add routing, backend, or extra libraries yet. After setup, tell me exactly which files you created or changed.`}
  />
);

export const DiyStep1DesignSystem = () => (
  <DiyPrompt
    step="Step 1"
    trackLabel="Track 1"
    title="Install fonts and define your visual style"
    expectedFiles={[
      'my-landing-page/index.html (Google Fonts link tags)',
      'my-landing-page/tailwind.config.js (fontFamily + colors)',
      'my-landing-page/src/index.css (CSS variables + base styles)'
    ]}
    verifyBeforeNext={[
      'index.html loads two Google Fonts: "Inter" for body text and "Playfair Display" for headings (or similar serif/sans pairing)',
      'tailwind.config.js has custom colors: primary, secondary, accent, and surface',
      'Body text uses Inter; headings use the display font',
      'Background is off-white or soft grey — not harsh pure white everywhere'
    ]}
    prompt={`Set up typography and a cohesive colour system for my-landing-page.

Font requirements:
- Body font: Inter (400, 500, 600 weights) from Google Fonts
- Heading font: Playfair Display (600, 700) from Google Fonts — elegant contrast with Inter
- Add the Google Fonts <link> tags in index.html

Colour palette (define in tailwind.config.js extend.theme):
- primary: deep navy #1e3a5f
- secondary: slate #64748b
- accent: warm gold #c9a227
- surface: soft off-white #f8fafc
- ink: near-black #0f172a

In src/index.css:
- Set html/body to use Inter
- Add CSS variables mirroring the palette
- Style h1–h3 to use Playfair Display with tight letter-spacing
- Set smooth scrolling on html

Update App.jsx to show a small style preview: one H1, one paragraph, one primary button, and three colour swatches labelled with their token names.

Explain every file you changed.`}
  />
);

export const DiyStep2Navbar = () => (
  <DiyPrompt
    step="Step 2"
    trackLabel="Track 1"
    title="Build the navbar"
    expectedFiles={[
      'my-landing-page/src/components/Navbar.jsx',
      'my-landing-page/src/App.jsx (imports Navbar)'
    ]}
    verifyBeforeNext={[
      'Navbar is fixed or sticky at the top with a subtle shadow on scroll',
      'Logo/brand text on the left links to #home',
      '4 anchor links: Home, About, Services, Contact',
      'One primary CTA button on the right (e.g. "Hire Me")',
      'On mobile (<768px) links collapse into a hamburger menu that opens/closes'
    ]}
    prompt={`Create a professional Navbar component for my-landing-page.

File: src/components/Navbar.jsx

Visual requirements:
- Sticky top bar, white/surface background, subtle bottom border
- Left: brand text "Your Name" or initials in primary colour
- Center/right: anchor links — Home (#home), About (#about), Services (#services), Contact (#contact)
- Far right: pill-shaped primary CTA button "Hire Me" linking to #contact
- Active link styling on hover
- Mobile: hamburger icon toggles a vertical menu (use useState)

Use Tailwind only. Use the fonts and colours from Step 1. Import Navbar into App.jsx.

Do not build other sections yet. List files created.`}
  />
);

export const DiyStep3Hero = () => (
  <DiyPrompt
    step="Step 3"
    trackLabel="Track 1"
    title="Build the hero section"
    expectedFiles={[
      'my-landing-page/src/components/Hero.jsx',
      'my-landing-page/src/App.jsx (Hero below Navbar, id="home")'
    ]}
    verifyBeforeNext={[
      'Hero fills most of the first viewport (min-height ~85vh)',
      'Large Playfair Display headline (2–3 lines max)',
      'Muted subtext in Inter (1–2 sentences)',
      'One primary button + one ghost/outline secondary button',
      'Right side: placeholder portrait in a rounded frame OR abstract gradient shape',
      'Stacks vertically on mobile (text above image)'
    ]}
    prompt={`Create a Hero section for my-landing-page.

File: src/components/Hero.jsx

Content (use placeholder text I can edit later):
- Eyebrow: "Available for freelance work"
- Headline: "I design and build digital experiences that convert."
- Subtext: one sentence about who you are and what you offer
- Primary button: "View My Work" → scrolls to #services
- Secondary button: "Download CV" → # (placeholder link)
- Right column: rounded portrait placeholder (use https://placehold.co/400x500/1e3a5f/ffffff?text=Photo) with soft shadow

Design:
- Soft gradient background using primary + surface colours
- Generous padding, max-width container centred
- Mobile-first responsive grid

Wrap section with id="home". Import into App.jsx below Navbar.`}
  />
);

export const DiyStep4Features = () => (
  <DiyPrompt
    step="Step 4"
    trackLabel="Track 1"
    title="Add a services / features section"
    expectedFiles={[
      'my-landing-page/src/components/Services.jsx',
      'my-landing-page/src/App.jsx'
    ]}
    verifyBeforeNext={[
      'Section has id="services"',
      'Section title + short intro paragraph centred above the grid',
      '3 feature cards in a responsive grid (1 col mobile, 3 col desktop)',
      'Each card: icon (SVG inline), title, 2-line description',
      'Cards have hover lift shadow effect'
    ]}
    prompt={`Create a Services section with 3 feature cards.

File: src/components/Services.jsx

Structure:
- Section id="services", off-white background band
- Centred heading: "What I Do" + one sentence intro
- Grid of 3 cards:
  1. Web Design — "Clean, conversion-focused layouts"
  2. Frontend Development — "React, Tailwind, responsive UI"
  3. Brand Strategy — "Visual identity that stands out"

Each card:
- Simple inline SVG icon (24px, accent colour)
- Title in Playfair Display
- Body text in Inter, secondary colour
- White card, rounded-xl, padding, subtle border, hover:shadow-md transition

Import into App.jsx below Hero.`}
  />
);

export const DiyStep5About = () => (
  <DiyPrompt
    step="Step 5"
    trackLabel="Track 1"
    title="Add an about section"
    expectedFiles={[
      'my-landing-page/src/components/About.jsx'
    ]}
    verifyBeforeNext={[
      'Section id="about"',
      'Two-column layout: image left, text right (reverse on mobile)',
      'Short bio paragraph (3–4 sentences placeholder)',
      'Row of 3 stat blocks (e.g. "5+ Years", "40+ Projects", "100% Remote")',
      'Optional: small list of skills as pill tags'
    ]}
    prompt={`Create an About section for my-landing-page.

File: src/components/About.jsx

Layout:
- id="about"
- Two columns on desktop: left = square image placeholder, right = content
- Heading: "About Me"
- Bio paragraph (placeholder lorem-style but professional tone)
- Stats row: 3 mini stat blocks with large number + label
- Skill pills below: React, Tailwind, Figma, Node.js (example tags)

Use Playfair for heading, Inter for body. White background section with container max-width.

Add to App.jsx between Services and the next section.`}
  />
);

export const DiyStep6Testimonials = () => (
  <DiyPrompt
    step="Step 6"
    trackLabel="Track 1"
    title="Add social proof — testimonials or logos"
    expectedFiles={[
      'my-landing-page/src/components/Testimonials.jsx'
    ]}
    verifyBeforeNext={[
      'At least 2 testimonial cards OR a "Trusted by" logo row',
      'Each testimonial shows quote, name, role/company',
      'Subtle quote mark or accent border on cards',
      'Readable on mobile (stacked cards)'
    ]}
    prompt={`Create a Testimonials section.

File: src/components/Testimonials.jsx

Include:
- Section label "Client Stories"
- Heading: "People I've worked with"
- 2 testimonial cards side by side (stack on mobile):
  - Quote text in italics
  - Client name + role (placeholder names)
  - Small avatar circle (initials fallback)

Style: surface background band, cards with white bg and left accent border in accent colour.

Import into App.jsx.`}
  />
);

export const DiyStep7Contact = () => (
  <DiyPrompt
    step="Step 7"
    trackLabel="Track 1"
    title="Add contact section with form"
    expectedFiles={[
      'my-landing-page/src/components/Contact.jsx'
    ]}
    verifyBeforeNext={[
      'Section id="contact"',
      'Form fields: Name, Email, Message (all labelled)',
      'Submit button uses primary style',
      'Form does not need backend yet — onSubmit shows alert("Message sent!") or console.log',
      'Contact email + social links displayed beside or below form'
    ]}
    prompt={`Create a Contact section with a working front-end form (no backend yet).

File: src/components/Contact.jsx

Requirements:
- id="contact"
- Split layout: left = heading + email + LinkedIn/Twitter placeholder links; right = form
- Form fields: name (text), email (email), message (textarea)
- All inputs: rounded-lg, border, focus ring in primary colour
- Submit button: full width on mobile, primary pill style
- onSubmit: preventDefault, alert("Thanks! Backend coming soon."), reset form

Accessible labels on every field. Import into App.jsx above Footer.`}
  />
);

export const DiyStep8Footer = () => (
  <DiyPrompt
    step="Step 8"
    trackLabel="Track 1"
    title="Add the footer"
    expectedFiles={[
      'my-landing-page/src/components/Footer.jsx',
      'my-landing-page/src/App.jsx (final layout order)'
    ]}
    verifyBeforeNext={[
      'App.jsx order: Navbar → Hero → Services → About → Testimonials → Contact → Footer',
      'Footer has dark primary background with light text',
      'Copyright line with current year',
      'Repeat nav links + email',
      'Optional inspirational one-line quote'
    ]}
    prompt={`Create Footer and finalize App.jsx layout.

File: src/components/Footer.jsx

Footer content:
- Dark primary (#1e3a5f) background, light text
- Top: optional quote line in Playfair Display italic
- Middle: quick links mirroring navbar anchors
- Bottom: © {current year} Your Name. All rights reserved.

Update App.jsx to render sections in order:
Navbar, Hero, Services, About, Testimonials, Contact, Footer

Ensure smooth scroll works for anchor links. List final file tree.`}
  />
);

export const DiyStep9Polish = () => (
  <DiyPrompt
    step="Step 9"
    trackLabel="Track 1"
    title="Polish — mobile, spacing, and critique pass"
    expectedFiles={[
      'Updated component files (spacing tweaks)',
      'my-landing-page/README.md (screenshot note + deploy prep)'
    ]}
    verifyBeforeNext={[
      'Resize browser to 375px width — nothing overflows horizontally',
      'All sections have consistent vertical padding (py-16 or py-20)',
      'Headings never touch screen edges — container px-4 minimum',
      'README updated with "Track 1 complete" checklist'
    ]}
    prompt={`Review my entire my-landing-page project and polish it.

Tasks:
1. Fix any horizontal overflow on mobile (375px)
2. Normalize section vertical spacing (py-16 lg:py-24)
3. Ensure all images have alt text
4. Add scroll-margin-top on sections so sticky navbar does not cover headings
5. Add subtle fade-in or nothing if it complicates — prioritize clean spacing
6. Update README.md with: project summary, fonts used, colour tokens, and a checklist of completed sections

Critique the UI like a senior designer. List 5 specific improvements you made and why.`}
  />
);

/* ─── Track 2: Multi-page site ─── */

export const DiyTrack2Intro = () => (
  <TrackIntro
    eyebrow="Track 2 · DIY Project"
    title="Multi-page marketing site"
    level="Intermediate"
    timeEstimate="3–5 hours"
    description="Turn a landing page into a real site with separate URLs — Home, About Us, Services, Contact Us — using React Router and a shared layout."
    includes={[
      'React Router v6 setup',
      'Shared Navbar + Footer layout',
      'Dedicated About, Services, and Contact pages',
      '404 page and active nav highlighting'
    ]}
  />
);

export const DiyMultiStep1Router = () => (
  <DiyPrompt
    step="Step 1"
    trackLabel="Track 2"
    title="Add React Router and a shared layout"
    importantNote="Start from your completed Track 1 project, or create a fresh Vite + React + Tailwind app named my-multi-page-site."
    expectedFiles={[
      'my-multi-page-site/src/main.jsx (BrowserRouter)',
      'my-multi-page-site/src/App.jsx (Routes)',
      'my-multi-page-site/src/layouts/MainLayout.jsx',
      'my-multi-page-site/src/components/Navbar.jsx (updated for Link)'
    ]}
    verifyBeforeNext={[
      'npm install react-router-dom completed',
      '/ shows Home, /about shows About, /services shows Services, /contact shows Contact',
      'Navbar and Footer appear on every page via MainLayout',
      'Nav links use <Link to="..."> not hash anchors'
    ]}
    prompt={`Convert my landing page project into a multi-page React site with React Router v6.

Project folder: my-multi-page-site (or refactor my-landing-page if I say so)

Tasks:
1. npm install react-router-dom
2. Wrap app in BrowserRouter in main.jsx
3. Create src/layouts/MainLayout.jsx — renders Navbar, <Outlet />, Footer
4. Create placeholder pages: src/pages/Home.jsx, About.jsx, Services.jsx, Contact.jsx (each returns an H1 with page name for now)
5. App.jsx routes:
   - / → Home
   - /about → About
   - /services → Services
   - /contact → Contact
   - * → NotFound.jsx (simple 404)

Update Navbar links to use React Router <Link>. Highlight active route with useLocation().

List all new files.`}
  />
);

export const DiyMultiStep2Home = () => (
  <DiyPrompt
    step="Step 2"
    trackLabel="Track 2"
    title="Build the Home page (landing sections)"
    expectedFiles={[
      'my-multi-page-site/src/pages/Home.jsx',
      'my-multi-page-site/src/components/Hero.jsx',
      'my-multi-page-site/src/components/ServicesPreview.jsx',
      'my-multi-page-site/src/components/CtaBand.jsx'
    ]}
    verifyBeforeNext={[
      'Home page has Hero + short services preview (3 cards) + CTA band linking to /contact',
      'No full About or Contact form on Home — tease and link out',
      '"Learn more" on services preview goes to /services'
    ]}
    prompt={`Build the Home page for my-multi-page-site.

Home.jsx should compose:
1. Hero — same quality as Track 1 but CTA buttons link to /services and /contact
2. ServicesPreview — 3 cards with "View all services →" linking to /services
3. CtaBand — full-width primary colour band: headline + button to /contact

Reuse fonts/colours from Track 1 design system. Keep Home.jsx thin — import section components.

Do not duplicate full About or Contact content on Home.`}
  />
);

export const DiyMultiStep3About = () => (
  <DiyPrompt
    step="Step 3"
    trackLabel="Track 2"
    title="Build the About Us page"
    expectedFiles={[
      'my-multi-page-site/src/pages/About.jsx',
      'my-multi-page-site/src/components/PageHero.jsx (reusable)'
    ]}
    verifyBeforeNext={[
      'About page has a smaller PageHero (title + breadcrumb-style subtitle)',
      'Mission statement paragraph',
      'Team or timeline section (2–3 items)',
      'Values list with icons'
    ]}
    prompt={`Create a full About Us page.

Files:
- src/components/PageHero.jsx — reusable top banner: title, optional subtitle, surface background
- src/pages/About.jsx

About page sections:
1. PageHero — "About Us" + "Our story"
2. Story section — two columns, image + 2 paragraphs about the company/person
3. Values — 4 items in grid (Integrity, Quality, Speed, Support) with SVG icons
4. Optional timeline — 3 milestones (Founded, First client, Today)

Professional spacing. Mobile stacked. Wire About route in App.jsx if not already.`}
  />
);

export const DiyMultiStep4Services = () => (
  <DiyPrompt
    step="Step 4"
    trackLabel="Track 2"
    title="Build the Services page"
    expectedFiles={[
      'my-multi-page-site/src/pages/Services.jsx',
      'my-multi-page-site/src/data/services.js'
    ]}
    verifyBeforeNext={[
      'services.js exports an array of 4–6 services (title, description, icon name)',
      'Services page maps over data — no hard-coded duplicate cards',
      'Each service has "Get a quote" link to /contact',
      'PageHero at top'
    ]}
    prompt={`Create a Services page driven by a data file.

Files:
- src/data/services.js — export array of 6 services: { id, title, description, icon }
- src/pages/Services.jsx

Page structure:
1. PageHero — "Services" + one-line intro
2. Grid of service detail cards (2 columns desktop)
3. Bottom CTA: "Not sure what you need?" + button to /contact

Use .map() over services data. Icons can be simple inline SVGs per service.

Explain how to add a new service by editing only services.js.`}
  />
);

export const DiyMultiStep5Contact = () => (
  <DiyPrompt
    step="Step 5"
    trackLabel="Track 2"
    title="Build the Contact Us page"
    expectedFiles={[
      'my-multi-page-site/src/pages/Contact.jsx',
      'my-multi-page-site/src/components/ContactForm.jsx'
    ]}
    verifyBeforeNext={[
      'Contact page: PageHero + form + office info card (address, email, hours — placeholder)',
      'ContactForm is reusable component',
      'Form validation: required fields, basic email format check before submit',
      'Success message shown inline (not alert) after submit'
    ]}
    prompt={`Create a dedicated Contact Us page.

Files:
- src/components/ContactForm.jsx — name, email, subject, message; client-side validation; inline success state
- src/pages/Contact.jsx

Layout:
- PageHero "Contact Us"
- Two columns: left = ContactForm, right = info card (email, phone placeholder, office hours, map placeholder box)
- FAQ accordion below (3 questions) — optional but adds polish

Validation: show red border + error text under empty required fields. On success, show green banner "We will reply within 24 hours."

No backend yet.`}
  />
);

export const DiyMultiStep6Polish = () => (
  <DiyPrompt
    step="Step 6"
    trackLabel="Track 2"
    title="Active nav, 404, and README"
    expectedFiles={[
      'my-multi-page-site/src/pages/NotFound.jsx (polished)',
      'my-multi-page-site/README.md',
      'Navbar.jsx (active link styles)'
    ]}
    verifyBeforeNext={[
      'Visiting /random-page shows styled 404 with link home',
      'Active nav link has visible active state on every route',
      'README documents all routes and how to run the project'
    ]}
    prompt={`Polish my-multi-page-site routing and documentation.

Tasks:
1. Style NotFound.jsx — friendly message, button back to /
2. Navbar — clear active link style (underline or background pill) using NavLink or useLocation
3. Add page titles in each page component (document.title or simple useEffect)
4. README.md: list routes table, tech stack, folder structure, and "Track 2 complete" checklist

Run a final mobile pass on all 4 pages. List issues fixed.`}
  />
);

/* ─── Track 3: E-commerce (staged) ─── */

export const DiyTrack3Intro = () => (
  <TrackIntro
    eyebrow="Track 3 · DIY Project"
    title="E-commerce store (full-stack)"
    level="Advanced"
    timeEstimate="2–4 weeks (one phase at a time)"
    description="Build a digital store like Royal Prince Hub — product grid, cart, auth, payments. This track is intentionally split into phases. Finish Phase 1 completely before opening Phase 2."
    includes={[
      'React storefront + product pages',
      'Express + MongoDB backend',
      'Google OAuth + JWT',
      'Flutterwave checkout (test mode)',
      'Basic admin product management'
    ]}
  />
);

export const DiyEcomPhase1Scaffold = () => (
  <DiyPrompt
    step="Phase 1A"
    trackLabel="Track 3 · Phase 1 — Storefront UI"
    title="Create the storefront project"
    expectedFiles={[
      'my-store/package.json',
      'my-store/src/App.jsx',
      'my-store/tailwind.config.js',
      'my-store/src/data/products.js (mock data)'
    ]}
    verifyBeforeNext={[
      'Vite + React + Tailwind running',
      'products.js has at least 6 mock products with: id, title, price, image, category, description',
      'App.jsx renders a heading "My Store — Phase 1"'
    ]}
    prompt={`Create a new e-commerce frontend project: my-store

Stack: Vite + React + JavaScript + Tailwind CSS

Setup:
1. Scaffold project my-store
2. Configure Tailwind with a store-friendly palette (primary navy, accent gold, clean whites)
3. Create src/data/products.js with 6 mock digital products (books or templates):
   { id, title, slug, price, currency: "NGN", image, category, description, featured }

4. App.jsx placeholder confirming setup

Use placeholder images from placehold.co. No backend, no router yet.

Output the mock product array structure so I can verify.`}
  />
);

export const DiyEcomPhase1Products = () => (
  <DiyPrompt
    step="Phase 1B"
    trackLabel="Track 3 · Phase 1 — Storefront UI"
    title="Product grid and product card component"
    expectedFiles={[
      'my-store/src/components/ProductCard.jsx',
      'my-store/src/components/ProductGrid.jsx',
      'my-store/src/pages/Shop.jsx'
    ]}
    verifyBeforeNext={[
      'Shop page shows responsive grid of all mock products',
      'Each card: image, category badge, price formatted as ₦X,XXX, title, short description',
      'Featured products could have a small "Featured" badge',
      'Hover state on cards'
    ]}
    prompt={`Build product listing UI for my-store using mock data from src/data/products.js.

Files:
- src/components/ProductCard.jsx — reusable card
- src/components/ProductGrid.jsx — responsive grid wrapper
- src/pages/Shop.jsx — page title "Shop" + ProductGrid mapping products.js

ProductCard shows:
- Image top (aspect ratio 3/4)
- Category pill overlay on image
- Price in Naira (₦) formatted with commas
- Title (max 2 lines truncate)
- "View product" button (no link yet)

Install react-router-dom and set route /shop → Shop.jsx. Navbar with Shop link.

Match Royal Prince Hub book card quality — clean, trustworthy.`}
  />
);

export const DiyEcomPhase1Detail = () => (
  <DiyPrompt
    step="Phase 1C"
    trackLabel="Track 3 · Phase 1 — Storefront UI"
    title="Product detail page"
    expectedFiles={[
      'my-store/src/pages/ProductDetail.jsx',
      'my-store/src/App.jsx (route /shop/:slug)'
    ]}
    verifyBeforeNext={[
      'Clicking a product opens /shop/{slug}',
      'Detail page: large image, full description, price, quantity selector, "Add to cart" button',
      'Invalid slug shows "Product not found" message',
      'Breadcrumb: Shop / Category / Product title'
    ]}
    prompt={`Add product detail pages to my-store.

File: src/pages/ProductDetail.jsx
Route: /shop/:slug

Logic:
- Find product in products.js by slug param
- If not found, show friendly empty state with link back to /shop

UI:
- Two columns desktop: image left, details right
- Show full description, price, category
- Quantity input (min 1, max 10)
- Primary button "Add to cart" — for now console.log({ product, quantity })
- Secondary link "← Back to shop"

Update ProductCard button to Link to /shop/{slug}.

List routes after this step.`}
  />
);

export const DiyEcomPhase2Cart = () => (
  <DiyPrompt
    step="Phase 2"
    trackLabel="Track 3 · Phase 2 — Cart"
    title="Shopping cart state and cart page"
    expectedFiles={[
      'my-store/src/context/CartContext.jsx',
      'my-store/src/pages/Cart.jsx',
      'my-store/src/components/Navbar.jsx (cart badge count)'
    ]}
    verifyBeforeNext={[
      'CartContext provides: items, addToCart, removeFromCart, updateQuantity, totalPrice, itemCount',
      'Add to cart on ProductDetail actually adds item',
      'Navbar shows cart icon with badge count',
      '/cart page lists items, subtotal, "Checkout" button (disabled with tooltip "Phase 4")',
      'Empty cart state with link to /shop'
    ]}
    prompt={`Implement shopping cart for my-store (frontend only).

Files:
- src/context/CartContext.jsx — React context + provider, persist to localStorage
- src/pages/Cart.jsx — line items, quantity controls, remove, subtotal
- Update main.jsx to wrap app in CartProvider
- Update Navbar: cart icon + badge showing itemCount
- Wire ProductDetail "Add to cart" to context.addToCart(product, quantity)

Cart page:
- Table/cards of items: image, title, unit price, quantity stepper, line total, remove
- Subtotal at bottom
- "Proceed to checkout" button — disabled, title="Available after Phase 4"

Test by adding 2 different products and refreshing — cart should persist.`}
  />
);

export const DiyEcomPhase3Backend = () => (
  <DiyPrompt
    step="Phase 3"
    trackLabel="Track 3 · Phase 3 — Backend"
    title="Express API + MongoDB products"
    importantNote="Create a sibling folder my-store-api next to my-store. Set up MongoDB Atlas first — see Chapter 6 Phase 3 steps above. Never commit .env files."
    expectedFiles={[
      'my-store-api/package.json',
      'my-store-api/server.js',
      'my-store-api/models/Product.js',
      'my-store-api/routes/products.js',
      'my-store-api/.env.example'
    ]}
    verifyBeforeNext={[
      'Server runs on port 5000',
      'GET /api/products returns JSON array',
      'GET /api/products/:slug returns one product or 404',
      'MongoDB connected (local or Atlas)',
      '.env.example lists MONGODB_URI and PORT — no real secrets'
    ]}
    prompt={`Create Express + MongoDB backend for my-store.

Folder: my-store-api (sibling to my-store frontend)

Stack: Node, Express, Mongoose, cors, dotenv

Structure:
- server.js — entry, cors, json middleware, mount routes
- models/Product.js — fields match frontend mock: title, slug, price, currency, image, category, description, featured
- routes/products.js — GET / (all), GET /:slug (one)
- scripts/seed.js — seed 6 products from the same mock data

.env.example:
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mystore

Add npm scripts: dev (nodemon), seed

Test with curl or browser. Document API endpoints in README.md.`}
  />
);

export const DiyEcomPhase4Connect = () => (
  <DiyPrompt
    step="Phase 4"
    trackLabel="Track 3 · Phase 4 — Connect frontend"
    title="Replace mock data with live API"
    expectedFiles={[
      'my-store/src/services/api.js',
      'my-store/src/pages/Shop.jsx (fetch products)',
      'my-store/src/pages/ProductDetail.jsx (fetch by slug)',
      'my-store/.env.example (VITE_API_BASE_URL)'
    ]}
    verifyBeforeNext={[
      'Shop page loads products from http://localhost:5000/api/products',
      'Loading and error states shown while fetching',
      'Product detail fetches by slug from API',
      'VITE_API_BASE_URL in .env.local — not committed'
    ]}
    prompt={`Connect my-store frontend to my-store-api.

Tasks:
1. Create src/services/api.js — axios instance with baseURL from import.meta.env.VITE_API_BASE_URL (default http://localhost:5000/api)
2. Shop.jsx — useEffect fetch products, show loading spinner, error message on failure
3. ProductDetail.jsx — fetch /api/products/:slug
4. Remove dependency on src/data/products.js for listing (keep as fallback comment only)
5. Add .env.example: VITE_API_BASE_URL=http://localhost:5000/api

Add proxy or CORS is already on backend. Handle empty shop state.

Verify both servers running. List env vars I need.`}
  />
);

export const DiyEcomPhase5Auth = () => (
  <DiyPrompt
    step="Phase 5"
    trackLabel="Track 3 · Phase 5 — Auth"
    title="Google OAuth + JWT (like Royal Prince Hub)"
    importantNote="Complete Chapter 8 Google OAuth Setup Step by Step BEFORE this prompt. Add your Gmail as a test user on the OAuth consent screen."
    expectedFiles={[
      'my-store-api/models/User.js',
      'my-store-api/routes/auth.js',
      'my-store-api/middleware/auth.js',
      'my-store/src/context/AuthContext.jsx',
      'my-store/src/pages/Login.jsx'
    ]}
    verifyBeforeNext={[
      'Backend: POST /api/auth/google accepts idToken, returns JWT',
      'Protected route GET /api/auth/me returns user when Bearer token sent',
      'Frontend: Login page with "Continue with Google" button',
      'After login, Navbar shows user name + Logout',
      'JWT stored in localStorage or httpOnly cookie pattern — document choice'
    ]}
    prompt={`Add Google OAuth + JWT auth to my-store (follow Royal Prince Hub pattern).

Backend (my-store-api):
- User model: googleId, email, name, avatar, role (user/admin)
- POST /api/auth/google — verify Google idToken, upsert user, return JWT
- GET /api/auth/me — protected, returns user
- middleware/auth.js — verify JWT

Frontend (my-store):
- AuthContext: user, login, logout, loading
- Login.jsx — Google sign-in button (use @react-oauth/google or explain setup)
- PrivateRoute component for future checkout

.env.example additions:
GOOGLE_CLIENT_ID=
JWT_SECRET=

Security: never expose JWT_SECRET to frontend. Document Google Cloud Console steps briefly in README.`}
  />
);

export const DiyEcomPhase6Payments = () => (
  <DiyPrompt
    step="Phase 6"
    trackLabel="Track 3 · Phase 6 — Payments"
    title="Flutterwave checkout (test mode)"
    expectedFiles={[
      'my-store-api/routes/orders.js',
      'my-store-api/models/Order.js',
      'my-store/src/pages/Checkout.jsx',
      'my-store-api/utils/verifyFlutterwave.js'
    ]}
    verifyBeforeNext={[
      'Checkout page requires login',
      'Order created in DB with status pending before payment',
      'Flutterwave test payment opens on "Pay now"',
      'Webhook or verify endpoint confirms payment server-side',
      'Cart clears after successful payment',
      'Success page shows order reference'
    ]}
    prompt={`Implement Flutterwave checkout for my-store (TEST MODE ONLY).

Backend:
- Order model: user, items[], total, status (pending/paid/failed), flutterwaveReference
- POST /api/orders — create order from cart (auth required)
- POST /api/payments/flutterwave/verify — verify transaction server-side with secret key
- Never trust frontend payment success alone

Frontend:
- Checkout.jsx — order summary, Pay button
- Use flutterwave-react-v3 with public key from env
- On success callback, call verify endpoint, then redirect to /order-success/:id
- Clear cart after confirmed payment

.env.example:
FLW_PUBLIC_KEY=
FLW_SECRET_KEY=

Document test cards. Warn: verify amounts on server.`}
  />
);

export const DiyEcomPhase7Admin = () => (
  <DiyPrompt
    step="Phase 7"
    trackLabel="Track 3 · Phase 7 — Admin"
    title="Basic admin — add and edit products"
    expectedFiles={[
      'my-store/src/pages/admin/AdminProducts.jsx',
      'my-store-api/routes/admin/products.js',
      'my-store-api/middleware/admin.js'
    ]}
    verifyBeforeNext={[
      'Only users with role admin can access /admin/products',
      'Admin can create a new product via form',
      'Admin can edit price and description inline or modal',
      'New product appears on /shop after save',
      'Non-admin users redirected from admin routes'
    ]}
    prompt={`Add minimal admin panel for product management.

Backend:
- middleware/admin.js — require user.role === 'admin'
- POST /api/admin/products — create
- PUT /api/admin/products/:id — update
- DELETE /api/admin/products/:id — soft or hard delete

Frontend:
- /admin/products — table of products, Add Product button
- Simple form modal: title, slug, price, image URL, category, description, featured checkbox
- Protect with PrivateRoute + admin check

Seed one admin user in seed script (document how to promote user to admin in MongoDB).

This completes Track 3 core MVP. Update README with full architecture diagram in markdown.`}
  />
);

export const chapter6DemoMap = {
  'diy-track1-intro': DiyTrack1Intro,
  'diy-step0-scaffold': DiyStep0Scaffold,
  'diy-step1-design-system': DiyStep1DesignSystem,
  'diy-step2-navbar': DiyStep2Navbar,
  'diy-step3-hero': DiyStep3Hero,
  'diy-step4-features': DiyStep4Features,
  'diy-step5-about': DiyStep5About,
  'diy-step6-testimonials': DiyStep6Testimonials,
  'diy-step7-contact': DiyStep7Contact,
  'diy-step8-footer': DiyStep8Footer,
  'diy-step9-polish': DiyStep9Polish,
  'diy-track2-intro': DiyTrack2Intro,
  'diy-multi-step1-router': DiyMultiStep1Router,
  'diy-multi-step2-home': DiyMultiStep2Home,
  'diy-multi-step3-about': DiyMultiStep3About,
  'diy-multi-step4-services': DiyMultiStep4Services,
  'diy-multi-step5-contact': DiyMultiStep5Contact,
  'diy-multi-step6-polish': DiyMultiStep6Polish,
  'diy-track3-intro': DiyTrack3Intro,
  'diy-ecom-phase1-scaffold': DiyEcomPhase1Scaffold,
  'diy-ecom-phase1-products': DiyEcomPhase1Products,
  'diy-ecom-phase1-detail': DiyEcomPhase1Detail,
  'diy-ecom-phase2-cart': DiyEcomPhase2Cart,
  'diy-ecom-phase3-backend': DiyEcomPhase3Backend,
  'diy-ecom-phase4-connect': DiyEcomPhase4Connect,
  'diy-ecom-phase5-auth': DiyEcomPhase5Auth,
  'diy-ecom-phase6-payments': DiyEcomPhase6Payments,
  'diy-ecom-phase7-admin': DiyEcomPhase7Admin
};
