# Chapter 9: Deploying to the World — Run Locally, Git Push & Go Live

> "A website nobody can visit is just a folder on your laptop. Deployment is how you hand the keys to the world." — Royal Prince

You built something in Chapter 6. Chapter 8 taught you to protect secrets and review AI output. **This chapter teaches you the full path from your computer to a live URL** — running servers locally, understanding how MongoDB, Cloudinary, Flutterwave, GitHub, Vercel, and Render fit together, pushing code safely with Git, and deploying so anyone with a link can see your work.

Read this chapter slowly. Do each section in order. Do not skip `.gitignore`. Do not push your `.env` file. Ever.

---

## What You Will Have When This Chapter Is Done

| Outcome | Example |
|---------|---------|
| Project runs on your machine | `localhost:5173` (frontend) + `localhost:5000` (backend) |
| Code on GitHub | `github.com/yourusername/my-store` |
| Live frontend URL | `https://my-store.vercel.app` |
| Live backend URL | `https://my-store-api.onrender.com` |
| Database in the cloud | MongoDB Atlas cluster |
| Images hosted properly | Cloudinary URLs in product records |
| Payments in test mode | Flutterwave test keys on Render |

Landing page only? You still need **Git + Vercel**. E-commerce? You need **everything in this chapter**.

---

## How Your Project Folders Are Organized

Before you run commands, understand **where you are standing** in the terminal.

### Option A — Single frontend project (Track 1 or 2)

```
my-landing-page/
  package.json
  src/
  index.html
```

One folder. One `npm run dev`. No backend yet.

### Option B — Separate frontend + backend (Track 3 e-commerce)

```
my-projects/
  my-store/           ← React frontend (Vite)
    package.json
    src/
  my-store-api/       ← Express backend
    package.json
    server.js
    models/
    routes/
```

Two folders. **Two terminals.** Two `npm run dev` commands running at the same time.

### Option C — Monorepo (like Royal Prince Hub)

```
book/
  frontend/           ← React app
  backend/            ← Express API
  .gitignore          ← Root ignore file
```

One Git repo. Two subfolders. You `cd` into each to run servers.

**Rule:** Always know which folder your terminal is in before typing a command. Type `pwd` (Mac/Linux) or `cd` with no arguments (Windows) to check.

---

## Part 1: Running Your Project Locally

### Open the terminal in Cursor

**Menu:** `Terminal → New Terminal`

The terminal opens at your project root — the folder you opened in Cursor.

### Essential `cd` commands

`cd` means **change directory** — move into a folder.

```bash
cd my-store
```

Enter the `my-store` folder.

```bash
cd frontend
```

Enter the `frontend` folder (monorepo style).

```bash
cd backend
```

Enter the `backend` folder.

```bash
cd ..
```

Go **up one level** — back to the parent folder. This is how you leave `frontend` and return to the project root.

```bash
cd ../my-store-api
```

From `my-store`, go up then into the API folder (sibling projects).

### First-time setup (every project)

Inside the folder that has `package.json`:

```bash
npm install
```

Downloads all dependencies into `node_modules/`. Run this once after cloning or creating a project — and again when `package.json` changes.

### Start the frontend (React + Vite)

```bash
cd my-store
npm run dev
```

Or in a monorepo:

```bash
cd frontend
npm run dev
```

**Success looks like:**

```
  VITE v5.x.x  ready in 500 ms
  ➜  Local:   http://localhost:5173/
```

Open `http://localhost:5173` in your browser. **Leave this terminal running.** Do not close it while developing.

### Start the backend (Express API)

Open a **second terminal** in Cursor: `Terminal → New Terminal`

```bash
cd my-store-api
npm install
npm run dev
```

Or monorepo:

```bash
cd backend
npm run dev
```

**Success looks like:**

```
Server running on port 5000
MongoDB connected
```

Your API is now at `http://localhost:5000`. Test it: open `http://localhost:5000/api/products` in the browser (or your health route).

