import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Calendar, 
  ShoppingBag, 
  MessageSquare, 
  Settings, 
  User, 
  Moon,
  ChevronLeft,
  LayoutDashboard,
  Star
} from 'lucide-react';
import './DashboardSidebar.css';

const DashboardSidebar = ({ isOpen, toggleSidebar }) => {
  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Calendar, label: 'Consultations', path: '/dashboard/consultations' },
    { icon: ShoppingBag, label: 'My Orders', path: '/dashboard/orders' },
    { icon: MessageSquare, label: 'Messages', path: '/dashboard/messages' },
    { icon: User, label: 'My Profile', path: '/profile' },
  ];

  const bottomItems = [
    { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
  ];

  return (
    <aside className={`dashboard-sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        <NavLink to="/" className="sidebar-logo">
          <img src="/astro-sanatani-logo.png" alt="Logo" className="logo-img" />
          <span className="logo-text">AstroSanatani</span>
        </NavLink>
        <button className="toggle-btn" onClick={toggleSidebar}>
          <ChevronLeft size={18} />
        </button>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-group">
          {menuItems.map((item) => (
            <NavLink 
              key={item.label} 
              to={item.path} 
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              end
            >
              <item.icon size={22} className="nav-icon" />
              <span className="nav-label">{item.label}</span>
            </NavLink>
          ))}
        </div>

        <div className="nav-divider"></div>

        <div className="nav-group bottom">
          {bottomItems.map((item) => (
            <NavLink 
              key={item.label} 
              to={item.path} 
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <item.icon size={22} className="nav-icon" />
              <span className="nav-label">{item.label}</span>
            </NavLink>
          ))}
          
          <div className="darkmode-toggle">
            <div className="nav-item">
              <Moon size={22} className="nav-icon" />
              <span className="nav-label">Darkmode</span>
              <div className="toggle-switch">
                <input type="checkbox" id="dark-mode" />
                <label htmlFor="dark-mode"></label>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </aside>
  );
};

export default DashboardSidebar;
