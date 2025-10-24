import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { useCmsContext } from '../../contexts/CmsContext';
import NavMenu from '../ui/NavMenu';
import { FiSettings } from 'react-icons/fi';
import { getRoleColors } from '../../../../manageApi/utils/roleColors';

const Sidebar = () => {
  const { sidebarOpen, sidebarCollapsed } = useCmsContext();
  const location = useLocation();
  const user = useSelector((state) => state.auth?.user);
  const token = useSelector((state) => state.auth?.token);
  const permissions = useSelector((state) => state.auth?.permissions);
  const [modules, setModules] = useState([]);
  
  const colors = getRoleColors(user?.role?.code);

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    if (permissions && permissions.length > 0) {
      const availableModules = permissions
        .filter((p) => p.canView || p.canViewAll)
        .map((p) => p.moduleId);
      setModules(availableModules);
    } else {
      setModules([]);
    }
  }, [permissions]);

  if (!user || !token) {
    return null;
  }

  const getNavItems = (availableModules) => {
    const navItems = [];

    // Always include the Dashboard module
    const dashboardModule = {
      moduleId: 'dashboard',
      name: 'Dashboard',
      route: user?.role?.code === 0 || user?.role?.code === 1 ? '/sawtar/cms' : '/sawtar/cms/seller/dashboard',
      icon: 'fas fa-tachometer-alt',
      subModules: [],
    };

    // Add Dashboard module to navItems
    navItems.push({
      title: dashboardModule.name,
      icon: dashboardModule.icon,
      path: dashboardModule.route,
      isActive: isActive(dashboardModule.route),
      submenus: dashboardModule.subModules.length > 0
        ? dashboardModule.subModules
            .filter((sub) => sub.isActive)
            .map((sub) => ({
              title: sub.name,
              path: sub.route,
              isActive: isActive(sub.route),
            }))
        : undefined,
    });

    // Add other modules based on permissions
    availableModules.forEach((module) => {
      if (module.moduleId === 'dashboard') return;

      const moduleActive = module.subModules.some((sub) => isActive(sub.route)) || isActive(module.route);
      const submenus = module.subModules
        .filter((sub) => sub.isActive)
        .map((sub) => ({
          title: sub.name,
          path: sub.route,
          isActive: isActive(sub.route),
        }));

      navItems.push({
        title: module.name,
        icon: module.icon,
        path: module.route,
        isActive: moduleActive,
        submenus: submenus.length > 0 ? submenus : undefined,
      });
    });

    return navItems;
  };

  const navItems = getNavItems(modules);

  return (
    <aside
      className={`fixed top-0 left-0 z-40 bg-[#1E2B37] shadow-xl flex flex-col h-screen 
      transition-all duration-300 ease-in-out
      ${sidebarOpen ? 'w-64' : 'w-20'}
      ${sidebarCollapsed ? '-translate-x-full lg:translate-x-0' : 'translate-x-0'}`}
    >
      {/* Logo/Header */}
      <div className="h-16 flex items-center px-4 border-b border-gray-700">
        <div className="flex items-center space-x-2">
          {/* Avatar with gradient based on role */}
          <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${colors.gradient} flex items-center justify-center shadow-md`}>
            <span className="text-white font-bold text-sm">
              {user.role?.name?.charAt(0).toUpperCase()}
            </span>
          </div>

          {/* Show role.name */}
          {!sidebarCollapsed && (
            <span className="text-lg font-semibold text-white">
              <span className={colors.text}>({user.role?.name})</span>
            </span>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4 px-2 rounded">
        <NavMenu collapsed={sidebarCollapsed} items={navItems} />
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700 bg-[#1E2B37]">
        <div className="flex items-center justify-between">
          {!sidebarCollapsed && (
            <div className="text-sm text-gray-300">v2.0.0</div>
          )}
          <button className={`p-2 rounded-lg transition-all  duration-200 hover:bg-gray-700 text-white hover:scale-110`}>
            <FiSettings className="w-5 h-5 text-gray-300" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;