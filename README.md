# Royal Prince Book

Royal Prince Book is a dual-purpose platform: a powerful writing tool for authors and a premium digital library for readers. It allows authors to write, format, and publish books seamlessly while offering readers a unique browsing experience to discover, purchase, or subscribe to access a vast collection of books.

## 🚀 Core Workflow

### For Authors (Writing & Publishing)
1.  **Create & Write**: Authors can draft and organize their books directly on the platform using the built-in editor.
2.  **Format**: Content can be structured and formatted professionally.
3.  **Publishing**: Finished books are published to the platform for public access.

### For Readers (Browsing & Reading)
1.  **Immersive Book Discovery**: Users browse a unique, visually engaging catalog of books.
2.  **Flexible Access**:
    *   **Single Purchase**: Buy individual books for permanent access.
    *   **Subscription**: Subscribe (Monthly/Yearly) to access the entire library.
3.  **Seamless Payment**: Secure transactions handled via **Flutterwave**.
4.  **Interactive Reading**: optimized reading experience for purchased content.

## ✨ Features

*   **Public Digital Library**: A rich, custom interface for users to browse books, designed for an immersive experience.
*   **Monetization & Payments**:
    *   **Flutterwave Integration**: Secure payment processing for global transactions.
    *   **Single Book Sales**: Buy and own specific titles.
    *   **Subscription Models**: Recurring billing (Monthly/Yearly) for unlimited access.
*   **Authoring Tools**:
    *   **Intuitive Editor**: A user-friendly interface for writing and editing book content.
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
*   **Tailwind CSS** for the custom user interface
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
1.  **Write**: Use the dashboard to write and organize content.
2.  **Manage**: Use the dashboard to organize chapters and books.
3.  **Publish**: Make books available on the storefront.

## 📄 License

MIT License
