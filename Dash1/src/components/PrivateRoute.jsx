import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import CircularProgress from '@mui/material/CircularProgress'; 
import { useEffect } from 'react';

const PrivateRoute = ({ requiredRole, children }) => {
  
  const { user, loading } = useAuth();
  useEffect(() => {
    console.log("PrivateRoute rendered:", { user, loading });
  }, [user, loading]);


  if (loading) {
    if (loading) return <div className="text-center py-4"><CircularProgress /></div>;
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