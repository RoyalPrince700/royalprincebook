# Chapter 2: Your Toolkit & The MERN Stack

> "Give me six hours to chop down a tree and I will spend the first four sharpening the axe." — Abraham Lincoln

In Chapter 1, you learned *what* web development is and *why* AI changes the game. Now we get practical.

A carpenter does not show up to a job without a hammer, saw, and measuring tape. A web developer does not show up without their tools either. The difference is that most of our tools are **free**, and you can download them today.

This chapter is your setup guide. By the end, you will have every tool installed, you will understand what each one does, and you will know how they fit together in the **MERN stack** — the same stack we use to build real applications in this training.

Take your time with this chapter. Do not rush the installations. A solid foundation here saves you weeks of confusion later.

---

## What Is the MERN Stack?

**MERN** is an acronym for four technologies that work together to build full-stack web applications:

| Letter | Technology | Role |
|--------|-----------|------|
| **M** | MongoDB | Database — stores your data |
| **E** | Express | Backend framework — handles routes and logic |
| **R** | React | Frontend library — builds the user interface |
| **N** | Node.js | Runtime — runs JavaScript on the server |

When people say they are a "MERN developer," they mean they can build both the part users see (React) and the part that powers the app behind the scenes (Node + Express + MongoDB).

Throughout this book — and in the live project you will study — this is exactly what we use.

---

## Tool #1: Cursor — Your AI Development Environment

**What it does:** Cursor is a code editor built on top of VS Code, with AI built directly into your workflow. It is where you will write code, ask questions, debug errors, and build projects.

**Why you need it:** This entire training is designed around building with AI assistance. Cursor is not optional for this course — it is your primary workspace.

