# Chapter 8: Vibe Coding With Eyes Open — Env Files, Auth & What AI Gets Wrong

> "Just because AI built it does not mean it is good." — Chapter 3, and you need to hear it again now that you are actually building.

Chapter 7 told you to build without excuses. Good. You should be in Cursor right now with a folder open, pasting prompts, shipping steps.

But here is the danger nobody warns beginners about clearly enough:

**When you vibe code — when you describe what you want, accept AI output, run the app, and keep moving — you can build something that looks finished while being wrong under the hood.**

Wrong architecture. Wrong libraries. Secrets exposed. Auth that looks like it works but does not protect anything. A payment flow that trusts the browser instead of the server.

This chapter is your guardrail. Not to slow you down — to stop you from wasting weeks on a project that collapses the moment you add real users, real money, or real deployment.

Read this before you finish Track 3. Read it again before you go live.

---

## What "Vibe Coding" Actually Means

Vibe coding is real. You describe the vibe — *"clean hero, dark navbar, Google login, checkout in Naira"* — and Cursor generates files fast. That is a superpower. I use it every week on Royal Prince Hub.

But vibe coding is **not** the same as vibe **shipping**.

| Vibe coding (good) | Vibe shipping (dangerous) |
|--------------------|---------------------------|
| Generate one feature, review the diff, test it | Accept ten files without reading them |
| Ask AI to match your existing stack | Let AI pick whatever stack it "feels like" |
| Verify env vars and routes after each step | Push to GitHub with secrets inside |
| Fix errors before the next prompt | Stack prompts on a broken foundation |

You are the developer. AI is fast — not responsible. When something breaks in production at 11 PM, Cursor will not answer your phone. **You** will.

---

## The `.env` File — Treat It Like Cash

Chapter 2 introduced environment variables. Now that you are building, this section is non-negotiable.

### What `.env` is

A `.env` file stores **secrets and configuration** your app needs but should never be public:

- Database connection strings
- JWT signing secrets
- Google OAuth client secrets
- Flutterwave secret keys
- Email API tokens

**Backend** (Node/Express) reads from `.env` via `process.env.VARIABLE_NAME`.

**Frontend** (Vite/React) only sees variables prefixed with `VITE_` — and those are **embedded in the browser bundle**. Never put secret keys in frontend env vars.

### Royal Prince Hub pattern — two env worlds

```
my-store/                 ← React frontend
  .env                    ← VITE_API_BASE_URL only (public-safe)

my-store-api/             ← Express backend
  .env                    ← ALL secrets live here
```

**Backend `.env` example (never commit this):**

```
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=use-a-long-random-string-here
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
FLUTTERWAVE_SECRET_KEY=...
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:5000
MAILTRAP_HOST=...
MAILTRAP_USER=...
MAILTRAP_PASS=...
```

**Frontend `.env` example (still do not commit — but safe if leaked):**

```
VITE_API_BASE_URL=http://localhost:5000/api
VITE_FLUTTERWAVE_PUBLIC_KEY=...
```

Notice: **public** Flutterwave key on frontend. **Secret** Flutterwave key on backend only.

### Golden rules — no exceptions

1. **Never commit `.env` to GitHub.** Check `.gitignore` includes `.env` before your first push.
2. **Never paste secret keys into Cursor chat** or ChatGPT. If you must debug, redact: `FLUTTERWAVE_SECRET_KEY=***`.
3. **Use different secrets for development and production.** Your live JWT secret must not be `password123`.
4. **On Render/Vercel**, set env vars in the dashboard — do not upload `.env` files.
5. **If you accidentally push secrets**, rotate them immediately — new JWT secret, new API keys, new OAuth credentials. Assume they are compromised.

### Common `.env` mistakes vibe coders make

| Mistake | What happens | Fix |
|---------|--------------|-----|
| Forgot `dotenv` on backend | `process.env.JWT_SECRET` is undefined, auth silently fails | `require('dotenv').config()` at top of `index.js` |
| Wrong `FRONTEND_URL` | Google login redirects to wrong domain after auth | Match exact URL including `http` vs `https`, no trailing slash |
| Secret in frontend `VITE_` var | Anyone can open DevTools and steal your key | Move secret to backend only |
| Committed `.env` once | Bots scan GitHub for keys within minutes | Rotate all secrets, use `git filter` or delete repo if needed |
| Typo in variable name | `MONGODB_URL` vs `MONGODB_URI` — app cannot connect | Copy exact names from your code |

