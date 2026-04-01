# Authentication System Documentation

## Overview
This frontend includes a complete authentication system with login, protected routes, and role-based access control. The authentication is built using React Context API and integrates seamlessly with your Laravel backend.

## 🏗️ Architecture

### File Structure
```
src/
├── contexts/
│   └── AuthContext.jsx          # Global authentication state management
├── components/
│   ├── Auth/
│   │   ├── Login.jsx           # Login page with form validation
│   │   ├── ProtectedRoute.jsx  # HOC for protecting routes
│   │   └── Unauthorized.jsx    # 403 Forbidden page
│   └── Dashboard/
│       ├── DashboardLayout.jsx # Parent layout with auth checks
│       └── common/
│           └── header.jsx      # Header with user info and logout
├── config/
│   └── api.js                  # API client with interceptors
└── App.jsx                     # Main routing configuration
```

## 🔐 Components

### 1. AuthContext (`src/contexts/AuthContext.jsx`)
**Purpose**: Manages global authentication state throughout the app.

**Features**:
- User authentication state
- Login/Logout functionality
- Token management
- Role-based access control helpers
- Permission checking

**Available Methods**:
```javascript
const {
  user,              // Current user object
  isAuthenticated,   // Boolean authentication status
  loading,           // Loading state during auth check
  login,             // Login function: login({ email, password })
  logout,            // Logout function
  register,          // Register function (optional)
  updateUser,        // Update user data
  hasRole,           // Check if user has specific role(s)
  hasPermission,     // Check if user has permission(s)
  checkAuthStatus    // Manually refresh auth status
} = useAuth();
```

### 2. Login Component (`src/components/Auth/Login.jsx`)
**Purpose**: User login interface with validation.

**Features**:
- Email and password validation
- Form error handling
- API error messages
- Loading states
- Remember me functionality
- Links to register and forgot password

**Usage**:
```javascript
import Login from './components/Auth/Login';
// Used in App.jsx at route: /login
```

### 3. ProtectedRoute Component (`src/components/Auth/ProtectedRoute.jsx`)
**Purpose**: Wraps routes that require authentication.

**Features**:
- Authentication verification
- Role-based access control
- Permission-based access control
- Automatic redirect to login
- Loading state during verification

**Usage Examples**:

Basic protection (authentication only):
```javascript
<Route 
  path="/dashboard" 
  element={
    <ProtectedRoute>
      <DashboardLayout />
    </ProtectedRoute>
  }
/>
```

Role-based protection:
```javascript
<Route 
  path="/admin" 
  element={
    <ProtectedRoute roles={['admin']}>
      <AdminPanel />
    </ProtectedRoute>
  }
/>

// Multiple roles
<ProtectedRoute roles={['admin', 'manager']}>
  <Component />
</ProtectedRoute>
```

Permission-based protection:
```javascript
<ProtectedRoute permissions={['edit_users']}>
  <UserEditor />
</ProtectedRoute>
```

### 4. DashboardLayout (`src/components/Dashboard/DashboardLayout.jsx`)
**Purpose**: Parent layout for all dashboard pages with built-in security.

**Features**:
- Double authentication check (extra security layer)
- Optional role-based restrictions
- Loading state
- Automatic redirect for unauthorized users
- Provides consistent layout for all dashboard pages

**How it Works**:
- All child routes automatically inherit the authentication check
- No need to wrap each dashboard route individually with ProtectedRoute
- Verifies authentication on mount and redirects if needed

**To Enable Role-Based Restrictions**:
Uncomment the role check section in the file:
```javascript
useEffect(() => {
  if (user && user.role) {
    const allowedRoles = ['admin', 'manager', 'user'];
    if (!allowedRoles.includes(user.role)) {
      navigate('/unauthorized', { replace: true });
    }
  }
}, [user, navigate]);
```

### 5. Unauthorized Page (`src/components/Auth/Unauthorized.jsx`)
**Purpose**: Displays when user tries to access restricted content.

**Features**:
- Clear error message
- Information about attempted access
- Navigation options (go back, go to dashboard, go home)

## 🔄 Authentication Flow

### Login Flow
1. User enters credentials on Login page
2. Form validation checks input
3. API call to `/api/login` endpoint
4. Backend returns token and user data
5. Token stored in localStorage
6. User data stored in AuthContext
7. Redirect to dashboard

### Protected Route Flow
1. User navigates to protected route
2. ProtectedRoute component checks authentication
3. If authenticated: renders component
4. If not authenticated: redirects to login with return path
5. After login: redirects back to original destination

### Logout Flow
1. User clicks logout in header dropdown
2. API call to `/api/logout`
3. Token removed from localStorage
4. AuthContext state cleared
5. Redirect to login page

## 🚀 Getting Started

### 1. Backend Requirements
Your Laravel backend should have these endpoints:

