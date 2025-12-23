import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Redirect based on role
  const currentPath = window.location.pathname;
  if (user) {
    if (user.role === 'student' && !currentPath.startsWith('/student')) {
      return <Navigate to="/student/dashboard" replace />;
    }
    if (user.role === 'accountant' && !currentPath.startsWith('/accountant')) {
      return <Navigate to="/accountant/dashboard" replace />;
    }
    if (user.role === 'admin' && !currentPath.startsWith('/admin')) {
      return <Navigate to="/admin/dashboard" replace />;
    }
  }

  return children;
};

export default PrivateRoute;











