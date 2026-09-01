# Chapter 6: DIY — Do It Yourself (Copy, Paste, Build)

> "You learn to swim by getting in the water — not by watching someone else swim forever." — Royal Prince

Chapters 1–5 gave you concepts, tools, AI skills, visual elements, and section anatomy. **This chapter is different.** Nobody builds the project for you here. You open Cursor, copy a prompt, paste it, wait for the agent to finish, **check your files**, run `npm run dev`, and only then move to the next prompt.

That is the whole method. One step. Verify. Next step.

Royal Prince Hub exists because I built it this way — piece by piece, with AI as my co-pilot, not my replacement. Your turn.

---

## How This Chapter Works

### The DIY rules

1. **One prompt at a time** — never paste Step 3 while Step 2 is still broken
2. **Read the file checklist** under every prompt — that tells you exactly what should exist when the agent finishes
3. **Run the verify list** before you copy the next prompt — open the files, check the browser, fix errors first
4. **Use Agent mode in Cursor** — let it create and edit files; you review the diff
5. **Keep a build log** — note the date you finish each step in your README or a `BUILD_LOG.md`
6. **When stuck** — paste the error into Cursor using the Debug pattern from Chapter 3; do not skip ahead

### What you need before starting

| Requirement | Why |
|-------------|-----|
| **Cursor installed** | Your AI co-pilot lives here |
| **Node.js 18+** | Runs Vite and npm |
| **A empty parent folder** | e.g. `Documents/my-projects/` — not inside this book repo |
| **30–60 minutes per session** | Focus beats marathon coding |
| **Chapter 3 fresh in mind** | Prompt quality still matters — these prompts are pre-written for you |

### Chapter 5 vs Chapter 6 — which prompts to use?

| Chapter | Purpose |
|---------|---------|
| **Chapter 5** | Study **what good UI looks like** — navbar, hero, cards. Prompts recreate **one section** for practice. |
| **Chapter 6** | **Build a complete project** — step-by-step from empty folder to finished site. |

**Start here in Chapter 6.** Use Chapter 5 previews as a visual reference while you build, not as a separate project.

### Before Step 0 — create your workspace (do this manually)

These steps are **not** a Cursor prompt — you do them yourself once:

1. Open **File Explorer** (Windows) or **Finder** (Mac)
2. Go to `Documents` (or Desktop)
3. Create folder: `my-projects`
4. Inside it, create folder: `my-landing-page` (leave it **empty**)
5. Open **Cursor** → **File → Open Folder** → select `my-landing-page`
6. Confirm the left sidebar shows the folder name and is empty (or nearly empty)

**Wrong:** Opening the Royal Prince Hub book repo and building inside it.  
**Right:** Your own empty folder on your computer.

### How to run commands after each step

When a step says "run `npm run dev`":

1. In Cursor: **Terminal → New Terminal** (panel opens at the bottom)
2. Check you are in the right folder — the path should end with `my-landing-page`
3. If not, type: `cd path/to/my-landing-page` (use your actual path)
4. Type: `npm install` (first time only, or when packages change)
5. Type: `npm run dev`
6. **Leave this terminal open** — closing it stops the site
7. Click the `http://localhost:5173` link in the terminal, or paste it in your browser

**First time `npm install` runs:** It may take 1–3 minutes. That is normal.

### Track 3 — read Chapter 10 before Phase 3

Track 3 Phase 3 creates your Express backend. If words like "model," "route," and "controller" feel foreign, **read Chapter 10 first** (30 minutes). You can read Chapters 8 and 10 while finishing Track 2 — do not wait until you are stuck.

### Three tracks — pick your path

| Track | What you build | Difficulty | When to start |
|-------|----------------|------------|---------------|
| **Track 1** | Single scrollable landing page | Beginner | Start here if this is your first build |
| **Track 2** | Multi-page site (Home, About, Services, Contact) | Intermediate | After Track 1, or if you already built a landing page |
| **Track 3** | Full e-commerce store (frontend + backend + payments) | Advanced | After Track 2 — this is Project 2 from the book outline |

You do not have to finish all three this week. Finish Track 1 completely. Deploy it (Chapter 9). Then come back for Track 2.

---

## Track 1: Single Landing Page

