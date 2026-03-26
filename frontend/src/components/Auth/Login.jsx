import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const authErrors = {
  auth_failed: 'Google sign-in failed. Please try again.',
  no_token: 'Google sign-in did not complete. Please try again.'
};

const Login = () => {
  const { loginWithGoogle } = useAuth();
  const location = useLocation();
  const errorCode = new URLSearchParams(location.search).get('error');
  const error = authErrors[errorCode] || '';

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1
            style={{
              color: 'var(--primary-color)',
              fontSize: '1.5rem',
              fontWeight: '800',
              margin: 0
            }}
          >
            RoyalPrinceBook
          </h1>
        </div>
        <div className="auth-header">
          <h2 className="auth-title">Welcome Back</h2>
          <p className="auth-subtitle">Sign in with Google to continue reading and writing.</p>
        </div>

        {error && (
          <div className="error-message">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            {error}
          </div>
        )}

        <div className="space-y-4">
          <button
            type="button"
            onClick={loginWithGoogle}
            className="btn-primary w-full"
          >
            Continue with Google
          </button>

          <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
            We only support Google authentication.
          </p>
        </div>

        <div className="auth-footer">
          New here?{' '}
          <Link to="/register">
            Sign up with Google
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;