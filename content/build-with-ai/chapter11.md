# Chapter 11: When Things Break — Debug Like a Builder

> "Every developer you admire has stared at a red error at 2 AM. The difference is they know what to do next." — Royal Prince

Chapter 3 introduced the Debug pattern. Chapter 6 told you to paste errors into Cursor. Chapter 8 warned about silent auth failures.

**This chapter is your field manual.** The errors that make beginners quit — terminal red text, blank white pages, CORS blocks, login loops, deploy failures — collected in one place with **what they mean** and **exactly what to do**.

You will still break things. That is normal. What changes is how fast you recover.

---

## The Debug Mindset — Before You Touch Code

When something breaks, resist panic and resist random changes. Follow this order **every time**:

1. **Read the full error** — first line and last line often matter most
2. **Reproduce it** — what exact action triggers it?
3. **Check the obvious** — server running? Right folder? `.env` loaded?
4. **Copy error + context into Cursor** — use the template below
5. **Apply one fix at a time** — test after each change
6. **Log what worked** — add to `BUILD_LOG.md`

### The universal Cursor debug prompt

```
I get this error:
[paste FULL error]

What I was doing:
[one sentence]

What I expected:
[one sentence]

Stack: React + Vite + Tailwind frontend, Express + Mongoose backend, MongoDB Atlas.
Relevant file: [path if you know it]
```

Do not skip steps. AI guesses wrong when you paste half an error.

---

## Category 1: Terminal Errors (Backend / npm)

### `EADDRINUSE: address already in use :::5000`

**Meaning:** Something is already running on port 5000.

**Fix:**
- Close the other terminal running your backend, or
- Kill the process, or
- Change `PORT=5001` in `.env` and update frontend API URL

### `Cannot find module 'express'` (or any package)

**Meaning:** Dependencies not installed in **this** folder.

**Fix:**
```bash
cd my-store-api
npm install
```

Verify you are in the folder that has `package.json`.

### `MongooseServerSelectionError` / `MongoNetworkError`

**Meaning:** Backend cannot reach MongoDB.

**Checklist:**
- [ ] `MONGODB_URI` correct in `.env`?
- [ ] `dotenv.config()` at top of server file?
- [ ] MongoDB Atlas → Network Access → your IP whitelisted?
- [ ] Password in URI URL-encoded (special chars)?

### `JWT_SECRET is undefined` / auth throws on verify

**Meaning:** Env not loaded or wrong variable name.

**Fix:** Confirm `JWT_SECRET=...` in backend `.env`, restart server after changes.

### `SyntaxError: Unexpected token`

**Meaning:** JavaScript syntax broken — often after bad AI edit, missing bracket, or wrong import.

**Fix:** Click the file and line number in the error. Read that line and 5 lines above. Ask Cursor to fix syntax in that file only.

---

## Category 2: Browser Errors (Frontend)

### Blank white page

**Meaning:** React crashed before render — JavaScript error.

**Fix:**
1. Open DevTools → **Console** tab (F12)
2. Copy red error message
3. Often: wrong import path, undefined variable, missing provider

**Common cause:** Router used outside `BrowserRouter`, or component throws on first render.

### `Failed to fetch` / `Network Error`

**Meaning:** Frontend cannot reach backend.

**Checklist:**
- [ ] Backend running on `localhost:5000`?
- [ ] `VITE_API_BASE_URL` correct?
- [ ] CORS configured with your frontend URL?

### CORS error in console

**Exact message often says:** `Access to XMLHttpRequest blocked by CORS policy`

**Meaning:** Backend rejected request from your frontend origin.

**Fix:** Backend `cors` must include `http://localhost:5173` (Vite) or your Vercel URL in production. Check `FRONTEND_URL` in backend `.env`.

AI often hardcodes `localhost:3000` — wrong for Vite.

### `401 Unauthorized`

**Meaning:** Protected route — no token, expired token, or invalid JWT.

**Fix:**
- Log in again
- Check `localStorage.getItem('token')`
- Confirm `Authorization: Bearer` header sent (AuthContext pattern)
- Verify `JWT_SECRET` has not changed since token was issued

### `403 Forbidden`

**Meaning:** Logged in but not allowed — e.g. user hitting admin route.

**Fix:** Check user `role` in database. Admin routes need `role: 'admin'`.

### `404 Not Found` on API call

**Meaning:** Route does not exist or wrong URL.

**Fix:**
- Compare axios path to backend route (`/books` vs `/api/books`)
- Check `axios.defaults.baseURL` includes `/api`
- Verify route registered in `server.js`

---

## Category 3: Auth & Login Loops

### Google login redirects then fails

**Checklist:**
- [ ] `GOOGLE_CALLBACK_URL` matches Google Cloud Console **exactly**
- [ ] `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in backend `.env`
- [ ] Production: callback uses `https://your-api.onrender.com/api/auth/google/callback`
- [ ] `FRONTEND_URL` matches where React runs after redirect

