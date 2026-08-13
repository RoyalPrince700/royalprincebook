import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import PageLoader from '../PageLoader';

const WorkboardRoute = ({ children }) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <PageLoader
        title="Verifying workboard access"
        message="Confirming permissions before opening Workboard."
      />
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user.role !== 'admin' && user.role !== 'superior') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default WorkboardRoute;