### Quick env audit before every push

Run this checklist:

- [ ] `.env` is in `.gitignore`
- [ ] `git status` does not list `.env`
- [ ] No API keys hardcoded in `.jsx` or `.js` files
- [ ] Frontend only has `VITE_` variables
- [ ] Backend has `JWT_SECRET`, `MONGODB_URI`, and service keys

If any box fails, **stop and fix before you push.**

---

## Do Not Blindly Accept AI Output

Chapter 3 taught you to develop judgment. Chapter 6 gave you pre-written prompts. Chapter 8 adds the rule that saves MERN projects:

**Before you accept a Cursor diff, ask: "Does this match MY architecture?"**

AI does not know your stack unless you tell it — and even when you tell it, it sometimes "helpfully" introduces something else.

### Architecture drift — what AI sneaks in

| You are building (MERN) | AI might wrongly introduce | Why it breaks your project |
|-------------------------|----------------------------|----------------------------|
| React + Vite | Next.js App Router | Different file structure, routing, deployment |
| Express + Mongoose | Firebase, Supabase | Completely different auth and database |
| MongoDB | PostgreSQL + Prisma | Different schema, queries, hosting |
| Passport Google OAuth | NextAuth, Clerk, Auth0 | Different setup, env vars, callbacks |
| Tailwind CSS | styled-components, MUI | Mixed styling systems, bundle bloat |
| Flutterwave | Stripe only | Wrong payment flow for Naira projects |
| Axios + REST | GraphQL + Apollo | Overkill, different patterns |
| `localStorage` JWT | HttpOnly cookies (fine) or session in Redux Persist (messy) | Inconsistent auth state |

None of these are "bad" technologies. They are **wrong for your project** if you already started with MERN.

### The review habit — 60 seconds that saves 6 hours

After every AI generation:

1. **Scan new packages** in `package.json` — did it install something you did not ask for?
2. **Scan new folders** — did it create `app/` (Next.js) inside your Vite project?
3. **Scan imports** — are files importing Firebase, Prisma, or `@supabase/supabase-js`?
4. **Ask one sentence:** *"Explain what you changed and why it fits Express + React + MongoDB."*
5. **Run the app** — does the feature work, not just compile?

If something does not belong, tell Cursor:

*"Remove Firebase. We use MongoDB with Mongoose. Refactor this to match our existing Express backend in `my-store-api/`."*

### Constraint prompt — use this every session

Paste this at the start of a build session or when AI drifts:

```
Architecture constraints — do not deviate:
- Frontend: React 18 + Vite + Tailwind CSS
- Backend: Node.js + Express + Mongoose
- Database: MongoDB Atlas
- Auth: Google OAuth (Passport) + JWT in localStorage
- Payments: Flutterwave (verify on server)
- No Next.js, no Firebase, no Supabase, no Prisma, no Stripe unless I ask
Match existing folder structure. One feature at a time.
```

This one block prevents most architecture accidents.

---

## Auth — What You Must Understand (Not Just Copy)

Chapter 2 named the tools. Chapter 6 has auth prompts. Here is how auth **actually works** so you are not vibe coding blind.

### Authentication vs authorization

| Term | Question it answers | Example |
|------|---------------------|---------|
| **Authentication** | Who is this user? | Google login proves identity |
| **Authorization** | What can this user do? | Admin can edit products; user cannot |

Login is authentication. Blocking non-admins from `/admin` is authorization.

### Google Sign-In flow — step by step

This is the flow Royal Prince Hub uses:

```
1. User clicks "Continue with Google" on React frontend
2. Browser redirects to backend: GET /api/auth/google
3. Backend redirects to Google consent screen
4. User approves → Google redirects to: /api/auth/google/callback
5. Backend (Passport) reads Google profile, finds or creates User in MongoDB
6. Backend signs a JWT with JWT_SECRET, sends token to frontend
7. Frontend stores token in localStorage
8. Frontend sends token on every API request: Authorization: Bearer <token>
9. Backend middleware (authenticateToken) verifies JWT before protected routes
```

If any step is misconfigured — wrong callback URL, missing `GOOGLE_CLIENT_SECRET`, typo in `FRONTEND_URL` — login "almost works" and then fails silently.

### JWT — the digital ID card

After login, the server gives the user a **JWT**. Your backend creates it like this:

```javascript
jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' })
```

Your middleware verifies it on protected routes:

```javascript
jwt.verify(token, process.env.JWT_SECRET)
```

