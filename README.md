# Royal Prince Platform

Royal Prince Platform is a personal hub where visitors can explore my portfolio, follow the projects I am building, read my books and blog, and use productivity tools — all in one place. It combines a premium public presence with practical tools for reading, writing, planning, and creating.

## What This Platform Is

This is not just a book site. It is a unified platform where users can:

- **Portfolio** — Learn about my work, experience, projects, and what I am building.
- **Books** — Browse, purchase, and read my published books in a premium digital library.
- **Blog** — Read articles, lessons, and reflections on leadership, growth, and building.
- **Taskboard** — Plan and manage tasks and projects with a visual workflow board.
- **Artboard** — Organize ideas visually on a flexible canvas.
- **Noteboard** — Capture notes and thinking in a dedicated notetaking space.

Sign in with Google to access account-based features across the platform.

## Core Experiences

### For Visitors
1. **Explore the portfolio** — Discover my background, projects, case studies, and current focus.
2. **Read books & blog** — Access published writing, insights, and long-form content.
3. **Use productivity tools** — Open the taskboard, artboard, and noteboard when signed in.

### For Readers
1. **Browse the library** — Discover books through a clean, immersive catalog.
2. **Purchase or access content** — Buy individual titles or access available material.
3. **Read seamlessly** — Continue reading with a focused in-app reading experience.

### For Authors (Writing & Publishing)
1. **Create & write** — Draft and organize books using the built-in editor.
2. **Format & structure** — Manage chapters and content professionally.
3. **Publish** — Make finished books available on the platform.

## Features

* **Portfolio & Projects** — A minimalist personal site showcasing work, impact, skills, and active projects.
* **Public Digital Library** — Browse and read books with a premium, reader-first interface.
* **Blog** — Published writing on leadership, product, growth, and practical lessons.
* **Taskboard** — Task and project management with boards, sharing, and workflow tooling.
* **Artboard** — Visual board for planning, mapping, and creative organization.
* **Noteboard** — Notetaking space for ideas, drafts, and reference material.
* **Monetization & Payments**:
    * **Flutterwave Integration** — Secure payment processing.
    * **Single Book Sales** — Buy and own specific titles.
* **Authoring Tools**:
    * **Intuitive Editor** — Write and edit book content in the browser.
    * **Chapter-Based Organization** — Structured content management.
    * **Full Book Export** — Download manuscripts as DOCX files.
* **User Management**:
    * **Google Authentication** — Simple sign-in across the platform.
    * **Access Control** — Protected content based on purchase status and role.

## Tech Stack

### Frontend
* **React 18** (Vite)
* **React Router DOM** for navigation
* **Axios** for API interaction
* **Tailwind CSS** and custom portfolio styling
* **Framer Motion** for UI motion
* **Flutterwave-React-v3** for payment gateway integration

### Backend
* **Node.js** & **Express.js**
* **MongoDB** & **Mongoose** for data storage (Users, Books, Transactions, Boards, etc.)
* **JWT** for secure authentication
* **Flutterwave Node SDK** for server-side payment verification
* **docx** / **pdfkit** for document generation

## Project Structure

```
book/
├── backend/                 # Express.js server
│   ├── controllers/         # Auth, payments, books, taskboard, and more
│   ├── models/              # Database schemas
│   ├── routes/              # API endpoints
│   └── ...
├── frontend/                # React application
│   ├── src/
│   │   ├── portfolio/       # Portfolio home page and sections
│   │   ├── blog/            # Blog pages and components
│   │   ├── components/      # Shared UI (books, auth, admin, etc.)
│   │   └── ...
└── README.md
```

## Getting Started

### Prerequisites
* Node.js (v14+)
* MongoDB (v4.4+)
* Flutterwave Account (for API keys)

### Installation

1. **Clone the repo:**
    ```bash
    git clone <repository-url>
    cd book
    ```

2. **Setup Backend:**
    ```bash
    cd backend
    npm install
    # Create .env with:
    # PORT, MONGODB_URI, JWT_SECRET, FLUTTERWAVE_PUBLIC_KEY, FLUTTERWAVE_SECRET_KEY
    npm run dev
    ```

3. **Setup Frontend:**
    ```bash
    cd frontend
    npm install
    # Create .env with VITE_FLUTTERWAVE_PUBLIC_KEY
    npm run dev
    ```

4. **Access the App:**
    Open `http://localhost:5173`.

## Usage Guide

### As a Visitor
1. **Home** — Explore the portfolio, projects, and about sections.
2. **Books** — Browse the library and open book details.
3. **Blog** — Read published posts and reflections.
4. **Sign in** — Use Google to access taskboard, artboard, noteboard, and account features.

### As a Reader
1. **Browse** — Visit the books page to see available titles.
2. **Purchase** — Buy a book or access available content.
3. **Pay** — Complete payment via Flutterwave where required.
4. **Read** — Open purchased books from your library.

### As an Author
1. **Write** — Use the dashboard and editor to create content.
2. **Manage** — Organize chapters and books.
3. **Publish** — Make books available on the storefront.

## License

MIT License
