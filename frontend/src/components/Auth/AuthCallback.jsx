import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const AuthCallback = () => {
  const { completeGoogleAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    const finishGoogleAuth = async () => {
      const result = await completeGoogleAuth(token);

      if (result.success) {
        navigate('/dashboard', { replace: true });
        return;
      }

      navigate('/login?error=auth_failed', { replace: true });
    };

    finishGoogleAuth();
  }, [completeGoogleAuth, location.search, navigate]);

  return (
    <div className="auth-container">
      <div className="auth-card" style={{ textAlign: 'center' }}>
        <div className="auth-header">
          <h2 className="auth-title">Completing Sign In</h2>
          <p className="auth-subtitle">Please wait while we finish your Google authentication.</p>
        </div>
      </div>
    </div>
  );
};

export default AuthCallback;