### Infinite redirect between login and home

**Meaning:** Token stored but profile fetch fails — or role redirect logic conflict.

**Fix:** Check Network tab → `/api/auth/profile` response. Fix backend error first, then frontend redirect logic.

### "Logged in" but admin page blocked

**Meaning:** Frontend auth works, role wrong, or `AdminRoute` blocking.

**Fix:** MongoDB → users collection → set your user's `role` to `admin` for testing. Never do this in production without proper admin promotion flow.

---

## Category 4: Payment & Data Issues

### Payment succeeds in modal but order not saved

**Meaning:** Frontend showed success without server verification.

**Fix:** Confirm backend `POST /api/payment/verify` runs with Flutterwave secret key. Order should only save after server confirms.

### Images not loading

**Checklist:**
- [ ] URL is full `https://` path
- [ ] Cloudinary upload returned URL stored in MongoDB
- [ ] Not pointing to `localhost` image path in production

### Empty shop page but API returns data

**Meaning:** Frontend mapping wrong — e.g. `response.data` vs `response.data.products`.

**Fix:** `console.log(response.data)` in fetch handler. Match property names to what API returns.

---

## Category 5: "Works Locally, Broken Live"

The most frustrating category. Chapter 9 deploys; this section fixes production.

| Symptom | Likely cause | Fix |
|---------|--------------|-----|
| Frontend loads, no data | Wrong `VITE_API_BASE_URL` on Vercel | Set to `https://your-api.onrender.com/api`, redeploy |
| API 502/503 | Render service sleeping or crashed | Check Render logs, verify start command |
| Auth works local, fails live | Callback URL still localhost | Update Google Console + Render env vars |
| CORS live only | `FRONTEND_URL` missing Vercel domain | Add `https://your-app.vercel.app` to CORS |
| Env undefined on Render | Var not set in dashboard | Add each key manually — `.env` is not uploaded |
| MongoDB fails live | Atlas IP whitelist | Allow `0.0.0.0/0` or Render's IPs |

### Production debug prompt

```
My app works on localhost but fails in production.

Frontend URL: [vercel url]
Backend URL: [render url]
Error: [paste browser console or network tab]

Check CORS, env vars, and API base URL for MERN stack.
```

---

## DevTools — Your X-Ray Machine

Learn these four tabs:

| Tab | Use for |
|-----|---------|
| **Console** | JavaScript errors, `console.log` output |
| **Network** | API calls — status codes, response bodies, failed requests |
| **Application** | `localStorage` token, cookies |
| **Elements** | CSS/layout issues (less common for total breakage) |

**Network tab workflow:**
1. Reproduce the bug
2. Find the red failed request
3. Click it → Response tab
4. Paste status + response body into Cursor

---

## When AI Fixes Make Things Worse

Signs you are in an AI spiral:

- Same error after three "fixes"
- AI keeps adding new packages
- File count doubled overnight

**Stop. Roll back.**

```bash
git status
git diff
git checkout -- path/to/file
```

Or revert last commit. Then paste **one** error with the debug template. Ask for **smallest possible fix**.

Tell Cursor: *"Do not add new libraries. Fix only [specific file]. Explain what you changed."*

---

## Error Cheat Sheet — Pin This

| Error / Symptom | First thing to check |
|-----------------|----------------------|
| Red terminal on `npm run dev` | Full error text, missing `npm install` |
| White screen | DevTools Console |
| CORS | Backend origin list + Vite port 5173 |
| 401 | Token in localStorage + JWT_SECRET |
| 403 | User role + middleware |
| 404 API | URL path + route registration |
| 500 server | Backend terminal logs — Mongoose/typo |
| MongoDB connect | MONGODB_URI + Atlas whitelist |
| Login redirect fail | GOOGLE_CALLBACK_URL |
| Live broken | Vercel/Render env vars |

---

## Conclusion

Debugging is a skill — not a talent. You get faster by seeing the same errors repeatedly and knowing the checklist.

You will spend hours debugging in your career. AI makes it faster, not optional. **Read the error. Check the obvious. Paste context. Fix one thing. Test.**

The developers who win are not the ones who never break code. They are the ones who **recover before they quit.**

---

### Action Points

1. **Bookmark this chapter** — open it the next time you see a red error instead of closing the laptop.

2. **Practice DevTools today** — break something on purpose (stop backend), watch Network tab fail, restart, watch it succeed.

3. **Save the universal debug prompt** in `CURSOR_RULES.md` next to your architecture constraints.

4. **Log your last 3 errors** in `BUILD_LOG.md` with cause and fix — build your personal cheat sheet.

5. **Before asking for help**, run the checklist for your error category — then paste what you tried.

6. **After every deploy**, test login, one API call, and one protected route — catch live-only bugs early.
