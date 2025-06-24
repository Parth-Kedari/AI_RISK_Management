import React from 'react';
import { Navigate } from 'react-router-dom';

// ProtectedRoute checks authentication on every render for instant redirect after login/logout
const ProtectedRoute = ({ children, redirectTo = "/login" }) => {
  const token = localStorage.getItem('token');
  const isAuthenticated = token && typeof token === 'string' && token.length > 10;

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};

export default ProtectedRoute;