Build one professional marketing page — fonts, colours, navbar, hero, services, about, testimonials, contact form, footer. Every section is a separate prompt so you always know what "done" looks like.

[[DEMO:diy-track1-intro]]

### Before Step 0 — create your workspace

Open File Explorer (Windows) or Finder (Mac). Create:

```
my-projects/
  my-landing-page/    ← Track 1 lives here
```

Open **that folder** in Cursor: *File → Open Folder → my-landing-page* (empty for now — Step 0 creates the files).

---

### Step 0 — Project scaffold

[[DEMO:diy-step0-scaffold]]

**Stop here.** Open `package.json`. Run `npm install` then `npm run dev` in the terminal. Do not continue until localhost works.

---

### Step 1 — Fonts and visual style

This step installs **Google Fonts**, sets your **colour tokens** in Tailwind, and gives every later section a consistent look. Inter + Playfair Display is the pairing used in the prompts — you can swap fonts later using the same pattern from Chapter 4.

[[DEMO:diy-step1-design-system]]

**Check:** Open `index.html` — you should see Google Fonts link tags. Open `tailwind.config.js` — custom colours listed. Refresh the browser — the style preview should show your fonts and swatches.

---

### Step 2 — Navbar

[[DEMO:diy-step2-navbar]]

**Check:** `src/components/Navbar.jsx` exists. Navbar visible at top. Resize to phone width — hamburger menu works.

---

### Step 3 — Hero

[[DEMO:diy-step3-hero]]

**Check:** Hero fills the screen. Two buttons visible. Image or placeholder on the right (desktop).

---

### Step 4 — Services section

[[DEMO:diy-step4-features]]

**Check:** Three cards in a row on desktop. Section id is `services` for anchor links.

---

### Step 5 — About section

[[DEMO:diy-step5-about]]

**Check:** Bio text, stats row, skill pills. Section id `about`.

---

### Step 6 — Testimonials

[[DEMO:diy-step6-testimonials]]

**Check:** At least two quote cards. Readable on mobile.

---

### Step 7 — Contact form

[[DEMO:diy-step7-contact]]

**Check:** Form submits with a front-end success message. Section id `contact`. Navbar "Contact" link scrolls here.

---

### Step 8 — Footer

[[DEMO:diy-step8-footer]]

**Check:** Full page order in `App.jsx`: Navbar → Hero → Services → About → Testimonials → Contact → Footer. Dark footer at bottom.

---

### Step 9 — Polish pass

[[DEMO:diy-step9-polish]]

**Track 1 complete when:** Mobile looks clean at 375px width, README updated, and you can show the site to someone without apologizing for layout bugs.

---

## Track 2: Multi-Page Marketing Site

Track 2 turns your landing page into a **real website with URLs** — `/about`, `/services`, `/contact` — using React Router and a shared layout. Start from your finished Track 1 project or a fresh folder.

[[DEMO:diy-track2-intro]]

### Folder setup

Either rename/refactor `my-landing-page` or create:

```
my-projects/
  my-multi-page-site/
```

Open that folder in Cursor before Step 1.

---

### Step 1 — Router + layout

[[DEMO:diy-multi-step1-router]]

**Check:** Visiting `/about` in the browser shows a page — not a blank screen. Navbar links change the URL without full page reload.

---

### Step 2 — Home page

[[DEMO:diy-multi-step2-home]]

**Check:** `/` shows hero + preview sections. Buttons link to `/services` and `/contact`.

---

### Step 3 — About Us page

[[DEMO:diy-multi-step3-about]]

**Check:** `/about` has mission, values, and story content — not just a placeholder H1.

---

### Step 4 — Services page

[[DEMO:diy-multi-step4-services]]

**Check:** `src/data/services.js` exists. Adding a 7th service in that file automatically shows on the page after refresh.

---

### Step 5 — Contact Us page

[[DEMO:diy-multi-step5-contact]]

**Check:** Form validation works — empty submit shows errors. Success message appears inline.

---

### Step 6 — Routing polish + 404

[[DEMO:diy-multi-step6-polish]]

**Track 2 complete when:** All four routes work, 404 page exists, README documents the route table.

---

## Track 3: E-Commerce Store (Staged Build)

This is the **hard track** — the same class of project as Royal Prince Hub's bookstore. It is split into **phases** on purpose. Each phase ends with a working subset you can demo. **Do not open Phase 3 prompts until Phase 2 cart works.**