### Two terminals — always

| Terminal 1 | Terminal 2 |
|------------|------------|
| `cd my-store` → `npm run dev` | `cd my-store-api` → `npm run dev` |
| Frontend :5173 | Backend :5000 |

If the frontend shows "Network Error" when loading products, the backend is probably not running.

### Stop a server

Click the terminal and press `Ctrl + C`. Confirm if asked.

### Common local errors

| Error | Fix |
|-------|-----|
| `command not found: npm` | Install Node.js from [nodejs.org](https://nodejs.org) |
| `EADDRINUSE port 5000` | Something else uses port 5000 — stop it or change `PORT` in `.env` |
| `Cannot find module` | Run `npm install` in that folder |
| `MONGODB_URI undefined` | Create `.env` in backend — see Part 3 |
| Frontend cannot reach API | Check `VITE_API_BASE_URL` in frontend `.env.local` points to `http://localhost:5000/api` |

---

## Part 2: How Everything Connects Together

When you build an e-commerce store, you are not using one tool — you are connecting **a team of services**. Here is how they relate.

### The full e-commerce map

```
┌─────────────────────────────────────────────────────────────┐
│  USER'S BROWSER                                             │
│  visits https://my-store.vercel.app                         │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  VERCEL — hosts your React frontend (HTML, JS, CSS)         │
│  • Builds from GitHub when you push                         │
│  • Serves the shop UI, cart, login button                   │
│  • Only knows PUBLIC env vars (VITE_API_BASE_URL, VITE_GOOGLE…)  │
└──────────────────────────┬──────────────────────────────────┘
                           │ API calls (Axios/fetch)
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  RENDER — runs your Express backend 24/7                    │
│  • Login, products, orders, payment verification            │
│  • Holds ALL secret keys in Render env vars                 │
└──────┬──────────────┬──────────────┬────────────────────────┘
       │              │              │
       ▼              ▼              ▼
┌────────────┐ ┌────────────┐ ┌──────────────────┐
│  MONGODB   │ │ CLOUDINARY │ │  FLUTTERWAVE     │
│  ATLAS     │ │            │ │                  │
│            │ │            │ │                  │
│ Users      │ │ Product    │ │ Card payments    │
│ Products   │ │ images     │ │ Test/live keys   │
│ Orders     │ │ User       │ │ Verify on server │
│            │ │ uploads    │ │                  │
└────────────┘ └────────────┘ └──────────────────┘

        GITHUB — stores your code (not secrets)
        Both Vercel and Render watch GitHub and redeploy on push
```

### What each service does — plain English

| Service | Job | Analogy |
|---------|-----|---------|
| **GitHub** | Stores your code online | Filing cabinet for source files |
| **Vercel** | Shows your website to the world | Shop window |
| **Render** | Runs your server logic | Back office / stock room |
| **MongoDB Atlas** | Saves users, products, orders | Database filing system |
| **Cloudinary** | Stores and delivers images | Photo warehouse + CDN |
| **Flutterwave** | Processes payments | Cash register |
| **Google OAuth** | Confirms "this person is who they say" | ID checker at the door |

### Why Cloudinary matters for e-commerce

You **do not** store image files inside MongoDB. You store **URLs**.

**Bad:** Saving a 2MB photo as base64 in a product document — slow, expensive, hits size limits.

**Good:** Upload image to Cloudinary → get back `https://res.cloudinary.com/.../book-cover.jpg` → save that URL string in MongoDB.

When a user uploads a product image in admin, your backend receives the file, uploads to Cloudinary, saves the URL. The frontend just displays the URL in an `<img>` tag.

### Why Flutterwave sits on the backend

The browser gets a **public key** to open the payment modal. The **secret key** verifies the payment on your server. If you put the secret key in React, anyone can steal it from the browser and fake payments.

**Flow:** User pays → Flutterwave returns reference → frontend sends reference to your Render API → backend calls Flutterwave verify API with secret key → backend marks order `paid` in MongoDB.

### Landing page only — what you still need

| Service | Needed? |
|---------|---------|
| GitHub | Yes |
| Vercel | Yes |
| Render | No (no backend) |
| MongoDB | No |
| Cloudinary | Optional (use static images in `/public` for now) |
| Flutterwave | No |

---

## Part 3: Getting Your Accounts & Connection Strings

Create these accounts **before** deployment. Use the same email where possible so recovery is easy.

### MongoDB Atlas — your database link

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) → **Sign up free**
2. Create an **organization** (default name is fine)
3. Create a **project** (e.g. `my-store`)
4. Click **Build a Database** → choose **M FREE** (free tier)
5. Choose a cloud region close to you (e.g. AWS `eu-west-1` or closest African region)
6. Cluster name: `Cluster0` → **Create**
7. **Database Access** → Add user → username + strong password → **Database User Privileges: Read and write to any database**
8. **Network Access** → **Add IP Address** → **Allow Access from Anywhere** (`0.0.0.0/0`) for development *(tighten later for production)*
9. **Database** → **Connect** → **Drivers** → copy connection string:

