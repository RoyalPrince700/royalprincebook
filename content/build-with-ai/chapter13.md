# Chapter 13: Custom Domain & Cloudflare — Look Professional Online

> "A live URL is proof you built something. A custom domain is proof you are serious." — Royal Prince

Chapter 9 got you live on `my-store.vercel.app` and `my-store-api.onrender.com`. That is enough to learn, demo, and share with friends.

But when you send a link to a client, investor, or employer, **`yourname.com` hits different** than a free subdomain.

This chapter teaches **custom domains** and **Cloudflare** — how to point your name at Vercel and Render, fix auth callbacks for production, and add the professional layer Royal Prince Hub uses.

You do not need this on day one. You need it when you are ready to look like a real business.

---

## What Changes When You Add a Domain

| Free hosting URL | Custom domain |
|------------------|---------------|
| `my-store.vercel.app` | `shop.yourname.com` or `yourname.com` |
| `my-api.onrender.com` | `api.yourname.com` |
| Looks like a project | Looks like a product |
| Fine for learning | Expected for clients |

You will update:

- DNS records (where the name points)
- Vercel domain settings (frontend)
- Render custom domain (backend)
- Google OAuth authorized URLs
- `FRONTEND_URL`, `BACKEND_URL`, `GOOGLE_CALLBACK_URL` env vars
- CORS allowed origins

Miss one and login breaks in production while the homepage still loads. Plan the updates together.

---

## The Architecture — Who Does What

```
User types yourname.com
        │
        ▼
   Cloudflare (optional but recommended)
   — DNS, SSL, caching, security
        │
        ▼
   Vercel — serves React frontend
        │
        │  API calls to api.yourname.com
        ▼
   Render — runs Express backend
        │
        ▼
   MongoDB Atlas — database
```

| Service | Role |
|---------|------|
| **Domain registrar** | Where you buy the name (Namecheap, GoDaddy, etc.) |
| **Cloudflare** | DNS manager + security layer in front |
| **Vercel** | Hosts frontend static files |
| **Render** | Hosts Node backend 24/7 |

Chapter 2 introduced Cloudflare as the "security guard at the entrance." Here is how to wire it.

---

## Step 1 — Buy a Domain

Popular registrars:

