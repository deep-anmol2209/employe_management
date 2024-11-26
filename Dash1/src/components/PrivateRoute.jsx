import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { useEffect } from 'react';

const PrivateRoute = ({ requiredRole, children }) => {
  
  const { user, loading } = useAuth();
  useEffect(() => {
    console.log("PrivateRoute rendered:", { user, loading });
  }, [user, loading]);


  if (loading) {
    return <div>Loading...</div>; // Or use a spinner
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/login" />;
  }

  return children || <Outlet />;
};

export default PrivateRoute;