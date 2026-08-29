import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useParams } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { BoardThemeProvider } from './contexts/BoardThemeContext';
import { PlatformDialogProvider } from './contexts/PlatformDialogContext';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import AuthCallback from './components/Auth/AuthCallback';
import Dashboard from './components/Dashboard/Dashboard';
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
import TaskboardRoute from './components/Auth/TaskboardRoute';
import NoteboardPage from './components/Admin/NoteboardPage';
import AnalyticsTracker from './components/Analytics/AnalyticsTracker';
import GoogleTagManager from './components/Analytics/GoogleTagManager';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Navbar from './components/Navbar';
import { BlogListPage, BlogPostPage } from './blog';
import PageLoader from './components/PageLoader';
import { PortfolioNavProvider, usePortfolioNav } from './portfolio/context/PortfolioNavContext';
import './App.css';

const PortfolioPage = lazy(() => import('./portfolio/pages/PortfolioPage'));

const LegacyWorkboardRedirect = () => {
  const location = useLocation();
  return <Navigate to={`/taskboard${location.search}`} replace />;
};

const LegacyAdminWorkboardRedirect = () => {
  const location = useLocation();
  return <Navigate to={`/taskboard${location.search}`} replace />;
};

const LegacyWorkboardShareRedirect = () => {
  const { token } = useParams();
  return <Navigate to={`/taskboard/share/${token}`} replace />;
};

const LegacyArtboardShareRedirect = () => {
  const { token } = useParams();
  return <Navigate to={`/noteboard/share/${token}`} replace />;
};

const Layout = ({ children }) => {
  const location = useLocation();
  const isPortfolio = location.pathname === '/';
  const isThemedContentPage =
    location.pathname.startsWith('/blog') ||
    location.pathname === '/all-books' ||
    location.pathname === '/login' ||
    /^\/books\/[^/]+\/details$/.test(location.pathname);
  const isAdmin = location.pathname.startsWith('/admin');
  const isNoteboard =
    location.pathname.startsWith('/noteboard') ||
    location.pathname.startsWith('/taskboard/artboard/share/') ||
    location.pathname.startsWith('/workboard/artboard/share/');
  const isTaskboard =
    (location.pathname.startsWith('/taskboard') && !isNoteboard) ||
    location.pathname.startsWith('/workboard');
  const { sectionNavActive } = usePortfolioNav();
  const hideNavbar =
    (isPortfolio && sectionNavActive) || isTaskboard || isNoteboard || isAdmin;

  return (
    <>
      <AnalyticsTracker />
      {!hideNavbar && <Navbar />}
      <div
        className={`App ${isPortfolio || isThemedContentPage ? 'portfolio-mode' : ''} ${
          isPortfolio && sectionNavActive ? 'portfolio-section-nav-active' : ''
        } ${isAdmin ? 'admin-mode' : ''} ${isTaskboard ? 'taskboard-mode' : ''} ${
          isNoteboard ? 'noteboard-mode' : ''
        }`}
      >
        {children}
        {!isPortfolio && !isAdmin && !isTaskboard && !isNoteboard && <Footer />}
      </div>
    </>
  );
};

function App() {
  return (
    <Router>
      <GoogleTagManager />
      <AuthProvider>
          <ThemeProvider>
            <BoardThemeProvider>
            <PlatformDialogProvider>
            <PortfolioNavProvider>
              <ScrollToTop />
              <Layout>
              <Routes>
                <Route
                  path="/"
                  element={
                    <Suspense fallback={<PageLoader />}>
                      <PortfolioPage />
                    </Suspense>
                  }
                />
                <Route path="/portfolio" element={<Navigate to="/" replace />} />
                <Route path="/about-author" element={<Navigate to="/" replace />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms-of-service" element={<TermsOfService />} />
                <Route path="/all-books" element={<BookList />} />
                <Route path="/books/:bookId/details" element={<BookInsightPage />} />
                <Route path="/blog" element={<BlogListPage />} />
                <Route path="/blog/:slug" element={<BlogPostPage />} />
                <Route path="/cart" element={<Navigate to="/all-books" replace />} />
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
                  path="/taskboard"
                  element={
                    <TaskboardRoute>
                      <AdminWorkboard standalone />
                    </TaskboardRoute>
                  }
                />
                <Route
                  path="/noteboard"
                  element={
                    <TaskboardRoute>
                      <NoteboardPage />
                    </TaskboardRoute>
                  }
                />
                <Route path="/noteboard/share/:token" element={<AdminArtboardShare />} />
                <Route path="/taskboard/share/:token" element={<AdminWorkboardShare />} />
                <Route path="/taskboard/artboard/share/:token" element={<LegacyArtboardShareRedirect />} />
                <Route path="/workboard" element={<LegacyWorkboardRedirect />} />
                <Route path="/workboard/share/:token" element={<LegacyWorkboardShareRedirect />} />
                <Route path="/workboard/artboard/share/:token" element={<LegacyArtboardShareRedirect />} />
                <Route path="/admin/workboard" element={<LegacyAdminWorkboardRedirect />} />
                <Route
                  path="/admin/workboard/share/:token"
                  element={<LegacyWorkboardShareRedirect />}
                />
                <Route
                  path="/admin/workboard/artboard/share/:token"
                  element={<LegacyArtboardShareRedirect />}
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
            </PortfolioNavProvider>
            </PlatformDialogProvider>
            </BoardThemeProvider>
          </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;