**What you must know as a vibe coder:**

- If `JWT_SECRET` changes, every user is logged out
- If `JWT_SECRET` is weak or public, anyone can forge tokens
- JWT in `localStorage` is standard for this stack — but XSS attacks can steal it; never inject untrusted HTML into your app
- Expired tokens return 403 — frontend should clear storage and redirect to login

### Middleware — the security guard

On the backend, routes that need protection use middleware **before** the controller runs:

```javascript
router.get('/admin/books', authenticateToken, authorizeAdmin, getBooks)
```

Order matters: `authenticateToken` first (who are you?), then `authorizeAdmin` (are you allowed?).

**Vibe coding mistake:** AI creates the admin route but forgets middleware. Anyone can hit `/api/admin/products` with Postman and delete your catalog. **Always check protected routes have `authenticateToken`.**

### User roles — keep them simple

Royal Prince Hub uses roles like `user`, `admin`, and extended roles for specific features. For your store, start with two:

| Role | Can do |
|------|--------|
| `user` | Browse, cart, checkout, view own orders |
| `admin` | CRUD products, view orders, dashboard |

Store role on the User document in MongoDB. Check role in middleware — not on the frontend alone. **Frontend hiding the Admin link is UX. Backend blocking the route is security.**

### Google Cloud Console — what you configure

When you set up Google OAuth, you need:

1. **OAuth Client ID** and **Client Secret** → backend `.env`
2. **Authorized redirect URI** → must exactly match `GOOGLE_CALLBACK_URL`
   - Dev: `http://localhost:5000/api/auth/google/callback`
   - Prod: `https://your-api.onrender.com/api/auth/google/callback`
3. **Authorized JavaScript origins** → your frontend URL(s)

Mismatch by one character = login broken. Copy-paste URLs. Do not guess.

### Auth debug prompts for Cursor

When login fails:

*"Google OAuth redirect fails after login. My GOOGLE_CALLBACK_URL is [X]. My FRONTEND_URL is [Y]. Backend is Express + Passport. Walk through the redirect chain and list what to check."*

When admin routes are open:

*"Review all routes in [file]. List which ones lack authenticateToken or authorizeAdmin. Fix any protected route that is public."*

---

## Payments — The Rule You Cannot Vibe Code Away

Flutterwave on the frontend opens the payment modal with your **public key**. That is fine.

**Verification must happen on the backend** with your **secret key**:

1. Frontend sends transaction reference to your API after payment
2. Backend calls Flutterwave verify endpoint with secret key
3. Only if Flutterwave confirms `successful` → save order, grant access

**Never** trust the frontend alone. A user can fake a "payment successful" response in browser DevTools.

Same pattern as Royal Prince Hub: public key in React, secret key in Express, verification in `paymentController`.

---

## Other Things Chapter 2 Mentioned — Now You Need Them

When you vibe code past a landing page, these show up. Chapter 1 and 2 named them. Here is what to watch for.

### CORS — when frontend and backend are on different ports

Local dev: React on `localhost:5173`, API on `localhost:5000`. Browser blocks cross-origin requests unless Express enables CORS.

**Symptom:** API works in Postman but fails in browser with CORS error.

**Fix:** Backend `cors` middleware with `origin: process.env.FRONTEND_URL`.

AI sometimes hardcodes `http://localhost:3000` — wrong port for Vite. Match **your** frontend URL.

### MongoDB Atlas — connection string safety

`MONGODB_URI` contains username and password. Backend only. Never frontend.

**Symptom:** `MongooseServerSelectionError` — wrong URI, IP not whitelisted in Atlas, or forgot `dotenv`.

In Atlas → Network Access → allow your IP (or `0.0.0.0/0` for early dev only — tighten later).

### Cloudinary — image uploads

If AI adds image upload, it often uses Cloudinary. Keys go in **backend** `.env`:

```
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

Frontend uploads through **your API** — not with the secret key directly.

### Email — Mailtrap vs production

In development, Mailtrap catches emails in a sandbox so you do not spam real users. Welcome emails, order confirmations — test there first.

Do not vibe code `nodemailer` with your personal Gmail password in `.env` and commit it. Use Mailtrap tokens.

### Socket.IO — real-time features

If you add live features (chat, collaborative boards), AI may add Socket.IO. Fine — but it is another layer: CORS, auth on socket connection, separate client setup. Do not add it to a landing page "just because." Add it when the feature needs real-time.

### API base URL — frontend must know where backend lives

Royal Prince Hub pattern:

```javascript
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
```

Production: set `VITE_API_BASE_URL=https://your-api.onrender.com/api` in Vercel env settings.

