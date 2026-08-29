import React from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import AdminArtboard from './AdminArtboard';

const NoteboardPage = () => {
  const navigate = useNavigate();

  return (
    <AdminLayout chrome="immersive" standalone>
      <AdminArtboard onExit={() => navigate('/taskboard')} />
    </AdminLayout>
  );
};

export default NoteboardPage;