You will maintain **two folders**:

```
my-projects/
  my-store/          ← React frontend
  my-store-api/      ← Express + MongoDB backend (starts in Phase 3)
```

[[DEMO:diy-track3-intro]]

---

### Phase 1 — Storefront UI (mock data)

Three prompts. No backend yet.

#### Phase 1A — Scaffold + mock products

[[DEMO:diy-ecom-phase1-scaffold]]

**Check:** `src/data/products.js` has 6 products with prices in Naira.

#### Phase 1B — Product grid

[[DEMO:diy-ecom-phase1-products]]

**Check:** `/shop` shows a grid of cards. Prices show ₦ symbol.

#### Phase 1C — Product detail page

[[DEMO:diy-ecom-phase1-detail]]

**Check:** Click a product → URL changes to `/shop/product-slug`. Detail page shows full description.

**Phase 1 complete when:** You can browse mock products like a real store — still no cart, no server.

---

### Phase 2 — Shopping cart

[[DEMO:diy-ecom-phase2-cart]]

**Check:** Add two products. Refresh browser — cart still has items (localStorage). Navbar badge shows count.

**Phase 2 complete when:** Cart page calculates subtotal correctly.

---

### Phase 3 — Backend API

Create `my-store-api` as a **sibling folder** next to `my-store`. Open both in Cursor (multi-root workspace) or open the API folder separately.

> **Read Chapter 10 (Backend Anatomy) before Phase 3** if backend files feel mysterious.

#### Before Phase 3 — set up MongoDB Atlas (15 minutes)

Your backend needs a database **before** the Phase 3 prompt. Do this manually once:

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) → **Sign up free**
2. Create an **organization** (default name is fine)
3. Create a **project** — name it `my-store`
4. **Build a Database** → choose **M FREE** (free tier)
5. Pick a **region** close to you → **Create**
6. **Database Access** → **Add New Database User**
   - Username: `mystoreuser` (or any name)
   - Password: generate a strong password → **save it somewhere safe**
   - Privileges: **Read and write to any database**
7. **Network Access** → **Add IP Address** → **Allow Access from Anywhere** (`0.0.0.0/0`)
   - Fine for learning; tighten later for production
8. **Database** → **Connect** → **Drivers** → copy the connection string
9. Replace `<password>` with your real password (URL-encode special characters: `@` → `%40`)
10. Add database name before the `?`:

```
mongodb+srv://mystoreuser:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/mystore?retryWrites=true&w=majority
```

11. Create `my-store-api/.env` (after Cursor creates the folder in Phase 3):

```
PORT=5000
MONGODB_URI=mongodb+srv://mystoreuser:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/mystore?retryWrites=true&w=majority
```

12. **Never commit `.env` to GitHub.**

**Verify Atlas works:** After Phase 3 prompt completes, backend terminal should say `MongoDB connected`. If not, see Chapter 11 — `MongooseServerSelectionError`.

[[DEMO:diy-ecom-phase3-backend]]

**Check:** `curl http://localhost:5000/api/products` returns JSON. Seed script populated MongoDB.

**Phase 3 complete when:** API runs independently of the React app.

---

### Phase 4 — Connect frontend to API

[[DEMO:diy-ecom-phase4-connect]]

**Check:** Shop page loads products from the server — stop the API and the shop should show an error state, not crash silently.

---

### Phase 5 — Authentication

