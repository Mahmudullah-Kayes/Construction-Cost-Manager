import axios from 'axios';
import { AUTH_ROUTES } from './routes';

// Create a centralized API instance
const createAPIClient = (baseURL) => {
  const api = axios.create({
    baseURL: baseURL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
    timeout: 10000, // 10 seconds timeout
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  });

  // Request Interceptor for adding authentication token
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Inject current user role if available
    const userRole = localStorage.getItem('userRole');
    if (userRole) {
      config.headers['X-User-Role'] = userRole;
    }

    return config;
  }, (error) => {
    return Promise.reject(error);
  });

  // Response Interceptor for global error handling
  api.interceptors.response.use(
    (response) => {
      // Only log in development mode
      if (import.meta.env.DEV) {
        console.log('API Response:', {
          url: response.config.url,
          method: response.config.method,
          status: response.status
        });
      }
      return response;
    },
    async (error) => {
      const originalRequest = error.config;

      // Centralized error handling
      if (error.response) {
        switch (error.response.status) {
          case 401:
            // Only redirect to login if user is already authenticated (token exists but is invalid)
            // Don't redirect if it's a login attempt failure
            if (!originalRequest.url.includes('/login') && localStorage.getItem('authToken')) {
              localStorage.removeItem('authToken');
              localStorage.removeItem('userRole');
              
              if (typeof window !== 'undefined') {
                window.location.href = AUTH_ROUTES.LOGIN;
              }
            }
            break;
            
          case 403:
            // Forbidden - handle permission issues
            if (typeof window !== 'undefined') {
              window.location.href = AUTH_ROUTES.UNAUTHORIZED;
            }
            break;
            
          case 404:
            // Not Found - only log in development
            if (import.meta.env.DEV) {
              console.error('Resource not found:', error.response.config.url);
            }
            break;
            
          case 500:
            // Server error - only log in development
            if (import.meta.env.DEV) {
              console.error('Server error:', error.response);
            }
            // You can add toast notification here later
            break;
        }
      } else if (error.request) {
        // Network error
        if (import.meta.env.DEV) {
          console.error('Network error:', error.message);
        }
      }
      
      return Promise.reject(error);
    }
  );

  // Expose API methods with additional flexibility
  return {
    // Standard HTTP methods
    get: (url, config = {}) => api.get(url, config),
    post: (url, data, config = {}) => api.post(url, data, config),
    put: (url, data, config = {}) => api.put(url, data, config),
    delete: (url, config = {}) => api.delete(url, config),
    patch: (url, data, config = {}) => api.patch(url, data, config),
    
    // File upload method (works better)
    upload: (url, file, onProgress, config = {}) => {
      const formData = new FormData();
      formData.append('file', file);
      
      return api.post(url, formData, {
        ...config,
        headers: {
          ...config.headers,
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: onProgress ? (progressEvent) => {
          const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
          onProgress(progress);
        } : undefined
      });
    },

    // Authentication specific methods
    login: async (credentials) => {
      try {
        const response = await api.post('/login', credentials);
        
        // Auto-save token if login is successful - handle nested structure
        const token = response.data.data?.token || response.data.token;
        const user = response.data.data?.user || response.data.user;
        
        if (token) {
          localStorage.setItem('authToken', token);
        }
        if (user && user.role) {
          localStorage.setItem('userRole', user.role);
        }
        
        return response;
      } catch (error) {
        throw error;
      }
    },
    
    logout: async () => {
      try {
        const response = await api.post('/logout');
        // Clear storage after successful logout
        localStorage.removeItem('authToken');
        localStorage.removeItem('userRole');
        return response;
      } catch (error) {
        // Clear storage even if logout fails
        localStorage.removeItem('authToken');
        localStorage.removeItem('userRole');
        throw error;
      }
    },

    // Get the raw axios instance if needed
    getInstance: () => api
  };
};

// Create different API clients for different services
export const mainAPI = createAPIClient();
export const authAPI = createAPIClient('/auth');
export const userAPI = createAPIClient('/users');

// Utility function to check authentication status
export const isAuthenticated = () => {
  const token = localStorage.getItem('authToken');
  return !!token && token.trim() !== ''; // More thorough check
};

// Utility function to get current user role
export const getCurrentUserRole = () => {
  return localStorage.getItem('userRole') || 'guest';
};

// Utility function to clear all auth data
export const clearAuthData = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('userRole');
};

// React Query integration helpers (since you have React Query installed)
export const createQueryFn = (apiMethod, url) => {
  return async () => {
    const response = await apiMethod(url);
    return response.data;
  };
};

export const createMutationFn = (apiMethod, url) => {
  return async (data) => {
    const response = await apiMethod(url, data);
    return response.data;
  };
};

export default mainAPI; 