**Download:** [https://cursor.com](https://cursor.com)

**After installing:**
1. Open Cursor
2. Sign in (free tier works to start)
3. Familiarise yourself with the file explorer on the left, the editor in the centre, and the AI chat panel

**Pro tip:** When you are stuck, describe your problem in plain English in the Cursor chat. Example: *"Explain what this error means"* or *"Create a simple navbar component with my name and three links."*

---

## Tool #2: Node.js & npm — The Engine Room

**What it does:** Node.js lets JavaScript run outside the browser — on your computer and on servers. **npm** (Node Package Manager) comes with Node.js and lets you install libraries and tools that other developers have already built.

Almost everything in modern web development flows through Node.js and npm.

**Download:** [https://nodejs.org](https://nodejs.org) — choose the **LTS** (Long Term Support) version

**Verify installation** — open your terminal in Cursor (`Terminal → New Terminal`) and run:

```bash
node --version
npm --version
```

You should see version numbers (e.g., `v22.x.x` and `10.x.x`). If you do, you are good.

### Your first terminal commands (Windows & Mac)

The **terminal** is a text window where you type commands instead of clicking icons. In Cursor it opens at the bottom of the screen.

| Command | What it does |
|---------|--------------|
| `cd Documents` | Move into your Documents folder |
| `cd my-projects` | Move into a subfolder |
| `cd ..` | Go up one folder level |
| `dir` (Windows) or `ls` (Mac) | List files in the current folder |
| `Ctrl + C` | Stop a running server (e.g. stop `npm run dev`) |

**Tip:** If a command says "not found," you are probably in the wrong folder. Check the path shown in the terminal prompt before running `npm install` or `npm run dev`.

**What you will use npm for:**
- Creating new React projects
- Installing packages like Axios, React Router, Tailwind CSS
- Running your development server (`npm run dev`)
- Installing backend packages like Express, Mongoose, and JWT

---

## Tool #3: Git & GitHub — Saving and Sharing Your Code

**What it does:** **Git** tracks every change you make to your code. If you break something, you can go back. If you want to deploy your site or collaborate with others, Git is essential.

**GitHub** is where your Git repositories live online — think of it as Google Drive, but built specifically for code.

**Download Git:** [https://git-scm.com](https://git-scm.com)

**Create a GitHub account:** [https://github.com](https://github.com)

**Verify installation:**

```bash
git --version
```

### GitHub's Role in the MERN Stack

GitHub is not just storage. In a MERN workflow, it is the **bridge between your computer and the live internet**:

| What You Do | Why It Matters |
|-------------|----------------|
| Push your React frontend code | Vercel watches your repo and auto-deploys when you push |
| Push your Node/Express backend code | Render pulls from GitHub and runs your API server |
| Use branches | Test features safely before merging to `main` |
| View commit history | See exactly what changed and when something broke |

**Simple workflow you will use:**

```bash
git add .
git commit -m "Add hero section"
git push origin main
```

Every serious developer uses GitHub. You will too.

---

## Tool #4: MongoDB — Your Database

**What it does:** A **database** is where your application's data lives permanently. User accounts, book titles, order history, blog posts, tasks — all of this needs to be stored somewhere. MongoDB is a **NoSQL** database, meaning it stores data in flexible, document-like structures (similar to JSON).

Think of MongoDB as a highly organised filing cabinet that your backend can open, read from, and write to at any time.

**Two ways to use MongoDB:**

### Option A: MongoDB Atlas (Recommended for Beginners)
A free cloud database — no local installation needed.

1. Go to [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a free cluster
4. Get your **connection string** (you will use this as `MONGODB_URI` in your backend)

### Option B: MongoDB Community (Local)
Install MongoDB on your own computer.

**Download:** [https://www.mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)

**In our projects**, we use **Mongoose** — a library that makes talking to MongoDB from Node.js much easier. You define schemas (what a "User" or "Book" looks like) and Mongoose handles the rest.

---

## Tool #5: React + Vite — Your Frontend

**What it does:** React builds your user interface. **Vite** is a build tool that makes React development fast — instant server start, quick updates when you save a file.

You do not download React directly. You create a React project using Vite:

```bash
npm create vite@latest my-project -- --template react
cd my-project
npm install
npm run dev
```

This gives you a working React app at `http://localhost:5173`.

**Key frontend libraries we use in our projects:**

| Library | What It Does |
|---------|-------------|
| **React Router** | Navigation between pages (`/`, `/about`, `/shop`) |
| **Axios** | Sends requests from frontend to backend API |
| **Tailwind CSS** | Styles your app with utility classes |
| **Framer Motion** | Smooth animations and transitions |

---

## Tool #6: Express — Your Backend Framework

**What it does:** Express is a minimal, flexible framework for Node.js. It handles **routes** — the URLs your frontend calls to get or send data.

Example routes from a real project:

```
GET  /api/books          → Return all books
POST /api/auth/google    → Start Google login
POST /api/payment/verify → Confirm a payment
GET  /api/health         → Check if server is running
```

Without Express, you would write a lot more boilerplate code. With it, building an API becomes manageable.

**Install in your backend project:**

```bash
npm install express cors dotenv
```

---

## Tool #7: Tailwind CSS — Modern Styling

**What it does:** Instead of writing separate CSS files for every style, Tailwind gives you utility classes directly in your HTML/JSX:

```jsx
<button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
  Buy Now
</button>
```

**Why we use it:** Speed. Consistency. Responsive design built in. Our portfolio and bookstore projects use Tailwind extensively.

**Docs:** [https://tailwindcss.com](https://tailwindcss.com)

---

## Tool #8: Cloudinary — Image & Media Management

**What it does:** When your app needs to upload, store, resize, or deliver images and videos, Cloudinary handles it in the cloud. Instead of saving large image files directly in your database (which is slow and expensive), you upload to Cloudinary and store only the URL.

**Use cases:**
- Profile pictures
- Book cover images
- Product photos for an e-commerce store
- Portfolio project screenshots

**Sign up:** [https://cloudinary.com](https://cloudinary.com) — free tier available

Even if your first project uses placeholder images, understanding Cloudinary prepares you for production-ready apps where users upload their own content.

---

## Authentication (AUTH) — Knowing Who Is Who

**Authentication** answers the question: *Who is this user?*

**Authorization** answers: *What is this user allowed to do?*

These are among the most important concepts in web development. Let me explain both clearly.

### Why AUTH Matters

Imagine an online bookstore. Without authentication:
- Anyone could claim they purchased a book without paying
- Anyone could access the admin panel and delete all your books
- You would have no way to show "My Purchased Books" to a specific user

Authentication fixes this by verifying identity. Authorization fixes it by controlling access.

### How AUTH Works in Our Stack

In the Royal Prince Hub project, we use a combination of industry-standard tools:

**1. Google OAuth 2.0 — "Continue with Google"**

Instead of asking users to create yet another password, they sign in with their Google account. Google confirms their identity and sends that information to our backend.

- **Library:** Passport.js + `passport-google-oauth20`
- **Flow:** User clicks "Login" → Redirected to Google → Google confirms → Backend creates/finds user → Issues a token

**2. JWT (JSON Web Token) — The Digital ID Card**

After login, the server gives the user a **JWT** — a secure token that proves they are logged in. The frontend stores this token and sends it with every protected request.

- **Library:** `jsonwebtoken`
- **Stored in:** Browser `localStorage`
- **Sent as:** `Authorization: Bearer <token>` header

**3. Middleware — The Security Guard**

On the backend, **middleware** functions check every incoming request:

```javascript
// Simplified concept
authenticateToken  → Is this user logged in?
authorizeAdmin     → Is this user an admin?
```

If the token is missing or invalid, the request is rejected. If the user is not an admin, they cannot access admin routes.

**4. bcrypt — Password Hashing (When Needed)**

If you ever store passwords (local email/password login), you never save them as plain text. **bcrypt** scrambles passwords so even if your database is compromised, passwords remain protected.

### User Roles in a Real App

Our project supports different roles:

| Role | Access |
|------|--------|
| `user` | Browse, purchase, read purchased books |
| `admin` | Full admin dashboard, edit books, view analytics |
| `superior` | Extended workboard access |

When you build your e-commerce project, you will implement at least **user** and **admin** roles.

---

## Payments — Flutterwave

**What it does:** When you sell books, courses, or products online, you need a **payment gateway** — a secure service that processes card and bank payments.

In our project, we use **Flutterwave** — popular in Africa and supports Naira (NGN) transactions.

**How it works:**
1. User clicks "Buy Now" on the frontend
2. Flutterwave payment modal opens
3. User pays with card or bank transfer
4. Frontend sends transaction reference to our backend
5. Backend **verifies** the payment with Flutterwave's API
6. If valid, the book is added to the user's `purchasedBooks` list in MongoDB

**Libraries:**
- Frontend: `flutterwave-react-v3`
- Backend: `axios` (to verify transactions server-side)

**Sign up:** [https://flutterwave.com](https://flutterwave.com)

**Important security rule:** Never verify payments only on the frontend. Always verify on the backend with your **secret key**. The frontend only uses the **public key**.

---

## Real-Time Features — Socket.IO

**What it does:** Normally, the frontend asks the backend for data and waits for a response. **Socket.IO** enables **real-time, two-way communication** — the server can push updates to the client instantly.

**Used in our project for:** Collaborative artboard — when one user moves a note, others see it live.

**Libraries:**
- Backend: `socket.io`
- Frontend: `socket.io-client`

You may not need this for your first landing page, but it is part of the full toolkit.

---

## Email — Mailtrap & Nodemailer

**What it does:** Your app needs to send emails — welcome messages, purchase confirmations, password resets.

**Mailtrap** lets you test emails safely in development (emails go to a sandbox, not real inboxes). In production, it sends real emails.

**Library:** `nodemailer` + Mailtrap API

**Sign up:** [https://mailtrap.io](https://mailtrap.io)

---

## Analytics — Knowing Who Visits Your Site

**Google Tag Manager (GTM)** — Tracks visitor behaviour for marketing insights.

**Custom Analytics** — Our project also logs page views and performance to our own MongoDB database, viewable in the admin dashboard.

For your landing page, even a simple analytics setup helps you understand your audience.

---

## Hosting & Infrastructure — Where Your MERN App Lives Online

Building on your laptop is only half the job. To go live, your MERN stack needs a home on the internet. Here is how the platforms we use fit together — and what each one actually does.

### The Full Picture

```
User visits yoursite.com
        ↓
   Cloudflare (optional but powerful)
   → DNS, security, speed, SSL
        ↓
   Vercel hosts your React frontend
        ↓
   Frontend calls your API on Render
        ↓
   Render runs Node.js + Express
        ↓
   MongoDB Atlas stores your data
```

All of this is connected through **GitHub** — you push code, platforms deploy it.

---

### GitHub — Your Code's Home Base

**Role in MERN:** The central hub. Both Vercel and Render connect to your GitHub repository. When you push new code, deployments can happen automatically.

**What you store there:**
- Frontend folder (React app)
- Backend folder (Express API)
- README and documentation
- `.gitignore` (keeps secrets out)

**Sign up:** [https://github.com](https://github.com)

**Key rule:** Never push your `.env` file. Secrets stay on your machine and on Render/Vercel environment variable settings — not in GitHub.

---

### Vercel — Your React Frontend Host

**Role in MERN:** Hosts the **R** — your React application. Vercel is optimised for frontend frameworks. It builds your React app and serves it on a fast global network.

**What Vercel handles:**
- Building your React project (`npm run build`)
- Serving static files and SPA routing
- Free HTTPS (secure `https://` URL)
- Preview deployments for every branch
- Custom domain connection

**Typical setup:**
1. Push React code to GitHub
2. Connect repository to Vercel
3. Vercel detects Vite/React and deploys
4. You get a live URL like `your-app.vercel.app`

**Sign up:** [https://vercel.com](https://vercel.com)

**In our projects:** The portfolio and bookstore frontend both deploy to Vercel.

---

### Render — Your Node.js Backend Host

**Role in MERN:** Hosts the **N** and **E** — your Node.js server and Express API. While Vercel serves what users see, Render runs the server that handles login, payments, database queries, and protected routes.

**What Render handles:**
- Running your Express server 24/7 (or on demand with free tier)
- Environment variables (`MONGODB_URI`, `JWT_SECRET`, etc.)
- HTTPS for your API (`https://your-api.onrender.com`)
- Auto-deploy when you push to GitHub

**Typical setup:**
1. Push backend code to GitHub
2. Create a **Web Service** on Render
3. Set build command: `npm install`
4. Set start command: `node index.js` (or `npm start`)
5. Add environment variables in Render dashboard
6. Point your frontend's `VITE_API_BASE_URL` to your Render URL

**Sign up:** [https://render.com](https://render.com)

**Important:** Your React app on Vercel talks to your API on Render. They are separate services working together — that is normal in MERN development.

---

### Cloudflare — Speed, Security, and DNS

**Role in MERN:** Cloudflare sits **in front of** your application. It is not where you write code, but it plays a powerful role when you go production-ready.

**What Cloudflare does:**
- **DNS** — connects your custom domain (`yourname.com`) to Vercel or Render
- **SSL/HTTPS** — encrypts traffic between users and your site
- **CDN (Content Delivery Network)** — caches assets globally so pages load faster
- **DDoS protection** — blocks malicious traffic before it reaches your app
- **Firewall rules** — extra security layer for your API

**When beginners need it:** Not on day one. But once you buy a custom domain and want professional speed and security, Cloudflare is the industry standard.

**Sign up:** [https://cloudflare.com](https://cloudflare.com) — free tier is generous

**Typical flow with a custom domain:**
1. Buy domain (Namecheap, GoDaddy, etc.)
2. Add domain to Cloudflare
3. Point domain to Vercel (frontend) and subdomain like `api.yourname.com` to Render (backend)
4. Cloudflare handles SSL and caching automatically

Think of Cloudflare as the **security guard and traffic director** at the entrance of your building. Vercel and Render are the offices inside.

---

### How They Work Together — MERN Deployment Summary

| Platform | MERN Layer | What It Hosts |
|----------|-----------|---------------|
| **GitHub** | All | Source code, version history, deployment trigger |
| **MongoDB Atlas** | M | Database |
| **Render** | N + E | Node.js + Express API |
| **Vercel** | R | React frontend |
| **Cloudflare** | Infrastructure | DNS, SSL, speed, security (custom domains) |

We will walk through the full deployment step by step in a later chapter. For now, create your accounts early so you are ready when the time comes.

---

## AI Assistants — Your 24/7 Support Team

I will be teaching you through this book and our projects. But I will not always be available the moment you hit a wall. At 2 AM when your code breaks, when an error message makes no sense, or when you are stuck on a concept — you need somewhere to turn.

That is where **AI assistants** come in.

Think of them as patient tutors who never sleep. You can ask the same question ten times without feeling embarrassed. You can paste an error message and ask what it means. You can describe what you want to build and get a starting point.

### Tools You Should Know

| Tool | Best For | URL |
|------|----------|-----|
| **Cursor** | Writing and fixing code inside your editor | [cursor.com](https://cursor.com) |
| **ChatGPT** | Explaining concepts, debugging, planning features | [chat.openai.com](https://chat.openai.com) |
| **Gemini** | Research, explanations, comparing approaches | [gemini.google.com](https://gemini.google.com) |
| **DeepSeek** | Code-focused questions and technical reasoning | [deepseek.com](https://www.deepseek.com) |

**Cursor** is your primary build environment — AI lives inside your code. **ChatGPT, Gemini, and DeepSeek** are conversation tools you open in your browser when you need to think through a problem, understand a concept, or get a second opinion.

### When to Use Them

- You get an error and do not understand it → paste the error, ask what it means
- You forget how a concept works → ask for a simple explanation with an example
- You are planning a feature → describe it and ask for the steps
- You want feedback on your UI → share a description or screenshot and ask for honest critique
- I am not available → **run to AI first**, then bring what you learned to our community or to me

**Important:** AI is support — not a replacement for learning. Chapter 3 is dedicated entirely to how to use AI properly: writing good prompts, knowing what languages AI understands best, and developing the **judgment** to evaluate what it gives you.

Do not skip that chapter. The developers who win with AI are not the ones who copy the fastest — they are the ones who ask the best questions and think critically about the answers.

---

## Environment Variables — The `.env` File

Your app needs secrets: database passwords, API keys, JWT signing secrets. These go in a `.env` file in your backend folder:

```
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret-key-here
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
FLUTTERWAVE_SECRET_KEY=...
FRONTEND_URL=http://localhost:5173
```

**Golden rules:**
1. Never commit `.env` to GitHub
2. Add `.env` to your `.gitignore` file
3. Use different values for development and production

---

## Your Complete Toolkit Checklist

Do **not** create every account on day one. That overwhelms beginners. Use this phased plan instead.

### Phase A — Install today (before Chapter 3)

You need these on your computer to start building Track 1:

| Tool | Action | Link |
|------|--------|------|
| **Cursor** | Download and sign in | [cursor.com](https://cursor.com) |
| **Node.js (LTS)** | Download and install | [nodejs.org](https://nodejs.org) |
| **Git** | Download and install | [git-scm.com](https://git-scm.com) |

**Verify in terminal:**

```bash
node --version
npm --version
git --version
```

**Optional test** — confirm React tooling works:

```bash
npm create vite@latest test-app -- --template react
cd test-app
npm install
npm run dev
```

If you see a page at `localhost:5173`, delete the `test-app` folder and move on. You will create your real project in Chapter 6.

Also create **one folder** on your computer: `my-web-projects` (or `Documents/my-projects`).

---

### Phase B — Before Track 1 deploy (Chapter 9)

Create these when you finish your landing page and are ready to go live:

| Account | Why now |
|---------|---------|
| **GitHub** | Store code online |
| **Vercel** | Host your React site free |

You do **not** need MongoDB, Render, or Flutterwave for a landing page.

---

### Phase C — Before Track 3 Phase 3 (backend)

Create when you start the e-commerce backend:

| Account | Why now |
|---------|---------|
| **MongoDB Atlas** | Cloud database for products, users, orders |

Follow the step-by-step setup in **Chapter 6 (Phase 3)** or **Chapter 9 Part 3**.

---

### Phase D — Before Track 3 Phase 5 (Google login)

| Account | Why now |
|---------|---------|
| **Google Cloud Console** | OAuth credentials for "Continue with Google" |

Follow the full walkthrough in **Chapter 8 — Google OAuth Setup Step by Step**.

---

### Phase E — Before Track 3 Phase 6 (payments)

| Account | Why now |
|---------|---------|
| **Flutterwave** | Test-mode payment keys |

Use **test mode only** until you are ready for real money.

---

### Phase F — Before Track 3 deploy (full stack live)

| Account | Why now |
|---------|---------|
| **Render** | Host Express API 24/7 |
| **Cloudinary** | Product image uploads (if not using placeholder URLs) |

---

### Phase G — When you want a custom domain (Chapter 13)

| Account | Why now |
|---------|---------|
| **Cloudflare** | DNS, SSL, security in front of your site |
| **Domain registrar** | Buy `yourname.com` (Namecheap, GoDaddy, etc.) |

---

### AI assistants — anytime (recommended by Chapter 3)

| Tool | Link |
|------|------|
| **ChatGPT** | [chat.openai.com](https://chat.openai.com) |
| **Gemini** | [gemini.google.com](https://gemini.google.com) |
| **DeepSeek** | [deepseek.com](https://www.deepseek.com) |

---

### Quick reference — full list (for later)

When you are ready for everything:

- [ ] Cursor, Node.js, Git *(Phase A)*
- [ ] GitHub, Vercel *(Phase B)*
- [ ] MongoDB Atlas *(Phase C)*
- [ ] Google Cloud Console *(Phase D)*
- [ ] Flutterwave test account *(Phase E)*
- [ ] Render, Cloudinary *(Phase F)*
- [ ] Cloudflare + domain *(Phase G)*
- [ ] ChatGPT / Gemini / DeepSeek *(anytime)*

**Stuck on a term?** See **GLOSSARY.md** in this book's content folder — plain-English definitions for JWT, API, CORS, middleware, and more.

---

## How the Tools Connect — A Preview

Here is how everything fits together when a user buys a book on our platform:

```
1. User clicks "Buy Now"          → React (frontend)
2. Flutterwave modal opens        → flutterwave-react-v3
3. User pays                      → Flutterwave servers
4. Frontend sends transaction ID  → Axios → Express backend
5. Backend verifies payment       → Flutterwave API + axios
6. Backend saves purchase         → Mongoose → MongoDB
7. Backend sends confirmation     → Mailtrap email
8. User reads book                → React checks JWT + purchasedBooks
```

This flow — frontend → API → database → third-party service — is the pattern you will use again and again. Landing pages are simpler (mostly frontend). E-commerce adds backend, database, auth, and payments.

Chapter 4 teaches the visual elements every site uses. Chapter 5 shows you how to combine those pieces for different types of projects — using Royal Prince Hub as the live reference.

---

## Conclusion

You now have a complete map of the tools you need. The MERN stack (MongoDB, Express, React, Node.js) is your foundation. Around it, you add styling (Tailwind), authentication (Google OAuth + JWT), payments (Flutterwave), media (Cloudinary), email (Mailtrap), hosting (GitHub + Vercel + Render), infrastructure (Cloudflare), and AI assistants (Cursor, ChatGPT, Gemini, DeepSeek).

Do not feel overwhelmed. You do not need to master every tool today. We will introduce each one **when you need it** during the project walkthroughs.

For now: complete **Phase A only** — install Cursor, Node.js, and Git. Run the version checks. Create your `my-web-projects` folder. Then read Chapter 3 — it will teach you how to actually work with AI so these tools become your advantage, not your crutch. Create other accounts when each phase tells you to.

---

### Action Points

1. **Complete Phase A of the checklist** (Cursor, Node, Git + version checks). Do not create every account today — follow the phased plan.

2. **Create a folder on your computer** called `my-web-projects`. This is where all your work for this training will live.

3. **Open Cursor AI chat** and ask: *"Explain the MERN stack to me like I am a beginner, and tell me what each letter does."* Compare the answer to what you learned in this chapter.

4. **Bookmark these docs** for reference:
   - React: [react.dev](https://react.dev)
   - Express: [expressjs.com](https://expressjs.com)
   - MongoDB: [mongodb.com/docs](https://www.mongodb.com/docs)
   - Tailwind: [tailwindcss.com/docs](https://tailwindcss.com/docs)

5. **Journal one paragraph:** What tool confused you most? What tool excited you most? Bring those questions to the project chapters — they are exactly what Cursor is for.