```php
POST /api/login
- Body: { email, password }
- Response: { token, user: { id, name, email, role } }

POST /api/logout
- Headers: Authorization: Bearer {token}
- Response: { message }

GET /api/user
- Headers: Authorization: Bearer {token}
- Response: { user: { id, name, email, role, permissions } }
```

### 2. Environment Variables
Create a `.env` file in the frontend root:
```env
VITE_API_BASE_URL=http://localhost:8000/api
```

### 3. Testing the Authentication

**Test Credentials** (adjust based on your backend):
```
Email: admin@example.com
Password: password
```

**Test Flow**:
1. Try accessing `/dashboard` directly → Should redirect to `/login`
2. Login with credentials → Should redirect to `/dashboard`
3. Refresh the page → Should stay logged in
4. Click logout → Should redirect to `/login`
5. Try accessing `/dashboard` again → Should redirect to `/login`

## 🎯 Common Use Cases

### Add a New Protected Route
```javascript
// In App.jsx
<Route 
  path="/dashboard" 
  element={
    <ProtectedRoute>
      <DashboardLayout />
    </ProtectedRoute>
  }
>
  <Route path="new-page" element={<NewPage />} />
</Route>
```

### Check Authentication in Components
```javascript
import { useAuth } from '../contexts/AuthContext';

function MyComponent() {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <div>Please login</div>;
  }
  
  return <div>Hello {user.name}</div>;
}
```

### Role-Based UI Elements
```javascript
import { useAuth } from '../contexts/AuthContext';

function AdminButton() {
  const { hasRole } = useAuth();
  
  if (!hasRole('admin')) {
    return null; // Don't show button for non-admins
  }
  
  return <button>Admin Action</button>;
}
```

### Conditional Rendering Based on Permissions
```javascript
import { useAuth } from '../contexts/AuthContext';

function EditButton() {
  const { hasPermission } = useAuth();
  
  return (
    <button disabled={!hasPermission('edit_users')}>
      Edit User
    </button>
  );
}
```

## 🔒 Security Features

### Implemented Security Measures:
1. **Token-Based Authentication**: JWT tokens stored in localStorage
2. **Axios Interceptors**: Automatically adds token to all API requests
3. **Automatic Token Refresh**: Handles 401 responses globally
4. **Protected Routes**: Prevents unauthorized access to pages
5. **Role-Based Access Control**: Restricts features by user role
6. **Permission Checks**: Granular control over features
7. **Double Verification**: Both ProtectedRoute AND DashboardLayout check auth
8. **Automatic Logout**: Clears session on 401 errors

### Best Practices:
- Never store sensitive data in localStorage beyond tokens
- Always validate on backend (frontend is for UX only)
- Use HTTPS in production
- Implement token expiration and refresh
- Add CSRF protection for forms
- Implement rate limiting on login

## 🛠️ Customization

### Change Login Redirect
In `Login.jsx`, change the redirect after successful login:
```javascript
navigate('/dashboard', { replace: true }); // Change '/dashboard' to your desired path
```

### Add Registration Page
1. Create `Register.jsx` similar to `Login.jsx`
2. Add route in `App.jsx`:
```javascript
<Route path="/register" element={<Register />} />
```
3. Use the `register` function from `useAuth()`

### Add Forgot Password
1. Create `ForgotPassword.jsx`
2. Add route and implement password reset flow

### Customize Token Storage
To use sessionStorage instead of localStorage, modify `api.js`:
```javascript
// Change localStorage to sessionStorage throughout
sessionStorage.setItem('authToken', token);
```

## 📝 Additional Features to Consider

### Future Enhancements:
1. **Email Verification**: Require email confirmation after registration
2. **Two-Factor Authentication**: Add 2FA support
3. **Password Strength Meter**: Visual feedback on password creation
4. **Session Timeout Warning**: Warn user before auto-logout
5. **Remember Device**: Device fingerprinting for trusted devices
6. **Social Login**: OAuth with Google, GitHub, etc.
7. **Activity Log**: Track user login/logout history
8. **Account Lockout**: Prevent brute force attacks

## 🐛 Troubleshooting

### Issue: Infinite redirect loop
**Solution**: Check that your backend `/api/user` endpoint is working correctly

### Issue: "useAuth must be used within an AuthProvider"
**Solution**: Ensure `<AuthProvider>` wraps your entire app in `App.jsx`

### Issue: Not redirecting after login
**Solution**: Check console for errors, verify backend returns correct response format

### Issue: Token not being sent with requests
**Solution**: Verify axios interceptor is configured correctly in `api.js`

## 📚 Related Files

- **API Configuration**: `src/config/api.js`
- **Main App**: `src/App.jsx`
- **Header Component**: `src/components/Dashboard/common/header.jsx`

---

**Last Updated**: October 31, 2025
**Version**: 1.0.0