```
mongodb+srv://myuser:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

10. Replace `<password>` with your real password (URL-encode special characters like `@` → `%40`)
11. Add database name before the `?`:

```
mongodb+srv://myuser:myPass123@cluster0.xxxxx.mongodb.net/mystore?retryWrites=true&w=majority
```

**Put this in backend `.env` only:**

```
MONGODB_URI=mongodb+srv://myuser:myPass123@cluster0.xxxxx.mongodb.net/mystore?retryWrites=true&w=majority
```

**Never commit this line to GitHub.**

---

### Cloudinary — image storage

1. Go to [cloudinary.com](https://cloudinary.com) → **Sign up free**
2. After login, open the **Dashboard**
3. Copy these three values:

| Dashboard label | Goes in backend `.env` |
|-----------------|------------------------|
| Cloud name | `CLOUDINARY_CLOUD_NAME=...` |
| API Key | `CLOUDINARY_API_KEY=...` |
| API Secret | `CLOUDINARY_API_SECRET=...` |

4. Backend upload route uses the Cloudinary SDK to upload files and return a secure URL
5. Store that URL in MongoDB on the product document (`image: "https://res.cloudinary.com/..."`)

**Frontend never needs the API secret.** Only the backend uploads.

---

### Flutterwave — payments (test mode first)

1. Go to [flutterwave.com](https://flutterwave.com) → create account
2. Complete business profile (test mode works before full verification)
3. **Settings → API Keys**
4. Toggle **Test mode** ON
5. Copy:

| Key | Where it lives |
|-----|----------------|
| **Public key** (`FLWPUBK_TEST-...`) | Frontend `.env` as `VITE_FLW_PUBLIC_KEY` AND Render/Vercel env |
| **Secret key** (`FLWSECK_TEST-...`) | Backend `.env` and Render env **only** |

6. Use [Flutterwave test cards](https://developer.flutterwave.com/docs/test-cards) for fake payments

**Live mode:** Only switch after you verify real bank details and test thoroughly in test mode.

---

### Google OAuth — login (Track 3)

> **Full walkthrough:** See **Chapter 8 — Google OAuth Setup Step by Step** for every click in Google Cloud Console. Summary below for deploy checklist.

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a project → **APIs & Services → Credentials**
3. **Create Credentials → OAuth client ID → Web application**
4. **Authorized JavaScript origins:**
   - `http://localhost:5173`
   - `https://my-store.vercel.app` *(add after Vercel deploy)*
5. **Authorized redirect URIs:**
   - `http://localhost:5000/api/auth/google/callback`
   - `https://my-store-api.onrender.com/api/auth/google/callback` *(add after Render deploy)*

```
GOOGLE_CLIENT_ID=....apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-...
```

Backend only for the secret. Frontend gets client ID as `VITE_GOOGLE_CLIENT_ID`.

