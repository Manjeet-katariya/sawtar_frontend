// components/cms/Sidebar.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import { NavLink, useLocation } from 'react-router-dom';
import { useCmsContext } from '../../contexts/CmsContext';
import { FiSettings } from 'react-icons/fi';
import { getRoleColors } from '../../../../manageApi/utils/roleColors';

const Sidebar = () => {
  const { sidebarOpen, sidebarCollapsed } = useCmsContext();
  const location = useLocation();
  const { user, token, permissions } = useSelector((state) => state.auth);
  const colors = getRoleColors(user?.role?.code);

  if (!user || !token) return null;

  const roleSlugMap = {
    '0': 'superadmin',
    '1': 'admin',
    '5': 'vendor-b2c',
    '6': 'vendor-b2b',
    '7': 'freelancer',
  };

  const roleSlug = roleSlugMap[user.role.code] || 'dashboard';
  const basePath = `/sawtar/dashboard/${roleSlug}`;

  // === FIXED MENU BUILDING LOGIC ===
  const navItems = [];

  // Dashboard always first
  navItems.push({
    title: 'Dashboard',
    icon: 'fas fa-tachometer-alt',
    to: basePath,
    exact: true
  });

  // Build menu from permissions
  Object.entries(permissions || {}).forEach(([permissionKey, permission]) => {
    if (!permission.canView || !permission.route) return;

    const [moduleName, subModuleName] = permissionKey.split('→');
    const cleanRoute = permission.route.replace(/^\/+/, '');
    const fullPath = `${basePath}/${cleanRoute}`;

    // Check if this is a main module or submodule
    if (!subModuleName) {
      // Main module
      navItems.push({
        title: moduleName,
        icon: permission.icon || 'fas fa-cube',
        to: fullPath,
        submenus: []
      });
    } else {
      // Submodule - find parent module
      let parentModule = navItems.find(item => item.title === moduleName);
      if (!parentModule) {
        // Create parent module if it doesn't exist
        parentModule = {
          title: moduleName,
          icon: permission.icon || 'fas fa-cube',
          to: null, // Parent might not have its own route
          submenus: []
        };
        navItems.push(parentModule);
      }
      
      // Add submodule
      parentModule.submenus.push({
        title: subModuleName,
        to: fullPath,
        icon: permission.icon || 'fas fa-circle'
      });
    }
  });

  // Helper to check if a route is active
  const isActiveRoute = (to, exact = false) => {
    if (exact) {
      return location.pathname === to;
    }
    return location.pathname.startsWith(to);
  };

  return (
    <aside
      className={`fixed top-0 left-0 z-40 bg-[#1E2B37] shadow-xl flex flex-col h-screen 
      transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'}
      ${sidebarCollapsed ? '-translate-x-full lg:translate-x-0' : 'translate-x-0'}`}
    >
      {/* Header */}
      <div className="h-16 flex items-center px-4 border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <div
            className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center shadow-lg`}
          >
            <span className="text-white font-bold text-lg">
              {user.role?.name?.[0]}
            </span>
          </div>
          {!sidebarCollapsed && (
            <span className="text-xl font-bold text-white truncate">
              <span className={colors.text}>({user.role?.name})</span>
            </span>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-6">
        {navItems.map((item) => (
          <div key={item.title} className="space-y-1">
            {/* Main Module Link */}
            {item.to && (!item.submenus || item.submenus.length === 0) ? (
              <NavLink
                to={item.to}
                end={item.exact}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 rounded-xl transition-all group 
                  ${isActive
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`
                }
              >
                <i className={`${item.icon} text-lg mr-3 group-hover:scale-110 transition-transform`} />
                <span className="font-medium">{item.title}</span>
              </NavLink>
            ) : (
              // Module with submenus or no direct link
              <div className="space-y-1">
                <div
                  className={`flex items-center px-4 py-3 rounded-xl transition-all group 
                  ${isActiveRoute(item.to || `/${item.title.toLowerCase()}`) 
                    ? 'text-white bg-gray-800' 
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
                >
                  <i className={`${item.icon} text-lg mr-3`} />
                  <span className="font-medium">{item.title}</span>
                </div>

                {/* Submenus */}
                {item.submenus?.map((sub) => (
                  <NavLink
                    key={sub.to}
                    to={sub.to}
                    className={({ isActive }) =>
                      `flex items-center px-4 py-2 rounded-xl transition-all group ml-6 text-sm
                      ${isActive 
                        ? 'bg-blue-600 text-white shadow-md' 
                        : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`
                    }
                  >
                    <i className={`${sub.icon} text-xs mr-3`} />
                    <span>{sub.title}</span>
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center justify-between">
          {!sidebarCollapsed && <div className="text-sm text-gray-300">v2.0.0</div>}
          <button className="p-2 rounded-lg hover:bg-gray-700 transition-all">
            <FiSettings className="w-5 h-5 text-gray-300" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;