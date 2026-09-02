import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import PageLoader from '../PageLoader';
import { getRedirectPath } from '../../utils/authRedirect';
import { buildLoginPath } from '../../utils/requireAuth';

const AdminRoute = ({ children }) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <PageLoader
        title="Verifying admin access"
        message="Confirming permissions before opening this admin page."
      />
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to={buildLoginPath(getRedirectPath(location))}
        state={{ from: location }}
        replace
      />
    );
  }

  if (user.role === 'superior') {
    return <Navigate to="/taskboard" replace />;
  }

  if (user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default AdminRoute;
