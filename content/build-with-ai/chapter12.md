# Chapter 12: Admin Dashboard — Manage What You Built

> "A store you cannot manage is a store you cannot grow." — Royal Prince

You built a shop in Chapter 6 Track 3. Customers can browse and buy. But **who adds products?** Who sees orders? Who changes prices?

The **admin dashboard** — the private control panel only you (or your team) can access.

Royal Prince Hub has a full admin area: books, analytics, finance, traffic, workboards. You do not need all of that on day one. You need the **core pattern**: protected routes, admin layout, CRUD tables, and forms that talk to protected API endpoints.

This chapter teaches that pattern so you are not vibe coding admin blind.

---

## What an Admin Dashboard Is

| Public site | Admin dashboard |
|-------------|-----------------|
| Anyone can visit | Only authorized roles |
| Browse & buy | Create, edit, delete |
| Marketing design | Utility design — tables, forms, stats |
| `/shop`, `/` | `/admin`, `/admin/products` |

Think of it as the **back office** — customers never need to see it, but you cannot run the business without it.

---

## The Three Layers of Admin Security

Admin must be protected at **three levels**. Missing any one is a vulnerability.

### Layer 1 — Frontend route guard

Royal Prince Hub uses `AdminRoute.jsx`:

```javascript
// Simplified pattern
if (!isAuthenticated) return <Navigate to="/login" />;
if (user.role !== 'admin') return <Navigate to="/dashboard" />;
return children;
```

This hides the UI from normal users. **This is not enough alone** — anyone can call your API directly.

### Layer 2 — Backend middleware

Every admin API route:

```javascript
router.get('/books', authenticateToken, authorizeAdmin, getAdminBooks);
router.post('/books', authenticateToken, authorizeAdmin, createBook);
```

Even if someone bypasses React, the server rejects them with `403`.

### Layer 3 — Database role

User document has `role: 'admin'`. Promote users carefully — never expose a "make me admin" button on the public site.

**Rule:** Frontend guard for UX. Backend middleware for security. Always both.

---

## Admin Layout — Consistent Shell

Admin pages share a **layout wrapper** — sidebar, header, content area.

Royal Prince Hub pattern (`AdminLayout.jsx`):

- **Sidebar** — links to Overview, Books, Analytics, etc.
- **Hero strip** — page title, short description, key stats
- **Content area** — tables, forms, charts

You do not need a beautiful admin UI. You need a **clear** one:

- Tables with sortable columns
- "Add new" button top-right
- Edit / Delete actions per row
- Loading and error states

Ask Cursor:

*"Create AdminLayout with sidebar links for Dashboard, Products, Orders. Match Tailwind style of my storefront. Include outlet for nested routes."*

---

## Core Admin Features for Your Store

Start with these four. Ship before adding extras.

### 1. Product management (CRUD)

| Action | Admin UI | API |
|--------|----------|-----|
| List products | Table with title, price, stock | `GET /api/admin/products` |
| Add product | Form → submit | `POST /api/admin/products` |
| Edit product | Pre-filled form | `PUT /api/admin/products/:id` |
| Delete product | Confirm dialog | `DELETE /api/admin/products/:id` |

Royal Prince Hub equivalent: `AdminBooks.jsx` fetches `GET /admin/books`, shows stats (total, published, revenue).

### 2. Order list

Read-only table at first:

- Order ID, customer email, total, status, date
- `GET /api/admin/orders`

Expand later with status updates (`shipped`, `refunded`).

### 3. Overview / stats

Simple counts on dashboard home:

- Total products
- Orders this week
- Revenue (sum of paid orders)

No fancy charts required initially — numbers in cards are enough.

### 4. Image upload (Cloudinary)

Admin product form includes image upload:

- Frontend sends file to **your backend**
- Backend uploads to Cloudinary with secret credentials
- Saves returned URL in product document

Never upload to Cloudinary directly from browser with secret key (Chapter 8).

---

## Routing Structure

Typical React Router setup:

```
/admin                    → AdminOverview (stats)
/admin/products           → AdminProductList
/admin/products/new       → AdminProductForm
/admin/products/:id/edit  → AdminProductForm
/admin/orders             → AdminOrderList
```

Wrap all `/admin/*` routes:

```javascript
<Route path="/admin/*" element={
  <AdminRoute>
    <AdminRoutes />
  </AdminRoute>
} />
```

---

## Admin Cursor Prompts (Track 3 Phase 7+)

**Scaffold admin:**
```
Create admin section for my MERN store:
- AdminRoute component (JWT + role admin)
- AdminLayout with sidebar
- Routes: /admin, /admin/products, /admin/orders
- Backend routes under /api/admin with authenticateToken + authorizeAdmin
Match existing Product model. Do not use Firebase.
```

**Product table:**
```
Admin products page: fetch GET /api/admin/products, table with title, price, status, Edit and Delete buttons. Tailwind. Loading and error states.
```

**Seed first admin:**
```
Script or endpoint instruction to set user role admin by email in MongoDB for development only.
```

For production, promote admins manually in database or through a secure internal tool — never a public signup flag.

---

## What Royal Prince Hub Admin Includes

Use this as inspiration — not day-one requirements:

| Module | Purpose |
|--------|---------|
| `AdminOverview` | High-level stats |
| `AdminBooks` | Catalog + sales per book |
| `AdminFinance` | Revenue tracking |
| `AdminTraffic` | Page views / analytics |
| `AdminWorkboard` | Internal task tools |

Your first admin can be **one page + product CRUD**. Add modules as you grow.

Open `frontend/src/components/Admin/` in this repo after building yours. Compare patterns.

---

## Common Admin Mistakes

| Mistake | Risk | Fix |
|---------|------|-----|
| Admin UI only, API public | Anyone deletes products via Postman | Add middleware on every admin route |
| No loading state | Double-submit creates duplicates | Disable button while saving |
| Delete without confirm | Accidental data loss | Modal: "Are you sure?" |
| Hardcoded admin email in frontend | Bypassable | Check role on server from JWT |
| Edit form missing validation | Bad data in MongoDB | Validate price > 0, title required |

---

## Conclusion

An admin dashboard turns a demo store into a **business you control**. Protect it at frontend and backend. Start with product CRUD and orders list. Make it clear, not pretty.

When you finish Track 3 Phase 7, you should log in as admin, add a product, see it on `/shop`, and view the order after test checkout.

That is full-stack ownership.

---

### Action Points

1. **Implement AdminRoute + AdminLayout** before building admin pages — shell first.

2. **Verify every `/api/admin/*` route** has `authenticateToken` and `authorizeAdmin`.

3. **Build product CRUD** — list, add, edit, delete — before analytics or charts.

4. **Promote your test user to admin** in MongoDB and log in — confirm non-admin users get redirected.

5. **Compare your admin to `AdminBooks.jsx`** in Royal Prince Hub — what one feature could you add next?

6. **Test admin with Postman** — call admin API without token → expect 401. As user role → expect 403.
