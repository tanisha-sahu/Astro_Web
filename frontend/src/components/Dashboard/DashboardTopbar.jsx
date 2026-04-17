import { Search, Bell, Globe, User, ChevronDown, Menu } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import './DashboardTopbar.css';

const DashboardTopbar = ({ onMenuClick }) => {
  const { user } = useAuthStore();

  return (
    <header className="dashboard-topbar">
      <div className="topbar-left">
        <button className="mobile-menu-btn" onClick={onMenuClick}>
          <Menu size={22} />
        </button>
        <img src="/astro-sanatani-logo.png" alt="Logo" className="mobile-logo" />
      </div>

      <div className="search-wrapper">
        <Search size={20} className="search-icon" />
        <input type="text" placeholder="Search for rituals, consultants, or products..." />
      </div>

      <div className="topbar-actions">
        <div className="language-selector">
          <Globe size={18} />
          <span>EN</span>
          <ChevronDown size={14} />
        </div>

        <button className="notification-btn">
          <Bell size={20} />
          <span className="dot"></span>
        </button>

        <div className="user-profile-summary">
          <div className="user-info">
            <span className="user-name">{user?.firstName || 'Randy Riley'}</span>
            <span className="user-email">{user?.email || 'randy.riley@gmail.com'}</span>
          </div>
          <div className="user-avatar">
            {user?.firstName?.charAt(0) || <User size={20} />}
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardTopbar;
