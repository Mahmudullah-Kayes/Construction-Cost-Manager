import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AUTH_ROUTES, DASHBOARD_ROUTES } from '../config/routes';

/**
 * Custom hook to redirect authenticated users away from auth pages
 * Useful for Login/Register pages - if already logged in, redirect to dashboard
 * 
 * @param {string} redirectPath - Where to redirect authenticated users (default: DASHBOARD_ROUTES.HOME)
 */
export const useRedirectIfAuthenticated = (redirectPath = DASHBOARD_ROUTES.HOME) => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, loading, navigate, redirectPath]);

  return { isAuthenticated, loading };
};

/**
 * Custom hook to require authentication
 * Alternative to ProtectedRoute component, useful for programmatic checks
 * 
 * @param {string} loginPath - Where to redirect if not authenticated (default: AUTH_ROUTES.LOGIN)
 */
export const useRequireAuth = (loginPath = AUTH_ROUTES.LOGIN) => {
  const { isAuthenticated, user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate(loginPath, { replace: true });
    }
  }, [isAuthenticated, loading, navigate, loginPath]);

  return { isAuthenticated, user, loading };
};

/**
 * Custom hook to require specific role
 * Redirects to unauthorized page if user doesn't have required role
 * 
 * @param {string|array} requiredRoles - Role or array of roles required
 * @param {string} unauthorizedPath - Where to redirect if unauthorized (default: AUTH_ROUTES.UNAUTHORIZED)
 */
export const useRequireRole = (requiredRoles, unauthorizedPath = AUTH_ROUTES.UNAUTHORIZED) => {
  const { user, loading, hasRole } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user && !hasRole(requiredRoles)) {
      navigate(unauthorizedPath, { replace: true });
    }
  }, [user, loading, hasRole, requiredRoles, navigate, unauthorizedPath]);

  return { user, loading, hasRole };
};

/**
 * Custom hook to require specific permission
 * Redirects to unauthorized page if user doesn't have required permission
 * 
 * @param {string|array} requiredPermissions - Permission or array of permissions required
 * @param {string} unauthorizedPath - Where to redirect if unauthorized (default: AUTH_ROUTES.UNAUTHORIZED)
 */
export const useRequirePermission = (requiredPermissions, unauthorizedPath = AUTH_ROUTES.UNAUTHORIZED) => {
  const { user, loading, hasPermission } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user && !hasPermission(requiredPermissions)) {
      navigate(unauthorizedPath, { replace: true });
    }
  }, [user, loading, hasPermission, requiredPermissions, navigate, unauthorizedPath]);

  return { user, loading, hasPermission };
};

/**
 * Custom hook for handling logout with confirmation
 * Returns a logout function that optionally shows confirmation dialog
 * 
 * @param {boolean} requireConfirmation - Whether to show confirmation dialog (default: true)
 * @param {string} confirmMessage - Confirmation message (default: 'Are you sure you want to logout?')
 */
export const useLogout = (
  requireConfirmation = true, 
  confirmMessage = 'Are you sure you want to logout?'
) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    if (requireConfirmation && !window.confirm(confirmMessage)) {
      return;
    }

    try {
      await logout();
      navigate(AUTH_ROUTES.LOGIN, { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
      // Still navigate to login even if API call fails
      navigate(AUTH_ROUTES.LOGIN, { replace: true });
    }
  };

  return handleLogout;
};

/**
 * Custom hook to check if user can access a feature
 * Returns boolean indicating if user has required role AND permission
 * 
 * @param {object} config - Configuration object
 * @param {string|array} config.roles - Required role(s)
 * @param {string|array} config.permissions - Required permission(s)
 * @param {boolean} config.requireAll - Whether user needs ALL roles/permissions (default: false)
 */
export const useCanAccess = ({ roles = null, permissions = null, requireAll = false }) => {
  const { hasRole, hasPermission, loading } = useAuth();

  if (loading) {
    return { canAccess: false, loading: true };
  }

  let canAccess = true;

  // Check roles
  if (roles) {
    if (requireAll && Array.isArray(roles)) {
      canAccess = roles.every(role => hasRole(role));
    } else {
      canAccess = hasRole(roles);
    }
  }

  // Check permissions
  if (canAccess && permissions) {
    if (requireAll && Array.isArray(permissions)) {
      canAccess = permissions.every(permission => hasPermission(permission));
    } else {
      canAccess = hasPermission(permissions);
    }
  }

  return { canAccess, loading: false };
};

/**
 * Custom hook for auth-aware navigation
 * Provides navigation functions that respect authentication state
 */
export const useAuthNavigation = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const navigateTo = (path, requireAuth = false) => {
    if (requireAuth && !isAuthenticated) {
      navigate(AUTH_ROUTES.LOGIN, { state: { from: path } });
    } else {
      navigate(path);
    }
  };

  const navigateToLogin = (returnPath = null) => {
    navigate(AUTH_ROUTES.LOGIN, { state: { from: returnPath || window.location.pathname } });
  };

  const navigateToDashboard = () => {
    navigate(DASHBOARD_ROUTES.HOME);
  };

  return {
    navigateTo,
    navigateToLogin,
    navigateToDashboard,
    isAuthenticated
  };
};

export default {
  useRedirectIfAuthenticated,
  useRequireAuth,
  useRequireRole,
  useRequirePermission,
  useLogout,
  useCanAccess,
  useAuthNavigation
};
