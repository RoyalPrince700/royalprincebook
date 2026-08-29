import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import PageLoader from '../PageLoader';

const TaskboardRoute = ({ children }) => {
  const { loading } = useAuth();

  if (loading) {
    return (
      <PageLoader
        title="Loading board"
        message="Preparing your workspace."
      />
    );
  }

  return children;
};

export default TaskboardRoute;
