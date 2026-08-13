import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import AuthCallback from './components/Auth/AuthCallback';
import Dashboard from './components/Dashboard/Dashboard';
import Home from './pages/Home';
import AboutAuthor from './pages/AboutAuthor';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import BookEditor from './components/Book/BookEditor';
import BookList from './components/Book/BookList';
import BookInsightPage from './pages/BookInsightPage';
import ReadBook from './pages/ReadBook';
import PrivateRoute from './components/Auth/PrivateRoute';
import AdminRoute from './components/Auth/AdminRoute';
import AdminOverview from './components/Admin/AdminOverview';
import AdminTraffic from './components/Admin/AdminTraffic';
import AdminBooks from './components/Admin/AdminBooks';
import UserManagement from './components/Admin/UserManagement';
import AdminFinance from './components/Admin/AdminFinance';
import AdminGame from './components/Admin/AdminArticulationGame';
import AdminWorkboard from './components/Admin/AdminWorkboard';
import AdminWorkboardShare from './components/Admin/AdminWorkboardShare';
import AdminArtboardShare from './components/Admin/AdminArtboardShare';
import WorkboardRoute from './components/Auth/WorkboardRoute';
import AnalyticsTracker from './components/Analytics/AnalyticsTracker';
import GoogleTagManager from './components/Analytics/GoogleTagManager';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Navbar from './components/Navbar';
import Cart from './pages/Cart';
import { CartProvider } from './contexts/CartContext';
import { BlogListPage, BlogPostPage } from './blog';
import PageLoader from './components/PageLoader';
import './App.css';

const PortfolioPage = lazy(() => import('./portfolio/pages/PortfolioPage'));

const Layout = ({ children }) => {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const isPortfolio = location.pathname === '/portfolio';
  const isAdmin = location.pathname.startsWith('/admin');
  const isArtboard =
    (location.pathname === '/admin/workboard' &&
      new URLSearchParams(location.search).get('mode') === 'artboard') ||
    location.pathname.startsWith('/admin/workboard/artboard/share/');

  return (
    <>
      <AnalyticsTracker />
      {!isPortfolio && !isAdmin && !isArtboard && <Navbar isHome={isHome} />}
      <div
        className={`App ${isHome ? 'home-mode' : ''} ${isPortfolio ? 'portfolio-mode' : ''} ${
          isAdmin ? 'admin-mode' : ''
        } ${isArtboard ? 'artboard-mode' : ''}`}
      >
        {children}
        {!isPortfolio && !isAdmin && <Footer />}
      </div>
    </>
  );
};

function App() {
  return (
    <Router>
      <GoogleTagManager />
      <AuthProvider>
        <CartProvider>
          <ThemeProvider>
            <ScrollToTop />
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about-author" element={<AboutAuthor />} />
                <Route path="/portfolio" element={
                  <Suspense fallback={<PageLoader />}>
                    <PortfolioPage />
                  </Suspense>
                } />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms-of-service" element={<TermsOfService />} />
                <Route path="/all-books" element={<BookList />} />
                <Route path="/books/:bookId/details" element={<BookInsightPage />} />
                <Route path="/blog" element={<BlogListPage />} />
                <Route path="/blog/:slug" element={<BlogPostPage />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/auth/callback" element={<AuthCallback />} />
                <Route
                  path="/dashboard"
                  element={
                    <PrivateRoute>
                      <Dashboard />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/admin"
                  element={
                    <AdminRoute>
                      <AdminOverview />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/traffic"
                  element={
                    <AdminRoute>
                      <AdminTraffic />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/books"
                  element={
                    <AdminRoute>
                      <AdminBooks />
                    </AdminRoute>
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
                  path="/admin/finance"
                  element={
                    <AdminRoute>
                      <AdminFinance />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/game"
                  element={
                    <AdminRoute>
                      <AdminGame />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/workboard"
                  element={
                    <WorkboardRoute>
                      <AdminWorkboard />
                    </WorkboardRoute>
                  }
                />
                <Route
                  path="/admin/workboard/share/:token"
                  element={<AdminWorkboardShare />}
                />
                <Route
                  path="/admin/workboard/artboard/share/:token"
                  element={<AdminArtboardShare />}
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
                  element={<ReadBook />}
                />
              </Routes>
            </Layout>
          </ThemeProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;