- [Namecheap](https://www.namecheap.com)
- [GoDaddy](https://www.godaddy.com)
- [Porkbun](https://porkbun.com)

Pick something short, easy to spell, `.com` if available. Budget roughly ₦8,000–₦15,000/year depending on registrar and name.

You do not need Cloudflare to buy the domain — buy first, connect Cloudflare second.

---

## Step 2 — Add Domain to Cloudflare

1. Create free account at [cloudflare.com](https://cloudflare.com)
2. **Add a site** → enter `yourname.com`
3. Cloudflare scans existing DNS records
4. Cloudflare gives you **two nameservers** (e.g. `ada.ns.cloudflare.com`)
5. Go to your registrar → replace nameservers with Cloudflare's
6. Wait for propagation (minutes to 48 hours)

Once active, all DNS for your domain is managed in Cloudflare dashboard.

**Why bother?** Free SSL, DDoS protection, fast DNS, easy record management, Page Rules, analytics.

---

## Step 3 — Connect Frontend Domain (Vercel)

In **Vercel** → your project → **Settings → Domains**:

1. Add `yourname.com`
2. Add `www.yourname.com` (optional — redirect www to root or vice versa)
3. Vercel shows DNS records to add — usually:
   - `A` record → Vercel IP, or
   - `CNAME` → `cname.vercel-dns.com`

In **Cloudflare DNS**, add those records:

| Type | Name | Content | Proxy |
|------|------|---------|-------|
| CNAME | `@` or `www` | `cname.vercel-dns.com` | Proxied (orange cloud) |

Vercel auto-provisions SSL. Within minutes, `https://yourname.com` serves your React app.

Update **Vercel environment variables:**

```
VITE_API_BASE_URL=https://api.yourname.com/api
```

Redeploy frontend after changing env vars.

---

## Step 4 — Connect Backend Domain (Render)

In **Render** → your web service → **Settings → Custom Domains**:

1. Add `api.yourname.com`
2. Render shows a CNAME target (e.g. `my-store-api.onrender.com`)

In **Cloudflare DNS**:

| Type | Name | Content | Proxy |
|------|------|---------|-------|
| CNAME | `api` | `my-store-api.onrender.com` | DNS only (grey cloud) first* |

*Some teams proxy API through Cloudflare; beginners often use grey cloud for API to avoid WebSocket/socket issues until you know you need proxy.

Update **Render environment variables:**

```
FRONTEND_URL=https://yourname.com
BACKEND_URL=https://api.yourname.com
GOOGLE_CALLBACK_URL=https://api.yourname.com/api/auth/google/callback
CORS_ORIGINS=https://yourname.com,https://www.yourname.com
```

Restart Render service after env changes.

---

## Step 5 — Update Google OAuth

Google Cloud Console → your OAuth client → **Authorized redirect URIs**:

Add:

```
https://api.yourname.com/api/auth/google/callback
```

**Authorized JavaScript origins:**

```
https://yourname.com
```

Remove localhost entries only when you no longer need local dev with that client — or keep both dev and prod URIs in the same client for simplicity during learning.

Mismatch here = login works on Vercel subdomain but fails on custom domain.

---

## Step 6 — CORS & Auth Checklist

After domain switch, test in this order:

- [ ] `https://yourname.com` loads frontend
- [ ] `https://api.yourname.com/api/health` returns JSON
- [ ] Shop page fetches products (Network tab — no CORS error)
- [ ] Google login completes and returns to yourname.com
- [ ] Admin routes work for admin user
- [ ] Test payment in Flutterwave test mode (if applicable)

If CORS fails, backend must allow `https://yourname.com` — not just the old `.vercel.app` URL.

---

## Cloudflare Extras (When You Are Ready)

### SSL/TLS

Cloudflare → SSL/TLS → set to **Full (strict)** when origin has valid cert (Vercel/Render do).

### Always Use HTTPS

Enable **Always Use HTTPS** redirect in Cloudflare SSL settings.

### Caching (careful on API)

Cache static assets aggressively. **Do not cache** `/api/*` routes — API responses must be fresh.

### Security

- Enable **Bot Fight Mode** (free tier options vary)
- Rate limiting on login routes (paid features) — optional later

---

## Subdomain Strategy

Common professional setup:

| URL | Hosts |
|-----|-------|
| `yourname.com` | Portfolio or main app |
| `shop.yourname.com` | E-commerce (optional split) |
| `api.yourname.com` | Express backend |
| `www.yourname.com` | Redirect to root |

For beginners, **one domain for frontend + api subdomain for backend** is enough.

Royal Prince Hub uses `royalprincehub.com` with the same pattern — frontend on Vercel, API on Render, Cloudflare in front.

---

## Cost Reality (Nigeria Context)

| Item | Typical cost |
|------|--------------|
| Domain (.com) | ~₦8k–₦15k/year |
| Cloudflare | Free tier sufficient to start |
| Vercel | Free tier for personal projects |
| Render | Free tier sleeps; paid ~$7+/month for always-on API |
| MongoDB Atlas | Free tier to start |

A professional presence is cheaper than most people think. **Buy the domain when you are proud of what you built** — not before.

---

## Cursor Prompt After Domain Change

```
I moved my MERN app to custom domain:
Frontend: https://yourname.com (Vercel)
Backend: https://api.yourname.com (Render)

Update CORS, FRONTEND_URL, OAuth callback references, and list env vars I must change on Vercel and Render. Stack: Express + Passport Google OAuth + React Vite.
```

---

## Conclusion

Free URLs prove you can deploy. **Custom domains prove you care how you show up.**

Cloudflare sits in front — managing DNS, SSL, and security. Vercel serves your React app. Render runs your API. Update env vars and OAuth together, test login and API after every DNS change.

You built it. Now put your name on the door.

---

### Action Points

1. **Deploy to free URLs first** (Chapter 9) — do not buy a domain until something is live.

2. **When ready**, buy one domain and map it to Vercel before touching Cloudflare extras.

3. **Write down every env var** that references old URLs before switching — checklist prevents broken auth.

4. **Add Cloudflare** after registrar nameserver switch — manage all DNS in one dashboard.

5. **Test Google login** immediately after domain change — most common failure point.

6. **Screenshot your live custom domain** — add to portfolio (Chapter 14).
