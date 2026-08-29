# Chapter 10: Backend Anatomy — Routes, Models & Data Flow

> "The frontend is what people see. The backend is what makes it real." — Royal Prince

Chapter 5 taught you **frontend anatomy** — navbar, hero, cards, forms. You could see those parts in the browser.

This chapter teaches **backend anatomy** — the parts users never see but every full-stack app depends on: **models**, **routes**, **controllers**, and the **data flow** between MongoDB, Express, and React.

If you are vibe coding Track 3 in Chapter 6, read this chapter **before Phase 3** (backend API). It will stop you from accepting AI files you do not understand.

---

## Why You Need This Chapter

Beginners often build beautiful React UIs that fetch nothing — or worse, fetch from the wrong place because they never learned how the backend is structured.

You do not need to memorize every line of Express. You **do** need to recognize:

- Where data lives (MongoDB)
- How data is shaped (Mongoose models/schemas)
- How the frontend asks for data (HTTP routes)
- Who handles the logic (controllers)
- Who blocks unauthorized access (middleware)

Once you see this pattern once, you see it everywhere — including Royal Prince Hub.

---

## The Restaurant Analogy — Backend Edition

Chapter 1 compared web apps to a restaurant. Here is the backend kitchen:

| Restaurant | Backend | What it does |
|------------|---------|--------------|
| **Pantry / storage** | MongoDB | Stores ingredients (data) |
| **Recipe book** | Mongoose schema | Defines what a "dish" (document) looks like |
| **Order window** | API routes (`/api/books`) | Where orders (requests) arrive |
| **Chef** | Controller | Reads order, prepares food (logic), responds |
| **Security guard** | Middleware | Checks ID before chef starts (`authenticateToken`) |

The **waiter** is your React frontend — takes the customer's request, brings it to the kitchen, returns the plate (JSON data) to the table (browser).

---

## MongoDB & Mongoose — Where Data Lives

**MongoDB** is your database — cloud storage for documents (JSON-like records).

**Mongoose** is the library that lets Node.js talk to MongoDB with **schemas** and **models**.

### What is a schema?

A schema defines the **shape** of one record. Example from Royal Prince Hub — a Book:

```javascript
// Simplified from backend/models/Book.js
const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  price: { type: Number, default: 0 },
  coverImage: String,
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft'
  }
}, { timestamps: true });
```

**Plain English:**

- Every book **must** have a `title`
- `price` defaults to `0` if missing
- `status` can only be `draft` or `published`
- `timestamps: true` auto-adds `createdAt` and `updatedAt`

### What is a model?

A **model** is the schema turned into a usable object:

```javascript
module.exports = mongoose.model('Book', bookSchema);
```

Now you can do:

```javascript
await Book.find();                    // get all books
await Book.findById(id);              // get one book
await Book.create({ title: '...' });  // create new book
await Book.findByIdAndUpdate(id, {}); // update
await Book.findByIdAndDelete(id);     // delete
```

That is **CRUD** — Create, Read, Update, Delete. Every app you build uses CRUD.

### User model — auth connects here

Your User document stores who logged in:

```javascript
// Simplified from backend/models/User.js
{
  username: String,
  email: String,
  googleId: String,
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  purchasedBooks: [{ type: ObjectId, ref: 'Book' }]
}
```

When someone buys a book, their `purchasedBooks` array gets the book's ID. When they hit `/api/auth/profile`, the backend reads this document and sends it to React.

---

## Express Routes — The Order Window

Routes map **URLs + HTTP methods** to handler functions.

Royal Prince Hub mounts routes in `backend/index.js`:

```javascript
app.use('/api/auth', require('./routes/auth'));
app.use('/api/books', require('./routes/books'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/payment', require('./routes/payment'));
```

| Route prefix | Purpose |
|--------------|---------|
| `/api/auth` | Login, profile, Google OAuth |
| `/api/books` | Public book catalog |
| `/api/admin` | Admin-only management |
| `/api/payment` | Flutterwave verify + orders |

Inside `routes/books.js` you will see patterns like:

```javascript
router.get('/', getAllBooks);           // GET /api/books
router.get('/:id', getBookById);        // GET /api/books/abc123
router.post('/', authenticateToken, createBook);  // protected create
```

### HTTP methods — what they mean

| Method | Action | Example |
|--------|--------|---------|
| **GET** | Read data | List all products |
| **POST** | Create data | Add new product |
| **PUT/PATCH** | Update data | Edit product price |
| **DELETE** | Remove data | Delete product |

When your React code runs `axios.get('/books')`, it is hitting a **GET** route. `axios.post('/books', data)` hits **POST**.

---

## Controllers — The Chef

**Routes** say *what URL* triggers logic. **Controllers** contain the logic.

Example flow — get all books:

```
1. Browser: axios.get('/api/books')
2. Route: router.get('/', getAllBooks)
3. Controller getAllBooks():
   - Book.find() in MongoDB
   - res.json({ books: result })
4. React receives JSON → maps to product cards
```

Controller responsibilities:

- Query or update MongoDB
- Validate input (is price a number?)
- Return JSON responses
- Call `next(error)` or return status codes (`404`, `403`, `500`)

