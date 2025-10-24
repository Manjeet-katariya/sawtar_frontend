import { createContext, useState, useContext } from 'react';

const CmsContext = createContext();

export const CmsProvider = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <CmsContext.Provider value={{ 
      sidebarOpen, 
      sidebarCollapsed,
      toggleSidebar 
    }}>
      {children}
    </CmsContext.Provider>
  );
};

export const useCmsContext = () => useContext(CmsContext);