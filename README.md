# Royal Prince Book

Royal Prince Book is a dual-purpose platform: a powerful AI-integrated writing tool for authors and a Netflix-style digital library for readers. It allows authors to write, format, and publish books seamlessly while offering readers a premium browsing experience to discover, purchase, or subscribe to access a vast collection of books.

## 🚀 Core Workflow

### For Authors (Writing & Publishing)
The application leverages an "AI-first" writing process:
1.  **Idea Generation**: Authors send raw thoughts to the AI (within the Cursor IDE).
2.  **AI Formatting**: The AI converts these into professionally formatted book chapters.
3.  **Code-Based Editing**: Content is updated directly in the codebase.
4.  **Publishing**: Finished books are published to the platform for public access.

### For Readers (Browsing & Reading)
1.  **Netflix-Style Interface**: Users browse a visually engaging catalog of books.
2.  **Flexible Access**:
    *   **Single Purchase**: Buy individual books for permanent access.
    *   **Subscription**: Subscribe (Monthly/Yearly) to access the entire library.
3.  **Seamless Payment**: Secure transactions handled via **Flutterwave**.
4.  **Interactive Reading**: optimized reading experience for purchased content.

## ✨ Features

*   **Public Digital Library**: A rich, visual interface for users to browse books, similar to streaming services.
*   **Monetization & Payments**:
    *   **Flutterwave Integration**: Secure payment processing for global transactions.
    *   **Single Book Sales**: Buy and own specific titles.
    *   **Subscription Models**: Recurring billing (Monthly/Yearly) for unlimited access.
*   **Authoring Tools**:
    *   **AI Integration Ready**: Designed for AI-assisted writing and formatting.
    *   **Chapter-Based Organization**: Structured content management.
    *   **Full Book Export**: Download manuscripts as DOCX files.
*   **User Management**:
    *   **Simple Authentication**: Secure sign-up/login for readers and authors.
    *   **Access Control**: Content protection based on purchase status or subscription tier.

## 🛠 Tech Stack

### Frontend
*   **React 18** (Vite)
*   **React Router DOM** for navigation
*   **Axios** for API interaction
*   **Tailwind CSS** for the Netflix-style UI
*   **Flutterwave-React-v3** for payment gateway integration

### Backend
*   **Node.js** & **Express.js**
*   **MongoDB** & **Mongoose** for data storage (Users, Books, Transactions)
*   **JWT** for secure authentication
*   **Flutterwave Node SDK** for server-side payment verification
*   **docx** / **pdfkit** for document generation

## 📂 Project Structure

```
royalprincebook/
├── backend/                 # Express.js server
│   ├── controllers/         # Logic for auth, payments, and book management
│   ├── models/              # Database schemas (User, Book, Chapter, Transaction)
│   ├── routes/              # API endpoints (including payment callbacks)
│   └── ...
├── frontend/                # React application
│   ├── src/
│   │   ├── components/      # UI Components (BookList, PaymentModal, ChapterReader)
│   │   ├── pages/           # Main views (Home, Dashboard, ReadBook, Subscription)
│   │   └── ...
└── README.md               # This documentation
```

## 🏁 Getting Started

### Prerequisites
*   Node.js (v14+)
*   MongoDB (v4.4+)
*   Flutterwave Account (for API keys)

### Installation

1.  **Clone the repo:**
    ```bash
    git clone <repository-url>
    cd book-writer
    ```

2.  **Setup Backend:**
    ```bash
    cd backend
    npm install
    # Create .env with:
    # PORT, MONGODB_URI, JWT_SECRET, FLUTTERWAVE_PUBLIC_KEY, FLUTTERWAVE_SECRET_KEY
    npm run dev
    ```

3.  **Setup Frontend:**
    ```bash
    cd frontend
    npm install
    # Create .env with VITE_FLUTTERWAVE_PUBLIC_KEY
    npm run dev
    ```

4.  **Access the App:**
    Open `http://localhost:5173`.

## 📝 Usage Guide

### As a Reader
1.  **Browse**: Visit the home page to see available books.
2.  **Purchase**: Click on a book to buy it or select a subscription plan.
3.  **Pay**: Complete payment via Flutterwave.
4.  **Read**: Access your purchased books in your library.

### As an Author
1.  **Write**: Use the AI-assisted workflow to generate content.
2.  **Manage**: Use the dashboard to organize chapters and books.
3.  **Publish**: Make books available on the storefront.

## 📄 License

MIT License
