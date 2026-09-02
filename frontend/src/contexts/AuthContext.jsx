import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getStoredAuthRedirect, normalizeRedirectPath, saveAuthRedirect } from '../utils/authRedirect';

const AuthContext = createContext();
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

axios.defaults.baseURL = apiBaseUrl;

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Set auth header if token exists
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const response = await axios.get('/auth/profile');
          setUser(response.data.user);
        } catch (error) {
          console.error('Failed to fetch user profile:', error);
          localStorage.removeItem('token');
          setToken(null);
          delete axios.defaults.headers.common['Authorization'];
        }
      }
      setLoading(false);
    };

    initAuth();
  }, [token]);

  const refreshProfile = useCallback(async () => {
    if (!token) return null;

    const response = await axios.get('/auth/profile');
    setUser(response.data.user);
    return response.data.user;
  }, [token]);

  const completeGoogleAuth = useCallback(async (newToken) => {
    if (!newToken) {
      return {
        success: false,
        message: 'No authentication token was returned.'
      };
    }

    try {
      localStorage.setItem('token', newToken);
      setToken(newToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

      const profileResponse = await axios.get('/auth/profile');
      setUser(profileResponse.data.user);

      return { success: true, user: profileResponse.data.user };
    } catch (error) {
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
      delete axios.defaults.headers.common['Authorization'];

      return {
        success: false,
        message: error.response?.data?.message || 'Google sign-in failed'
      };
    }
  }, []);

  const loginWithGoogle = useCallback((redirectPath = '') => {
    const path = normalizeRedirectPath(redirectPath) || getStoredAuthRedirect();
    saveAuthRedirect(path);
    window.location.href = `${apiBaseUrl}/auth/google`;
  }, []);

  const logout = useCallback(() => {
    const existingToken = localStorage.getItem('token');
    const base = axios.defaults.baseURL || '';

    if (existingToken && user?.role === 'admin') {
      fetch(`${base}/taskboard/presence/offline`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${existingToken}`,
          'Content-Type': 'application/json'
        },
        body: '{}',
        keepalive: true
      }).catch(() => {});
    }

    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
    navigate('/login');
  }, [navigate, user?.role]);

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        const requestUrl = String(error.config?.url || '');
        const onArtboardShare =
          requestUrl.includes('/taskboard/artboards/share/') ||
          requestUrl.includes('/workboard/artboards/share/') ||
          window.location.pathname.includes('/noteboard/share/') ||
          window.location.pathname.includes('/taskboard/share/') ||
          window.location.pathname.includes('/workboard/share/') ||
          window.location.pathname.includes('/taskboard/artboard/share/') ||
          window.location.pathname.includes('/workboard/artboard/share/') ||
          window.location.pathname.includes('/admin/workboard/artboard/share/');

        // Collaborative share links are public; don't force logout on their errors.
        if (onArtboardShare) {
          return Promise.reject(error);
        }

        // Only sign out on auth failures (expired/invalid token), not permission denials (403).
        if (error.response?.status === 401) {
          const hadToken = Boolean(localStorage.getItem('token'));
          if (hadToken && !window.location.pathname.includes('/login')) {
            logout();
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, [logout]);

  const updateProfile = useCallback(async (profileData) => {
    try {
      const response = await axios.put('/auth/profile', profileData);
      setUser(response.data.user);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Profile update failed'
      };
    }
  }, []);

  const addPurchasedBook = useCallback((bookId) => {
    if (!bookId) return;

    setUser((prevUser) => {
      if (!prevUser) return prevUser;
      const purchasedBooks = Array.isArray(prevUser.purchasedBooks)
        ? prevUser.purchasedBooks.map((id) => String(id))
        : [];
      const normalizedBookId = String(bookId);
      if (purchasedBooks.includes(normalizedBookId)) {
        return prevUser;
      }

      return {
        ...prevUser,
        purchasedBooks: [...purchasedBooks, normalizedBookId]
      };
    });
  }, []);

  const syncPurchasedBooks = useCallback((purchasedBooks = []) => {
    setUser((prevUser) => {
      if (!prevUser) return prevUser;

      return {
        ...prevUser,
        purchasedBooks: Array.isArray(purchasedBooks)
          ? purchasedBooks.map((id) => String(id))
          : []
      };
    });
  }, []);

  const value = {
    user,
    token,
    loading,
    loginWithGoogle,
    completeGoogleAuth,
    logout,
    updateProfile,
    refreshProfile,
    addPurchasedBook,
    syncPurchasedBooks,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};