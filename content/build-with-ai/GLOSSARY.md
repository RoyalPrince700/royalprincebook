# Glossary — Build with AI

Plain-English definitions for terms used throughout this book. Read this when you see a word you do not recognize.

---

## A

**API (Application Programming Interface)**  
A set of URLs your frontend calls to get or send data. Example: `GET /api/products` returns a list of products as JSON. The API is the "order window" between React and Express.

**Authentication (Auth)**  
Proving *who* a user is — e.g. logging in with Google.

**Authorization**  
Controlling *what* a logged-in user is allowed to do — e.g. only admins can delete products.

**Axios**  
A JavaScript library for sending HTTP requests from React to your backend API.

---

## B

**Backend**  
The server-side code users do not see — logic, security, database access. In this book: Node.js + Express.

**Bearer token**  
How the frontend sends a JWT to the API: `Authorization: Bearer eyJhbG...`

**Browser**  
Chrome, Edge, Firefox, Safari — where users view your website.

**Build**  
Compiling your React app into static files for deployment (`npm run build`).

---

## C

**CORS (Cross-Origin Resource Sharing)**  
Browser security rule: if your frontend (`localhost:5173`) and backend (`localhost:5000`) are on different origins, the backend must explicitly allow the frontend or requests fail.

**Component**  
A reusable piece of UI in React — one file that does one job (Navbar, Hero, BookCard). See Chapter 1.

**Controller**  
Backend function that contains the logic for a route — queries MongoDB, validates input, returns JSON.

**CRUD**  
Create, Read, Update, Delete — the four basic operations on data.

**CSS**  
Styles: colours, fonts, spacing, layout.

---

## D

**Database**  
Where data is stored permanently — users, products, orders. In this book: MongoDB Atlas (cloud).

**Deploy / Deployment**  
Putting your project on the internet so others can visit it — Vercel (frontend), Render (backend).

**Diff**  
The before/after view when Cursor proposes code changes — red = removed, green = added.

**DNS**  
Maps a domain name (`yourname.com`) to a server IP address. Managed in Cloudflare or your registrar.

---

## E

**Environment variables (.env)**  
Secret configuration stored in a file on your machine or in Vercel/Render dashboards — database passwords, API keys. Never commit to GitHub.

**Express**  
Node.js framework for building API routes and middleware.

---

## F

**Frontend**  
What users see and click — built with React in this book.

**Full-stack**  
Working on both frontend and backend.

---

## G

**Git**  
Tracks changes to your code on your computer.

**GitHub**  
Stores your Git repositories online — Vercel and Render pull code from here.

**Google OAuth**  
"Continue with Google" login — Google confirms identity, your backend creates/finds the user.

---

## H

**HTML**  
Structure of a webpage — headings, paragraphs, links, images.

**HTTP methods**  
How requests act on data: **GET** (read), **POST** (create), **PUT/PATCH** (update), **DELETE** (remove).

**HTTPS**  
Secure version of HTTP — encrypted traffic. Vercel and Render provide this automatically.

---

## J

**JSON**  
Text format for data — looks like `{ "title": "My Book", "price": 5000 }`. APIs usually return JSON.

**JSX**  
HTML-like syntax inside JavaScript/React files. Use `className` instead of `class`.

**JWT (JSON Web Token)**  
A secure string the server gives after login — proves the user is authenticated on later requests.

---

## L

**localhost**  
Your own computer acting as a server — `http://localhost:5173` means "this machine, port 5173."

**localStorage**  
Browser storage where the frontend can save a JWT between page refreshes.

---

## M

**Middleware**  
Function that runs *before* a route handler — e.g. check JWT, check admin role.

**MERN stack**  
MongoDB + Express + React + Node.js.

**Model (Mongoose)**  
Defines the shape of data in MongoDB and provides methods like `Product.find()`.

**MongoDB**  
NoSQL database storing documents (JSON-like records).

**Mongoose**  
Library that connects Node.js to MongoDB with schemas and models.

---

## N

**Node.js**  
Lets JavaScript run on a server, not just in the browser.

**npm**  
Node Package Manager — installs libraries (`npm install`) and runs scripts (`npm run dev`).

**NoSQL**  
Database style that stores flexible documents (MongoDB) instead of rigid tables (SQL).

---

## O

**OAuth**  
Standard for logging in with a third party (Google, GitHub) instead of creating a new password on your site.

---

## P

**Package.json**  
File listing your project's name, dependencies, and scripts (`dev`, `build`, `start`).

**Port**  
A numbered "door" a server listens on — e.g. `5000` for Express, `5173` for Vite.

**Prompt**  
Instructions you give Cursor or ChatGPT to generate code or explain concepts.

---

## R

**React**  
JavaScript library for building user interfaces with components.

**Render**  
Cloud platform that runs your Express backend 24/7.

**Route**  
A URL path + HTTP method on your API — e.g. `GET /api/products`.

**React Router**  
Library for multiple pages in a React app (`/`, `/about`, `/shop`).

---

## S

**Schema**  
Rules for one type of document in MongoDB — required fields, types, defaults.

**Secret key**  
Private API key that must stay on the backend only — Flutterwave secret, JWT secret, Cloudinary secret.

**SPA (Single Page Application)**  
React app where navigation happens without full page reloads — React Router handles URL changes.

**SVG**  
Scalable vector graphics — used for icons in this book (not emoji).

---

## T

**Tailwind CSS**  
Utility-class styling — e.g. `className="text-xl font-bold text-slate-900"`.

**Terminal**  
Text window for typing commands — `npm run dev`, `git push`, etc.

**Token**  
See JWT — proof of login.

**TypeScript**  
JavaScript with type checking — this book uses plain JavaScript unless you choose otherwise.

---

## V

**Vercel**  
Hosts your React frontend — auto-deploys when you push to GitHub.

**Verify (payments)**  
Backend calls Flutterwave with your **secret key** to confirm a payment really happened — never trust the browser alone.

**Vite**  
Build tool for fast React development — `npm run dev` uses Vite.

**VITE_ prefix**  
Frontend env vars in Vite must start with `VITE_` to be visible in the browser — only put **public-safe** values here.

---

## Common error terms

| Term | Meaning |
|------|---------|
| **401 Unauthorized** | Not logged in or invalid token |
| **403 Forbidden** | Logged in but not allowed (wrong role) |
| **404 Not Found** | URL or route does not exist |
| **500 Internal Server Error** | Backend crashed — check terminal logs |
| **CORS error** | Backend not allowing your frontend origin |
| **EADDRINUSE** | Port already in use — another server running |

---

## Where to learn more in this book

| Term cluster | Chapter |
|--------------|---------|
| Frontend, MERN, components | 1 |
| Tools, accounts, phased setup | 2 |
| AI prompts | 3 |
| Typography, colour, JSX | 4 |
| Navbar, hero, sections | 5 |
| DIY build steps | 6 |
| `.env`, auth, payments security | 8 |
| Deploy, Git, MongoDB Atlas | 9 |
| Models, routes, controllers | 10 |
| Debugging errors | 11 |
