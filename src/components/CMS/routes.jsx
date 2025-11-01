// components/CMS/routes/CmsRoutes.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

// === IMPORT ALL YOUR PAGES ===
import Dashboard from './pages/Dashboard';
import VendorDashboard from './pages/VendorDashboard';
import Freelancerdashboard from './pages/Freelancerdashboard';
import ProductRequestB2C from './pages/dashboardPages/manageProducts/ProductRequestB2C';

// === ROLE → SLUG ===
const roleRouteMap = {
  '0': 'superadmin',
  '1': 'admin',
  '5': 'vendor-b2c',
  '6': 'vendor-b2b',
  '7': 'freelancer',
};

const dashboardMap = {
  '0': <Dashboard />,
  '1': <Dashboard />,
  '5': <VendorDashboard />,
  '6': <VendorDashboard />,
  '7': <Freelancerdashboard />,
};

const CmsRoutes = () => {
  const { user, permissions, isAuthenticated, loading } = useSelector(s => s.auth);
  const location = useLocation();

  if (loading) return null;
  if (!isAuthenticated || !user?.role?.code) {
    return <Navigate to="/sawtar/login" replace />;
  }

  const roleCode = user.role.code;
  const roleSlug = roleRouteMap[roleCode] ?? 'dashboard';
  const base = `/sawtar/dashboard/${roleSlug}`;

  // Redirect plain /dashboard → role dashboard
  if (location.pathname === '/sawtar/dashboard' || location.pathname === '/sawtar/dashboard/') {
    return <Navigate to={base} replace />;
  }

  const can = (module, action = 'canView') => {
    const p = permissions?.[module];
    return p && (p[action] === true || p[action] === 1);
  };

  console.log('✅ CmsRoutes base:', base);
  console.log('✅ Permissions:', permissions);

  return (
    <Routes>
      {/* Dashboard */}
      <Route path={`${base}`} element={dashboardMap[roleCode] ?? <Dashboard />} />

      {/* Dynamically build routes based on permissions */}
      {Object.entries(permissions || {}).map(([key, p]) => {
        if (!p.canView || !p.route) return null;
        const cleanRoute = p.route.replace(/^\/+/, '');
        const fullPath = `${base}/${cleanRoute}`;
        console.log('🔹 Adding route:', fullPath);

        // You can map to specific components if needed
        if (cleanRoute.startsWith('products')) {
          return <Route key={fullPath} path={fullPath} element={<ProductRequestB2C />} />;
        }

        // fallback placeholder page
        return (
          <Route
            key={fullPath}
            path={fullPath}
            element={
              <div className="p-10 text-lg font-semibold text-gray-700">
                {key} page coming soon...
              </div>
            }
          />
        );
      })}

      {/* Catch-all */}
      <Route path="*" element={<Navigate to={base} replace />} />
    </Routes>
  );
};

export default CmsRoutes;
