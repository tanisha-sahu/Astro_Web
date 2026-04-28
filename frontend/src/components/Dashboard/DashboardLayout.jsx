import React from 'react';
import DashboardSidebar from './DashboardSidebar';
import DashboardHeader from './DashboardHeader';
import useUIStore from '../../store/uiStore';
import './DashboardLayout.css';

const DashboardLayout = ({ children }) => {
  const { isSidebarOpen, toggleSidebar } = useUIStore();

  return (
    <div className="dashboard-layout-wrapper">
      <DashboardHeader toggleSidebar={toggleSidebar} />
      
      <div className={`dashboard-layout ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <DashboardSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        
        {/* Backdrop for mobile */}
        {isSidebarOpen && <div className="dashboard-backdrop" onClick={toggleSidebar}></div>}
        
        <div className="dashboard-main">
          <main className="dashboard-content">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
