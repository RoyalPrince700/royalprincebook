import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './components/Dashboard/Dashboard';
import Home from './pages/Home';
import BookEditor from './components/Book/BookEditor';
import BookList from './components/Book/BookList';
import ReadBook from './pages/ReadBook';
import PrivateRoute from './components/Auth/PrivateRoute';
import AdminRoute from './components/Auth/AdminRoute';
import UserManagement from './components/Admin/UserManagement';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Navbar from './components/Navbar';
import './App.css';

const Layout = ({ children }) => {
  const location = useLocation();
  const isHome = location.pathname === '/';
  
  return (
    <>
      <Navbar isHome={isHome} />
      <div className={`App ${isHome ? 'home-mode' : ''}`}>
        {children}
        <Footer />
      </div>
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <ScrollToTop />
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/all-books" element={<BookList />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <AdminRoute>
                    <UserManagement />
                  </AdminRoute>
                }
              />
              <Route
                path="/books/:bookId"
                element={
                  <PrivateRoute>
                    <BookEditor />
                  </PrivateRoute>
                }
              />
              <Route
                path="/books/:bookId/read"
                element={
                  <PrivateRoute>
                    <ReadBook />
                  </PrivateRoute>
                }
              />
            </Routes>
          </Layout>
        </Router>
      </ThemeProvider>
    </AuthProvider>
);
}

export default App;