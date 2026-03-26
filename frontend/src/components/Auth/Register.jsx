import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Register = () => {
  const { loginWithGoogle } = useAuth();

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
          <h2 className="auth-title">Create Your Account</h2>
          <p className="auth-subtitle">Use Google to create your account and start immediately.</p>
        </div>

        <div className="space-y-4">
          <button
            type="button"
            onClick={loginWithGoogle}
            className="btn-primary w-full"
          >
            Continue with Google
          </button>

          <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
            Your Google account will be used for both sign up and sign in.
          </p>
        </div>

        <div className="auth-footer">
          Already have an account?{' '}
          <Link to="/login">
            Sign in with Google
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;