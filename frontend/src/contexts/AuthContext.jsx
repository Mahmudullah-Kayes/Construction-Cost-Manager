import React, { createContext, useState, useContext, useEffect } from 'react';
import { mainAPI, isAuthenticated as checkAuth, clearAuthData } from '../config/api';

// Create Auth Context
const AuthContext = createContext(null);

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is authenticated on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Function to check authentication status
  const checkAuthStatus = async () => {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      setIsAuthenticated(false);
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      // Verify token by fetching user data
      const response = await mainAPI.get('/user');
      const userData = response.data.data?.user || response.data.user || response.data.data || response.data;
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      // Token is invalid or expired
      console.error('Token verification failed:', error);
      clearAuthData();
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Login function
  const login = async (credentials) => {
    try {
      const response = await mainAPI.login(credentials);
      
      // Set user data - handle nested response structure
      const userData = response.data.data?.user || response.data.user || response.data.data;
      setUser(userData);
      setIsAuthenticated(true);
      
      return response;
    } catch (error) {
      setIsAuthenticated(false);
      setUser(null);
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await mainAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear local state
      clearAuthData();
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  // Register function (optional)
  const register = async (userData) => {
    try {
      const response = await mainAPI.post('/register', userData);
      
      // Auto-login after registration
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
        setUser(response.data.user);
        setIsAuthenticated(true);
        
        if (response.data.user && response.data.user.role) {
          localStorage.setItem('userRole', response.data.user.role);
        }
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  };

  // Update user profile
  const updateUser = (updatedUser) => {
    setUser(prev => ({ ...prev, ...updatedUser }));
  };

  // Check if user has specific role
  const hasRole = (role) => {
    if (!user || !user.role) return false;
    if (Array.isArray(role)) {
      return role.includes(user.role);
    }
    return user.role === role;
  };

  // Check if user has specific permission
  const hasPermission = (permission) => {
    if (!user || !user.permissions) return false;
    if (Array.isArray(permission)) {
      return permission.some(perm => user.permissions.includes(perm));
    }
    return user.permissions.includes(permission);
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    register,
    updateUser,
    hasRole,
    hasPermission,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
