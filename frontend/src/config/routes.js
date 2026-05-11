/**
 * ============================================================================
 * CENTRALIZED ROUTE CONFIGURATION
 * ============================================================================
 * 
 * All routes are defined here in ONE place.
 * This makes it easy to manage routes as your project grows.
 * 
 * HOW TO USE:
 * -----------
 * 1. Import in any component:
 *    import { AUTH_ROUTES, DASHBOARD_ROUTES } from '../config/routes';
 * 
 * 2. Use in navigation:
 *    navigate(AUTH_ROUTES.LOGIN)
 *    <Link to={DASHBOARD_ROUTES.USERS}>Users</Link>
 * 
 * 3. To change a route, just update it here - no need to search all files!
 * 
 * WHEN TO ADD NEW ROUTES:
 * -----------------------
 * - Adding a new auth page? Add to AUTH_ROUTES
 * - Adding a new dashboard page? Add to DASHBOARD_ROUTES
 * - Adding a new public page? Add to PUBLIC_ROUTES
 * - Don't forget to add page title to PAGE_TITLES
 * 
 * EXAMPLE - Adding a new dashboard route:
 * ----------------------------------------
 * 1. Add to DASHBOARD_ROUTES:
 *    PRODUCTS: '/app/prd'
 * 
 * 2. Add to PAGE_TITLES:
 *    [DASHBOARD_ROUTES.PRODUCTS]: 'Product Management'
 * 
 * 3. Use in your app:
 *    <Route path="prd" element={<Products />} />
 *    <Link to={DASHBOARD_ROUTES.PRODUCTS}>Products</Link>
 * 
 * That's it! No hardcoded routes anywhere else.
 * ============================================================================
 */

// Auth Routes
export const AUTH_ROUTES = {
  LOGIN: '/mka',
  REGISTER: '/reg-x9',
  FORGOT_PASSWORD: '/rst-pwd',
  RESET_PASSWORD: '/new-pwd',
  UNAUTHORIZED: '/denied-403',
};

// Dashboard Routes
export const DASHBOARD_ROUTES = {
  BASE: '/app',
  HOME: '/app',
  USERS: '/app/usr-mng',
  SETTINGS: '/app/config',
  // Add more dashboard routes as you build
  // PRODUCTS: '/app/prd',
  // ORDERS: '/app/ord',
  // ANALYTICS: '/app/stats',
  // CUSTOMERS: '/app/cust',
  // REPORTS: '/app/rpts',
};

// Public Website Routes
export const PUBLIC_ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  CONTACT: '/contact',
  // TERMS: '/terms',
  // PRIVACY: '/privacy',
};

// Page Titles (for header/breadcrumbs)
export const PAGE_TITLES = {
  [DASHBOARD_ROUTES.HOME]: 'Dashboard',
  [DASHBOARD_ROUTES.USERS]: 'User Management',
  [DASHBOARD_ROUTES.SETTINGS]: 'Settings',
  // Add more as needed
  // [DASHBOARD_ROUTES.PRODUCTS]: 'Product Management',
  // [DASHBOARD_ROUTES.ORDERS]: 'Order Management',
};

// Helper function to get page title
export const getPageTitle = (pathname) => {
  return PAGE_TITLES[pathname] || 'Dashboard';
};

// Export all routes as a single object for easy access
export const ROUTES = {
  AUTH: AUTH_ROUTES,
  DASHBOARD: DASHBOARD_ROUTES,
  PUBLIC: PUBLIC_ROUTES,
};

export default ROUTES;