> **Before Phase 5:** Complete **Google OAuth Setup — Step by Step** in **Chapter 8**. You need `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, and test users configured in Google Cloud Console before pasting this prompt.

[[DEMO:diy-ecom-phase5-auth]]

**Check:** Login with Google works in test mode. `/api/auth/me` returns your user when logged in.

---

### Phase 6 — Flutterwave payments (test mode)

> **Before Phase 6:** Create a Flutterwave account, enable **Test mode**, and copy your public + secret keys into `.env` files. See **Chapter 9 Part 3 — Flutterwave**. Never put the secret key in frontend code.

[[DEMO:diy-ecom-phase6-payments]]

**Check:** Test payment completes. Order saved in MongoDB with status `paid`. Cart clears.

> **Security reminder:** Payment verification must happen on the **server** with your secret key — never trust the browser alone. Same pattern as Royal Prince Hub.

---

### Phase 7 — Admin product management

[[DEMO:diy-ecom-phase7-admin]]

**Track 3 MVP complete when:** You can log in as admin, add a product, see it on `/shop`, add to cart, checkout in test mode, and view the order in the database.

---

## Track 4: Run Locally, Push to GitHub & Go Live

You built the project on your machine. Now the world needs to see it. **Track 4 is not copy-paste prompts** — it is a hands-on operations guide in **Chapter 9**. Read that chapter end-to-end after you finish at least Track 1.

### What Track 4 covers

| Topic | Why it matters |
|-------|----------------|
| `cd`, `cd frontend`, `cd backend`, `cd ..` | You must know which folder your terminal is in |
| `npm install` and `npm run dev` | Two terminals for frontend + backend |
| MongoDB Atlas connection string | Where users, products, and orders live |
| Cloudinary | Image URLs for product photos — not files in MongoDB |
| Flutterwave test keys | Payments verified on the server, not the browser |
| GitHub account + new repo | Code storage Vercel and Render connect to |
| `git add`, `git commit`, `git push` | How updates reach the internet |
| `.gitignore` | **Never push `node_modules/` or `.env`** |
| Vercel + GitHub link | Auto-deploy frontend on every push |
| Render | Keep Express API online 24/7 |

### How services connect (e-commerce)

```
Browser → Vercel (React UI) → Render (Express API) → MongoDB Atlas
                              ↘ Cloudinary (images)
                              ↘ Flutterwave (payments)
GitHub stores code — not secrets
```

Landing page only? You need **Git + Vercel**. Full store? You need **the full stack in Chapter 9**.

### Your next step

Open **Chapter 9: Deploying to the World** and follow Part 1 (run locally) before Part 4 (Git push). Do not deploy until `git status` shows no `.env` files staged.

---

## What to Do When Something Breaks

| Symptom | What to do |
|---------|------------|
| Red error in terminal | Copy full error → Cursor: *"I get this error after Step X: [paste]. What do I fix?"* |
| Blank white page | Open browser DevTools (F12) → Console tab → paste errors to Cursor |
| Agent created wrong files | Tell Cursor: *"Move X to the correct path listed in the step checklist"* |
| Styling looks wrong | Use Critique Pattern from Chapter 3 on the specific component |
| You skipped a step | Go back — do not pile prompts on a broken foundation |

---

## How This Maps to Royal Prince Hub

| Your DIY track | Royal Prince Hub equivalent |
|----------------|----------------------------|
| Track 1 landing | Portfolio hero + sections on `/` |
| Track 2 multi-page | `/`, blog routes, content pages |
| Track 3 shop UI | `/all-books` product cards |
| Track 3 cart + checkout | Cart flow + Flutterwave in this codebase |
| Track 3 auth | Google OAuth in `AuthContext` |
| Track 3 admin | Admin dashboard product management |

When you finish Track 3, open this repo's `frontend/` and `backend/` folders side by side with your project. Compare file names and patterns — you built the same architecture.

---

## Conclusion

This chapter is the turning point. Everything before was preparation. Everything after (deployment, scaling) assumes **you have something real to deploy**.

You do not need permission to build. You need a prompt, a folder, and the discipline to verify each step before moving on.

Start Track 1, Step 0 today. Not tomorrow. One prompt. Check the files. Next prompt.

Let us build.

---

### Action Points

1. **Create `my-projects/my-landing-page`** on your computer and open it in Cursor — empty folder is fine.

2. **Complete Track 1 Step 0 and Step 1** this week. Do not rush to Step 5 until Steps 0–4 verify cleanly.

3. **Keep `BUILD_LOG.md`** in your project root — date, step completed, one line on what you learned.

4. **Screenshot each finished step** at desktop and mobile width — compare to Chapter 5 previews.

5. **After Track 1** — deploy to Vercel using **Chapter 9** before starting Track 2 so you experience the full loop.

6. **Track 3 only after Track 2** — the e-commerce phases assume you understand routing, forms, and API calls.

7. **Use the Copy prompt button** on each block in this chapter — paste directly into Cursor Agent chat.

8. **Read Chapter 9 (Track 4)** when your project runs on localhost — learn Git, `.gitignore`, Vercel, and Render before sharing your link.