---

### Complete backend `.env` checklist (local)

Create `my-store-api/.env`:

```
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=pick-a-long-random-string-at-least-32-characters
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
FLUTTERWAVE_SECRET_KEY=FLWSECK_TEST-...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:5000
```

Create `my-store/.env.local`:

```
VITE_API_BASE_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=...
VITE_FLW_PUBLIC_KEY=FLWPUBK_TEST-...
```

**Important:** The URL must include `/api` at the end if your axios base URL expects it — same pattern as Royal Prince Hub.

Copy `.env.example` to `.env.local` — commit **only** `.env.example` to Git.

### How to create a `.env` file (first time)

1. In Cursor's file explorer, right-click your backend folder (`my-store-api`)
2. **New File** → name it exactly `.env` (the dot matters)
3. Paste your key=value pairs — one per line, no quotes unless the value contains spaces
4. Save (`Ctrl + S`)
5. **Restart the backend server** after any `.env` change — env vars load at startup only

Do the same for frontend: `my-store/.env.local` (Vite prefers `.env.local` for local secrets).

---

## Part 4: Git & GitHub — From Zero to Push

Git tracks changes. GitHub stores your repo online so Vercel and Render can pull from it.

### Step 1 — Install Git

Download: [git-scm.com](https://git-scm.com)

Verify:

```bash
git --version
```

### Step 2 — Create a GitHub account

1. Go to [github.com](https://github.com) → **Sign up**
2. Choose a username (this appears in your URLs — pick something professional)
3. Verify email

### Step 3 — Configure Git (one time on your machine)

```bash
git config --global user.name "Your Name"
git config --global user.email "you@email.com"
```

Use the **same email** as your GitHub account.

### Step 4 — Create a new repository on GitHub

1. GitHub → **+** → **New repository**
2. Name: `my-store` (or `my-landing-page`)
3. **Private** recommended while learning *(free for personal accounts)*
4. **Do NOT** check "Add a README" if you already have local code *(avoids merge conflicts)*
5. Click **Create repository**
6. Copy the repo URL: `https://github.com/yourusername/my-store.git`

### Step 5 — Create `.gitignore` BEFORE your first commit

**Why:** `node_modules/` can contain **hundreds of thousands** of files. Pushing it breaks GitHub, slows everything, and serves no purpose — anyone runs `npm install` to recreate it.

**Also never push:** `.env`, `.env.local`, secrets, build output you can regenerate.

**Root `.gitignore` for monorepo (frontend + backend):**

```gitignore
# Dependencies — NEVER push
node_modules/

# Environment secrets — NEVER push
.env
.env.local
.env.production
.env.*.local

# Build output
dist/
build/

# Logs
*.log
npm-debug.log*

# OS / editor
.DS_Store
Thumbs.db
.vscode/
.idea/

# Vite
*.local
```

**Single frontend project** — same file at project root.

**Ask Cursor:** *"Create a .gitignore for a React Vite frontend and Node Express backend monorepo. Never commit node_modules or .env files."*

### Step 6 — Initialize Git and push (first time)

Open terminal at your **project root** (where `.gitignore` lives):

```bash
git init
git add .
git status
```

**STOP. Read `git status` output before committing.**

You should **NOT** see:
- `node_modules/`
- `.env`
- `.env.local`

If you see them, `.gitignore` is wrong or missing. Fix it before continuing.

```bash
git commit -m "Initial commit: landing page with navbar and hero"
git branch -M main
git remote add origin https://github.com/yourusername/my-store.git
git push -u origin main
```

GitHub may ask you to log in — use browser authentication or a **Personal Access Token** as password.

### GitHub login on Windows (first push)

If `git push` asks for a password and rejects your GitHub password, GitHub no longer accepts account passwords in the terminal. Use one of these:

**Option A — Browser login (easiest):**

1. When Git asks to authenticate, choose **Sign in with your browser**
2. Complete login in the browser window that opens
3. Return to Cursor — push should complete

**Option B — Personal Access Token (PAT):**

1. GitHub.com → your profile picture → **Settings**
2. **Developer settings** → **Personal access tokens** → **Tokens (classic)**
3. **Generate new token (classic)** → name it `my-laptop` → check **repo** scope → Generate
4. Copy the token immediately (you will not see it again)
5. When `git push` asks for password, **paste the token** — not your GitHub password

Store the token somewhere safe (password manager). Treat it like a password.

### Git commands you will use every day

| Command | What it does |
|---------|--------------|
| `git status` | Shows changed files — run constantly |
| `git add .` | Stage all changes for commit |
| `git add src/App.jsx` | Stage one file only |
| `git commit -m "Add contact form"` | Save a snapshot with a message |
| `git push` | Upload commits to GitHub |
| `git pull` | Download latest from GitHub |
| `git log --oneline` | See commit history |

### Good commit messages

```bash
git commit -m "Add product grid to shop page"
git commit -m "Fix mobile navbar menu toggle"
git commit -m "Connect shop to MongoDB API"
```

**Bad:** `git commit -m "fix"` or `git commit -m "update"`

### If you already pushed secrets by mistake

1. **Immediately** rotate keys — new MongoDB password, new Flutterwave keys, new JWT secret
2. Remove `.env` from Git history (ask Cursor for help with `git filter-repo` or BFG)
3. Never ignore this — bots scan GitHub for leaked keys within minutes

---

## Part 5: Deploy Frontend to Vercel

Vercel hosts your React app. It connects to GitHub and rebuilds on every push.

### Step 1 — Sign up

1. [vercel.com](https://vercel.com) → **Sign up with GitHub**
2. Authorize Vercel to access your repositories

### Step 2 — Import project

1. **Add New → Project**
2. Select your repo (`my-store` or monorepo root)
3. **Configure:**

| Setting | Monorepo value | Single frontend value |
|---------|----------------|----------------------|
| **Framework Preset** | Vite | Vite |
| **Root Directory** | `frontend` | `./` (leave blank) |
| **Build Command** | `npm run build` | `npm run build` |
| **Output Directory** | `dist` | `dist` |

4. **Environment Variables** — add before first deploy:

| Name | Value | Notes |
|------|-------|-------|
| `VITE_API_BASE_URL` | `https://my-store-api.onrender.com/api` | Your Render URL + `/api` *(add after backend deploy)* |
| `VITE_GOOGLE_CLIENT_ID` | `....apps.googleusercontent.com` | Public — safe in Vercel |
| `VITE_FLW_PUBLIC_KEY` | `FLWPUBK_TEST-...` | Public Flutterwave key |

5. Click **Deploy**

First deploy takes 1–3 minutes. You get: `https://my-store-abc123.vercel.app`

### Step 3 — Redeploy after backend is live

When Render gives you an API URL, update `VITE_API_BASE_URL` in Vercel → **Settings → Environment Variables** → **Redeploy**.

### Vercel + GitHub link — how it works

```
You: git push origin main
        ↓
GitHub receives new code
        ↓
Vercel webhook fires automatically
        ↓
Vercel runs npm install + npm run build
        ↓
New live site in ~2 minutes
```

Every push to `main` can auto-deploy. Preview URLs are created for branches too.

### Custom domain (optional later)

Vercel → Project → **Settings → Domains** → add `yourname.com`. Point DNS records as Vercel instructs. Cloudflare can sit in front for extra speed — see Chapter 2.

---

## Part 6: Deploy Backend to Render

Render runs your Express server so it is online 24/7 — not only when your laptop is open.

### Step 1 — Sign up

1. [render.com](https://render.com) → **Sign up with GitHub**

### Step 2 — Create Web Service

1. **New + → Web Service**
2. Connect repo
3. **Settings:**

| Setting | Value |
|---------|-------|
| **Name** | `my-store-api` |
| **Root Directory** | `my-store-api` or `backend` |
| **Runtime** | Node |
| **Build Command** | `npm install` |
| **Start Command** | `node server.js` or `npm start` |
| **Instance Type** | Free *( spins down after inactivity — first request may be slow)* |

### Step 3 — Environment variables on Render

In Render dashboard → **Environment** → add **every** backend `.env` variable:

```
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_CALLBACK_URL=https://my-store-api.onrender.com/api/auth/google/callback
FLUTTERWAVE_SECRET_KEY=FLWSECK_TEST-...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
FRONTEND_URL=https://my-store.vercel.app
BACKEND_URL=https://my-store-api.onrender.com
```

**Paste values from your local `.env` — not the file itself.**

### Step 4 — Deploy and test

Render gives you: `https://my-store-api.onrender.com`

Test in browser: `https://my-store-api.onrender.com/api/products`

Should return JSON — not an error page.

### Step 5 — Update Google OAuth redirect URIs

Add production URLs in Google Cloud Console (see Part 3). Redeploy if needed.

### Free tier note

Render free services **sleep** after ~15 minutes of no traffic. First visit wakes them up (15–30 second delay). Upgrade later when you have real users.

---

## Part 7: Wire Frontend to Backend (Production)

After both are live:

1. **Vercel** `VITE_API_BASE_URL` = your Render URL + `/api` (e.g. `https://my-store-api.onrender.com/api`)
2. **Render** `FRONTEND_URL` = your Vercel URL
3. **Backend CORS** must allow your Vercel domain:

```javascript
// server.js — concept
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
```

4. Redeploy both after env changes
5. Test full flow: browse shop → login → add to cart → test payment

---

## Part 8: Full Checklist — Local to Live

Print this. Check each box.

### Local development

- [ ] Node.js installed (`node --version`)
- [ ] Git installed (`git --version`)
- [ ] `npm install` in frontend folder
- [ ] `npm install` in backend folder *(if applicable)*
- [ ] Backend `.env` created — not committed
- [ ] Frontend `.env.local` created — not committed
- [ ] `.gitignore` includes `node_modules/` and `.env`
- [ ] Frontend runs: `cd frontend` → `npm run dev` → localhost:5173
- [ ] Backend runs: `cd backend` → `npm run dev` → localhost:5000
- [ ] API returns data in browser

### Cloud accounts

- [ ] GitHub account + repository created
- [ ] MongoDB Atlas cluster + connection string
- [ ] Cloudinary account *(e-commerce with uploads)*
- [ ] Flutterwave test keys *(e-commerce)*
- [ ] Google OAuth credentials *(login)*

### Git push

- [ ] `git status` shows no `.env` or `node_modules`
- [ ] First commit pushed to `main`
- [ ] GitHub repo shows your files online

### Deploy

- [ ] Vercel connected to GitHub repo
- [ ] Vercel root directory set correctly (`frontend` or `./`)
- [ ] Vercel env vars set (`VITE_*`)
- [ ] Render web service created
- [ ] Render env vars set (all secrets)
- [ ] Production URLs updated in Google OAuth
- [ ] Live site loads in browser
- [ ] Live API returns JSON
- [ ] Full user flow tested on production URL

---

## Part 9: Project Type Quick Reference

### Track 1 — Landing page only

```bash
cd my-landing-page
npm install
npm run dev
# Build locally, then:
git init
git add .
git commit -m "Initial landing page"
git push origin main
# Vercel only — Root Directory: ./
```

No Render. No MongoDB.

### Track 2 — Multi-page site

Same as Track 1 — React Router still deploys as static SPA on Vercel. No backend required unless you add a contact form API later.

### Track 3 — Full e-commerce

Two folders. Two terminals locally. GitHub monorepo or two repos *(monorepo is easier for beginners)*.

```
Terminal 1: cd my-store && npm run dev
Terminal 2: cd my-store-api && npm run dev
```

Deploy: Vercel (`my-store`) + Render (`my-store-api`) + MongoDB + Cloudinary + Flutterwave + Google OAuth.

---

## What Happens When You Push an Update

You fix a bug locally. Then:

```bash
git add .
git status          # verify no secrets staged
git commit -m "Fix cart quantity bug"
git push
```

Within minutes:
- **Vercel** rebuilds frontend automatically
- **Render** redeploys backend automatically

Your live users see the fix. That is the professional workflow.

---

## Common Deployment Mistakes

| Mistake | Consequence | Fix |
|---------|-------------|-----|
| Pushed `node_modules/` | Huge repo, slow clones | Add to `.gitignore`, remove from Git |
| Pushed `.env` | Leaked secrets | Rotate all keys immediately |
| Wrong Vercel root directory | Build fails | Set `frontend` in project settings |
| Forgot `VITE_` prefix | Env var undefined in browser | Rename in Vercel settings |
| Secret key in frontend | Stolen payments | Move to Render backend only |
| CORS blocks API | Frontend cannot fetch | Set `FRONTEND_URL` in backend CORS |
| MongoDB IP not whitelisted | `MongoNetworkError` | Allow `0.0.0.0/0` in Atlas Network Access |
| Render service sleeping | Slow first load | Normal on free tier — warn users or upgrade |

---

## How Royal Prince Hub Does It

This book's reference project uses exactly this stack:

| Piece | Where |
|-------|-------|
| Frontend code | `frontend/` → Vercel |
| Backend code | `backend/` → Render |
| Database | MongoDB Atlas |
| Images | Cloudinary |
| Payments | Flutterwave |
| Code storage | GitHub |
| DNS *(optional)* | Cloudflare |

Open this repo's root `.gitignore` — notice `node_modules/` and `.env` are excluded. That is intentional. Copy that pattern for every project you build.

---

## Conclusion

Building on localhost proves it works for you. **Pushing to GitHub and deploying proves it works for the world.**

You now know:
- How to `cd` into frontend and backend and start both servers
- How MongoDB, Cloudinary, Flutterwave, GitHub, Vercel, and Render connect
- How to get every connection string and API key
- How to use `.gitignore` so you never push `node_modules` or secrets
- How to `git add`, `git commit`, and `git push`
- How to link GitHub to Vercel and Render

Finish Track 1. Push it. Deploy it. Send someone the link. **That moment — when your project is live — is when you become a builder.**

What comes next in this book:

- **Chapter 10** — understand backend anatomy (models, routes, data flow)
- **Chapter 11** — debug when things break (your field manual)
- **Chapter 12** — build your admin dashboard
- **Chapter 13** — custom domain + Cloudflare when you are ready to look professional
- **Chapter 14** — portfolio, freelance, and your next build

Let us ship.

---

### Action Points

1. **Run both servers locally today** — open two terminals, start frontend and backend, confirm `localhost:5173` talks to `localhost:5000`.

2. **Create `.gitignore` before `git add .`** — copy the template from this chapter or from Royal Prince Hub's root `.gitignore`.

3. **Create a GitHub repo** and push your Track 1 landing page — even if it is not perfect. Shipping beats waiting.

4. **Set up MongoDB Atlas** and paste `MONGODB_URI` into backend `.env` — test connection before deploying.

5. **Sign up for Cloudinary and Flutterwave (test mode)** if you are on Track 3 — store keys in `.env`, not in code.

6. **Deploy frontend to Vercel** — link GitHub, set root directory, add `VITE_*` env vars, click Deploy.

7. **Deploy backend to Render** — paste all backend env vars in the dashboard, test `/api/products` on the live URL.

8. **Update Google OAuth** with production Vercel and Render URLs after first deploy.

9. **Run the full Part 8 checklist** — do not skip the `git status` check before every push.

10. **Share your live URL** with one person and ask them to open it on their phone — mobile testing on a real URL is different from localhost.