**Vibe coding mistake:** Hardcoded `localhost:5000` everywhere. Works locally, breaks on deploy.

---

## The Pre-Ship Security Checklist

Before you deploy or share your project with real users, run this list:

### Secrets & env
- [ ] No `.env` in GitHub
- [ ] No secrets in frontend code or `VITE_` vars (except public keys)
- [ ] Production env vars set on Render/Vercel dashboards
- [ ] JWT secret is long and unique

### Auth
- [ ] Google OAuth callback URLs match for dev and prod
- [ ] Protected routes use `authenticateToken`
- [ ] Admin routes use `authorizeAdmin` (or equivalent)
- [ ] Role checks happen on backend, not frontend only

### Payments (if applicable)
- [ ] Payment verification on server with secret key
- [ ] Order saved only after successful verification
- [ ] Test mode vs live mode keys are correct

### Architecture
- [ ] Stack is still MERN — no surprise Firebase/Next.js/Prisma
- [ ] `package.json` has no unused auth/payment libraries from abandoned AI suggestions
- [ ] One clear frontend folder, one clear backend folder

### AI hygiene
- [ ] You can explain what each main file does
- [ ] You read the last five Cursor diffs before pushing
- [ ] Errors are fixed — not ignored with "it works on my machine"

---

## When AI Gets It Wrong — Recovery Prompts

Keep these ready:

**Wrong stack introduced:**
*"You added [Firebase/Next.js/Prisma]. Remove it. Refactor to Express + Mongoose + React/Vite. Keep the same UI behavior."*

**Secrets in frontend:**
*"This exposes a secret key in the client. Move verification to the backend. Frontend should only call our API."*

**Auth route unprotected:**
*"Add authenticateToken and authorizeAdmin to every admin route in this file. Show me the diff."*

**Env not loading:**
*"process.env.X is undefined at runtime. Check dotenv setup, variable spelling, and where .env file should live."*

**Architecture audit:**
*"Review this repo structure. List anything that does not match MERN stack conventions and suggest fixes."*

---

## How This Connects to Deployment

Chapter 9 covers **deployment** — Vercel for frontend, Render for backend, environment variables in production, going live. Chapters 10–14 cover backend anatomy, debugging, admin, custom domains, and your growth path.

But deployment magnifies every mistake in this chapter:

- Committed `.env` → exposed secrets on a public repo
- Wrong callback URL → Google login works locally, fails in production
- Missing CORS → API works in Postman, broken for real users
- No payment verification → anyone gets free products

**Build smart now. Deploy confidently next.**

---

## Conclusion

Vibe coding is how you move fast. **Reviewing, verifying, and protecting secrets** is how you move fast without destroying your own project.

You do not need to memorize every line of Passport or JWT. You do need to know:

- **Secrets stay in backend `.env`** — never GitHub, never Cursor chat
- **Do not accept AI output blindly** — check for wrong stack, wrong ports, missing middleware
- **Auth is a chain** — Google → callback → JWT → middleware → roles
- **Payments verify on the server** — always
- **Frontend env is public** — only `VITE_` and only safe values

You are not trying to become a security engineer overnight. You are trying to **not get caught by the obvious traps** that trip every beginner who vibe codes their first full-stack app.

Build wild. Build a lot. But build with your eyes open.

---

### Action Points

1. **Audit your project `.env` today** — confirm `.gitignore`, no secrets in frontend, run `git status` and verify `.env` is not listed.

2. **Save the Architecture Constraints prompt** from this chapter in a `CURSOR_RULES.md` file in your project root — paste it at the start of every session.

3. **Trace the Google login flow** on paper — write all 9 steps from this chapter and label which URL and env var each step uses.

4. **Review every admin API route** — confirm `authenticateToken` and role middleware are present; fix any that are open.

5. **Search your codebase for hardcoded secrets** — look for `sk_`, `secret`, `password`, `mongodb+srv` in `.jsx` and `.js` files outside `.env`.

6. **Before your next Cursor prompt**, read the diff before clicking Accept — scan `package.json` for unexpected packages.

7. **If you have payments**, confirm verification happens in a backend controller — not only in the React success callback.

8. **Complete the Pre-Ship Security Checklist** before deploying — Chapter 9 assumes you have.
