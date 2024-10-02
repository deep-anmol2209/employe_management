// AdminRoute.jsx
import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

const AdminRoute = ({ children }) => {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // or a spinner component
  }

  return user && isAdmin() ? children : <Navigate to="/unauthorized" />;
};

export default AdminRoute;