import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { saveAuthRedirect } from '../utils/authRedirect';

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
    saveAuthRedirect(redirectPath);
    window.location.href = `${apiBaseUrl}/auth/google`;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
    navigate('/login');
  }, [navigate]);

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          // Check if we are already on the login page to avoid loops
          if (!window.location.pathname.includes('/login')) {
            logout();
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, [navigate]);

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
      const purchasedBooks = Array.isArray(prevUser.purchasedBooks) ? prevUser.purchasedBooks : [];
      if (purchasedBooks.includes(bookId)) {
        return prevUser;
      }

      return {
        ...prevUser,
        purchasedBooks: [...purchasedBooks, bookId]
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
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};