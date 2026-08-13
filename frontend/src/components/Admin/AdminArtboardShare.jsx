import React from 'react';
import { useParams } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import AdminArtboard from './AdminArtboard';

const AdminArtboardShare = () => {
  const { token } = useParams();

  if (!token) {
    return (
      <AdminLayout chrome="immersive">
        <div className="ab-shell">
          <p className="ab-error">Share link is missing.</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout chrome="immersive">
      <AdminArtboard shareToken={token} />
    </AdminLayout>
  );
};

export default AdminArtboardShare;
