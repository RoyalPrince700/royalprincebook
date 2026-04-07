import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import PageLoader from '../PageLoader';
import { getRedirectPath } from '../../utils/authRedirect';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <PageLoader
        title="Checking your account"
        message="Please wait while we verify your authentication and page access."
      />
    );
  }

  if (!isAuthenticated) {
    const redirectPath = getRedirectPath(location);
    const loginPath = redirectPath
      ? `/login?redirect=${encodeURIComponent(redirectPath)}`
      : '/login';

    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  return children;
};

export default PrivateRoute;