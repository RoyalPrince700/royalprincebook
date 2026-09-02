import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import PageLoader from '../PageLoader';
import { isPremiumUser } from '../../utils/bookAccess';
import { getRedirectPath } from '../../utils/authRedirect';
import { buildLoginPath } from '../../utils/requireAuth';

const PremiumRoute = ({ children }) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <PageLoader
        title="Checking your access"
        message="Please wait while we verify your premium workshop access."
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

  if (!isPremiumUser(user)) {
    return <Navigate to="/all-books" replace />;
  }

  return children;
};

export default PremiumRoute;
