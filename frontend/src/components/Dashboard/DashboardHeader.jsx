import React, { useState, useEffect } from 'react';
import { 
  Bell, User, LogOut, 
  Settings, ChevronDown, Menu,
  MessageSquare, BookOpen, Check,
  ShoppingBag
} from 'lucide-react';
import useAuthStore from '../../store/authStore';
import { useNavigate } from 'react-router-dom';
import { getMyNotificationsApi, markNotificationReadApi, markAllNotificationsReadApi } from '../../api/notification';
import { getImageUrl } from '../../utils/imageUtils';
import './DashboardHeader.css';

const DashboardHeader = ({ toggleSidebar }) => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    try {
      const data = await getMyNotificationsApi();
      setNotifications(data);
      // Calculate unread
      const unread = data.filter(n => {
        if (n.recipient) return !n.isRead;
        return !n.readBy.includes(user?._id);
      }).length;
      setUnreadCount(unread);
    } catch (err) {
      console.error('Failed to fetch notifications');
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();
      // Poll every 60 seconds
      const interval = setInterval(fetchNotifications, 60000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleNotificationClick = async (notif) => {
    try {
      // Only mark as read if not already read
      const isRead = notif.recipient ? notif.isRead : notif.readBy.includes(user?._id);
      if (!isRead) {
        await markNotificationReadApi(notif._id);
        fetchNotifications();
      }
      
      setShowNotifications(false);

      // Redirect based on type
      if (notif.type === 'blog_created') {
        navigate('/dashboard/blogs');
      } else if (notif.type === 'order_placed') {
        navigate('/dashboard/orders');
      } else if (notif.type === 'blog_published') {
        // If we have a relatedId, navigate to blog detail
        if (notif.relatedId) {
          navigate(`/blog/${notif.relatedId}`);
        } else {
          navigate('/blogs');
        }
      }
    } catch (err) {
      console.error('Failed to handle notification click');
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsReadApi();
      fetchNotifications();
    } catch (err) {
      console.error('Failed to mark all read');
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'blog_created': return <MessageSquare size={16} className="notif-icon-blog" />;
      case 'blog_published': return <BookOpen size={16} className="notif-icon-published" />;
      case 'order_placed': return <ShoppingBag size={16} className="notif-icon-order" />;
      default: return <Bell size={16} />;
    }
  };

  return (
    <header className="dashboard-header">
      <div className="header-left">
        <div className="brand-logo-wrapper">
          <button className="sidebar-toggle" onClick={toggleSidebar} aria-label="Toggle Sidebar">
            <Menu size={24} />
          </button>
          <div className="dashboard-logo" onClick={() => navigate('/')}>
            <img src="/astro-sanatani-logo.png" alt="Astro Sanatani" />
            <span className="logo-text">Astro Sanatani</span>
          </div>
        </div>
      </div>

      <div className="header-right">
        <div className="notification-wrapper">
          <button 
            className={`icon-btn ${showNotifications ? 'active' : ''}`} 
            title="Notifications"
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowUserMenu(false);
            }}
          >
            <Bell size={20} />
            {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
          </button>

          {showNotifications && (
            <div className="notification-dropdown">
              <div className="notif-header">
                <h3>Notifications</h3>
                {unreadCount > 0 && (
                  <button onClick={handleMarkAllRead} className="mark-all-read">
                    Mark all as read
                  </button>
                )}
              </div>
              <div className="notif-list">
                {notifications.length === 0 ? (
                  <div className="notif-empty">No notifications yet</div>
                ) : (
                  notifications.map(notif => {
                    const isRead = notif.recipient ? notif.isRead : notif.readBy.includes(user?._id);
                    return (
                      <div 
                        key={notif._id} 
                        className={`notif-item ${!isRead ? 'unread' : ''}`}
                        onClick={() => handleNotificationClick(notif)}
                      >
                        <div className="notif-icon-circle">
                          {getNotificationIcon(notif.type)}
                        </div>
                        <div className="notif-content">
                          <p className="notif-title">{notif.title}</p>
                          <p className="notif-message">{notif.message}</p>
                          <span className="notif-time">
                            {new Date(notif.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        {!isRead && <div className="unread-dot"></div>}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>
        
        <div className="user-profile-wrapper">
          <div 
            className="user-trigger" 
            onClick={() => navigate('/profile')}
          >
            <div className="avatar-circle">
              {user?.image ? (
                <img src={getImageUrl(user.image)} alt={user.firstName} className="avatar-img" />
              ) : (
                user?.firstName?.charAt(0) || <User size={20} />
              )}
            </div>
            <div className="user-info-text">
              <span className="user-name">
                {user?.firstName ? `${user.firstName} ${user.lastName || ''}` : 'Spiritual Guide'}
              </span>
              <span className="user-email">{user?.email || 'No email'}</span>
            </div>
          </div>


        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