**Vibe coding tip:** When AI creates a route file, open the controller it imports. If there is no controller and everything is crammed in the route file, ask AI to split it — routes stay thin, controllers hold logic.

---

## Middleware — The Security Guard

Middleware runs **before** the controller on protected routes (Chapter 8 covered this — here is the structural view):

```javascript
router.delete('/:id', authenticateToken, authorizeAdmin, deleteBook);
//                      ↑ step 1              ↑ step 2         ↑ step 3
```

1. `authenticateToken` — valid JWT? Set `req.user`
2. `authorizeAdmin` — is `req.user.role === 'admin'`?
3. `deleteBook` — only runs if both pass

If step 1 or 2 fails, the controller never runs. The client gets `401` or `403`.

---

## Full Data Flow — Shop Page Example

Here is the complete journey when a user opens `/shop` on your e-commerce app:

```
┌─────────────┐     GET /api/products      ┌─────────────┐
│   React     │ ─────────────────────────► │   Express   │
│  Shop.jsx   │                            │   Route     │
└─────────────┘                            └──────┬──────┘
       ▲                                            │
       │                                            ▼
       │                                     ┌─────────────┐
       │         JSON [{ title, price }]    │ Controller  │
       └──────────────────────────────────── │ Product.find│
                                             └──────┬──────┘
                                                    │
                                                    ▼
                                             ┌─────────────┐
                                             │  MongoDB    │
                                             │  products   │
                                             └─────────────┘
```

**Create product (admin):**

```
Admin form → axios.post('/api/admin/products', body, { headers: Authorization })
→ authenticateToken → authorizeAdmin → controller → Product.create() → MongoDB
→ res.json({ product }) → admin UI refreshes list
```

Draw this on paper once. You will debug faster forever.

---

## Frontend ↔ Backend Connection

Your React app does not talk to MongoDB directly. **Ever.**

```javascript
// frontend — AuthContext pattern from Royal Prince Hub
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
axios.defaults.baseURL = apiBaseUrl;

// Shop page
const response = await axios.get('/books');
setBooks(response.data.books);
```

Rules:

- Frontend uses `VITE_API_BASE_URL` (Chapter 8)
- Backend uses `MONGODB_URI` — never exposed to browser
- All database access goes through Express routes

---

## Folder Structure — What AI Should Create

Standard MERN backend layout (match this in Track 3):

```
my-store-api/
  server.js          ← or index.js — starts Express
  .env               ← secrets
  config/
    passport.js      ← Google OAuth
  models/
    User.js
    Product.js
    Order.js
  routes/
    auth.js
    products.js
    admin.js
  controllers/
    productController.js
    authController.js
  middleware/
    auth.js          ← authenticateToken, authorizeAdmin
```

When AI creates `firebase/` or `prisma/` folders, stop it — wrong architecture (Chapter 8).

---

## Common Backend Patterns in Royal Prince Hub

| Feature | Model | Route | Protected? |
|---------|-------|-------|------------|
| Book catalog | `Book` | `GET /api/books` | Public read |
| User profile | `User` | `GET /api/auth/profile` | JWT required |
| Admin books | `Book` | `GET /api/admin/books` | Admin only |
| Payment verify | `PaymentTransaction` | `POST /api/payment/verify` | JWT + server verify |
| Health check | — | `GET /api/health` | Public |

Open `backend/` in this repo and click through these files after reading this chapter. The names will feel familiar instead of random.

---

## Cursor Prompts for Backend Work

**Create a model:**
*"Create a Mongoose Product model with title, slug, description, price (Number), imageUrl, stock (Number), status enum draft/published. Match patterns in my existing User model."*

**Create CRUD routes:**
*"Add Express routes for products: public GET all and GET by slug, admin POST/PUT/DELETE with authenticateToken and authorizeAdmin middleware."*

**Connect frontend:**
*"Update Shop.jsx to fetch products from GET /api/products instead of mock data in products.js. Show loading and error states."*

---

## Conclusion

Backend anatomy is not magic. It is a repeating pattern:

**Model** (shape of data) → **Route** (URL + method) → **Middleware** (optional guard) → **Controller** (logic) → **MongoDB** → **JSON back to React**

Chapter 5 let you *see* the frontend. This chapter lets you *see* the kitchen. When you vibe code Phase 3 in Chapter 6, you will know what files should exist and what each one does.

Build the UI. Then build the API that feeds it. That is full-stack.

---

### Action Points

1. **Open `backend/models/Book.js` and `backend/models/User.js`** in Royal Prince Hub — label each field in plain English.

2. **Trace one route** — pick `GET /api/books`, find the route file, controller, and model query.

3. **Draw the shop page data flow** from this chapter on paper before starting Track 3 Phase 3.

4. **Create `models/Product.js`** in your DIY project before asking AI for routes — schema first, routes second.

5. **Ask Cursor:** *"Explain my backend folder structure and which file handles GET /api/products."*

6. **Compare your Track 3 backend** to Royal Prince Hub's `backend/` — same folders? If not, fix before Phase 4.
