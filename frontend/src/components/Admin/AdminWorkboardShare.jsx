import React from 'react';
import { useParams } from 'react-router-dom';
import AdminWorkboard from './AdminWorkboard';

const AdminWorkboardShare = () => {
  const { token } = useParams();

  return <AdminWorkboard shareToken={token} />;
};

export default AdminWorkboardShare;
