import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Calendar, 
  ShoppingBag, 
  Settings, 
  User, 
  ChevronLeft,
  ChevronRight,
  Menu,
  LayoutDashboard,
  Star,
  Package,
  Plus as PlusIcon,
  FileText,
  LayoutGrid,
  Users,
  Heart,
  X,
  ShieldCheck
} from 'lucide-react';
import useAuthStore from '../../store/authStore';
import { ROLES } from '../../constants/roles';
import './DashboardSidebar.css';

const DashboardSidebar = ({ isOpen, toggleSidebar }) => {
  const { user } = useAuthStore();
  
  const handleNavClick = () => {
    // Close sidebar on mobile after clicking a link
    if (window.innerWidth <= 1024 && isOpen) {
      toggleSidebar();
    }
  };

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Heart, label: 'Favorites', path: '/dashboard/favorites' },
    { icon: Calendar, label: 'Consultations', path: '/dashboard/consultations' },
    { icon: ShoppingBag, label: 'My Orders', path: '/dashboard/orders' },
  ];

  // Ensure roles is always an array for safe checking
  const userRoles = Array.isArray(user?.roles) ? user.roles : [];
  const isAdmin = userRoles.includes(ROLES.ADMIN);
  const isAstrologer = userRoles.includes(ROLES.ASTROLOGER);

  // Add Admin specific items
  if (isAdmin) {
    menuItems.push({ icon: Package, label: 'Products', path: '/dashboard/products' });
    menuItems.push({ icon: LayoutGrid, label: 'Collections', path: '/dashboard/collections' });
    menuItems.push({ icon: ShieldCheck, label: 'Astrologers', path: '/dashboard/astrologers' });
    menuItems.push({ icon: Users, label: 'Community', path: '/dashboard/users' });
  }

  // Add Blog management for Admin & Astrologer
  if (isAdmin || isAstrologer) {
    if (isAdmin) {
      menuItems.push({ icon: FileText, label: 'Manage Blogs', path: '/dashboard/blogs' });
    } else {
      menuItems.push({ icon: FileText, label: 'My Blogs', path: '/dashboard/blogs' });
    }
    menuItems.push({ icon: PlusIcon, label: 'Create Blog', path: '/dashboard/blogs/add' });
  }

  menuItems.push({ icon: User, label: 'My Profile', path: '/profile' });

  const bottomItems = [
    { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
  ];

  return (
    <aside className={`dashboard-sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-mobile-header">
        <div className="sidebar-logo">
          <img src="/astro-sanatani-logo.png" alt="Astro Sanatani" />
          <span>Astro Sanatani</span>
        </div>
        <button className="close-sidebar" onClick={toggleSidebar}>
          <X size={24} />
        </button>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-group">
          {menuItems.map((item) => (
            <NavLink 
              key={item.label} 
              to={item.path} 
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              onClick={handleNavClick}
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
              onClick={handleNavClick}
            >
              <item.icon size={22} className="nav-icon" />
              <span className="nav-label">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </aside>
  );
};

export default DashboardSidebar;
