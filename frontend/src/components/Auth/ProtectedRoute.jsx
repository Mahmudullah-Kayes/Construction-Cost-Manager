import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { AUTH_ROUTES } from '../../config/routes';

/**
 * ProtectedRoute Component
 * Wraps routes that require authentication
 * Can also check for specific roles or permissions
 * 
 * @param {React.Component} children - The component to render if authorized
 * @param {string|array} roles - Required role(s) to access the route
 * @param {string|array} permissions - Required permission(s) to access the route
 * @param {string} redirectTo - Path to redirect if unauthorized (default: /login)
 */
const ProtectedRoute = ({ 
  children, 
  roles = null, 
  permissions = null, 
  redirectTo = AUTH_ROUTES.LOGIN 
}) => {
  const { isAuthenticated, loading, user, hasRole, hasPermission } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <svg 
            className="animate-spin h-12 w-12 text-indigo-600 mx-auto mb-4" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
          >
            <circle 
              className="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4"
            ></circle>
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Check role-based access
  if (roles && !hasRole(roles)) {
    return <Navigate to={AUTH_ROUTES.UNAUTHORIZED} state={{ from: location }} replace />;
  }

  // Check permission-based access
  if (permissions && !hasPermission(permissions)) {
    return <Navigate to={AUTH_ROUTES.UNAUTHORIZED} state={{ from: location }} replace />;
  }

  // User is authenticated and authorized
  return children;
};

export default ProtectedRoute;
