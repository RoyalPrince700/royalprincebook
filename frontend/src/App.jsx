import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './components/Dashboard/Dashboard';
import BookEditor from './components/Book/BookEditor';
import ReadBook from './pages/ReadBook';
import PrivateRoute from './components/Auth/PrivateRoute';
import AdminRoute from './components/Auth/AdminRoute';
import UserManagement from './components/Admin/UserManagement';
import Footer from './components/Footer';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <div className="App" style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <Routes>
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
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  </AuthProvider>
);
}

export default App;