import useAuthStore from '../store/authStore';
import { User, Mail, Phone, Calendar, LogOut } from 'lucide-react';
import './ProfilePage.css';

export default function ProfilePage() {
  const { user, logout } = useAuthStore();

  if (!user) return null;

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <div className="profile-badge">
            <User size={40} />
          </div>
          <h1>Sacred Profile</h1>
          <p>Welcome back, {user.firstName} {user.lastName}</p>
        </div>

        <div className="profile-card">
          <div className="profile-item">
            <div className="profile-icon">
              <User size={20} />
            </div>
            <div className="profile-content">
              <label>Full Name</label>
              <p>{user.firstName} {user.lastName}</p>
            </div>
          </div>

          <div className="profile-item">
            <div className="profile-icon">
              <Mail size={20} />
            </div>
            <div className="profile-content">
              <label>Email Address</label>
              <p>{user.email}</p>
            </div>
          </div>

          <div className="profile-item">
            <div className="profile-icon">
              <Phone size={20} />
            </div>
            <div className="profile-content">
              <label>Mobile Number</label>
              <p>{user.mobile}</p>
            </div>
          </div>

          {user.dob && (
            <div className="profile-item">
              <div className="profile-icon">
                <Calendar size={20} />
              </div>
              <div className="profile-content">
                <label>Date of Birth</label>
                <p>{user.dob}</p>
              </div>
            </div>
          )}
        </div>

        <button onClick={logout} className="logout-btn">
          <LogOut size={18} /> Logout from Journey
        </button>
      </div>
    </div>
  );
}
