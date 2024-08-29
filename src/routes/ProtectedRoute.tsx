// ProtectedRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const isAuthenticated = !!localStorage.getItem('AccessToken');

  return isAuthenticated ? element : <Navigate to="/login" />;
};

export default ProtectedRoute;
