import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router';
import './index.css';
import App from './App.jsx';
import Dashboard from './components/dashboard/dashboard.jsx';
import { AuthProvider } from './context/AuthContext';
import RequireAuth from './context/RequireAuth';
import DrawBoard from './components/dashboard/drawboard.jsx';
import Authentication from './authentication/auth'
import OutletLayout from './default/layout.jsx'

const router = createBrowserRouter([
  // Public Layout Route: Renders the <Header /> (from OutletLayout) and the <Outlet />
  {
    path: '/',
    element: <OutletLayout />, // This is your new public layout container
    children: [
      // 1. Home Page (App.jsx)
      // Use 'index: true' to make it the default child route for '/'
      { index: true, element: <App /> },

      // 2. Pre-dashboard
      // path: /predashboard will render inside the OutletLayout's <Outlet>
      
      // 3. Drawboard
      // path: /drawboard will render inside the OutletLayout's <Outlet>
      { path: 'drawboard', element: <DrawBoard /> },

      // 4. Authentication
      // path: /auth will render inside the OutletLayout's <Outlet>
      { path: 'auth', element: <Authentication /> },
    ]
  },

  // Private Route (Dashboard): This one currently uses a different Header 
  // and is wrapped in RequireAuth, so keep it separate for now.
  {
    path: '/dashboard',
    element: (
      <RequireAuth>
        <Dashboard />
      </RequireAuth>
    )
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);