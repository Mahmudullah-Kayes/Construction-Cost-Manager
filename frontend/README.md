# React + Vite Project Starter

## Project Structure

### Core Components

#### 1. Dashboard Layout
- Located in `src/components/Dashboard/`
- Includes:
  - `DashboardLayout.jsx`: Responsive layout wrapper
  - `Dashboard.jsx`: Main dashboard page
  - `common/Sidebar.jsx`: Configurable sidebar navigation
  - `common/header.jsx`: Dynamic header with route-based titles

#### 2. API Configuration
- Located in `src/config/api.js`
- Features:
  - Centralized Axios configuration
  - Automatic token management
  - Global error handling
  - Role-based access control
  - Multiple API client support

##### API Client Methods
```javascript
// Example usage
import { mainAPI, isAuthenticated } from './config/api';

// Check authentication
if (isAuthenticated()) {
  // Perform authenticated request
  const response = await mainAPI.get('/users');
}
```

#### 3. Routing
- Flexible React Router setup
- Nested routing for dashboard
- Protected routes mechanism

### Key Utilities

#### Authentication
- Token storage management
- Role-based access control
- Automatic logout on unauthorized access

#### Error Handling
- Centralized error interceptors
- Automatic redirection for different error types
- Logging mechanisms

### Environment Configuration
- Supports environment-based API URLs
- Configurable through `.env` files


### Customization

- Easily extend API configuration
- Modify dashboard layout
- Add new routes and components

### Future Improvements
- Add more utility hooks
- Expand state management
- Implement more robust authentication flow

### Technologies Used
- React
- Vite
- React Router
- Axios
- Tailwind CSS

### Plugins
- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses Babel for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses SWC for Fast Refresh

### License
[Your License Here]
