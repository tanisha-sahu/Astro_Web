import React from 'react';
import DashboardLayout from '../components/Dashboard/DashboardLayout';
import StatCard from '../components/Dashboard/StatCard';
import { 
  Users, 
  Clock, 
  Activity, 
  CheckCircle,
  Plus,
  Eye,
  MoreVertical,
  Star as StarIcon
} from 'lucide-react';
import './DashboardPage.css';

const DashboardPage = () => {
  const stats = [
    { title: 'Total Consultations', value: '1,225', trend: '12%', icon: Users, color: 'blue' },
    { title: 'Pending Reports', value: '75', icon: Clock, color: 'orange' },
    { title: 'Active Sessions', value: '12', icon: Activity, color: 'green' },
    { title: 'Orders Completed', value: '2,536', icon: CheckCircle, color: 'purple' },
  ];

  const recentUpdates = [
    { id: 1, type: 'Vedic Astrology', user: 'Aditi Sharma', time: '10 mins ago', status: 'High', progress: 75, icon: '🌟' },
    { id: 2, type: 'Palmistry Reading', user: 'Rahul Verma', time: '25 mins ago', status: 'Low', progress: 45, icon: '✋' },
    { id: 3, type: 'Vastu Consultation', user: 'Sanjay Gupta', time: '1 hour ago', status: 'Medium', progress: 90, icon: '🏠' },
    { id: 4, type: 'Gemology Report', user: 'Priya Rai', time: '3 hours ago', status: 'High', progress: 60, icon: '💎' },
  ];

  return (
    <DashboardLayout>
      <div className="dashboard-header-section">
        <h1>Dashboard Overview</h1>
        <div className="header-actions">
          <button className="btn-primary">
            <Plus size={18} /> New Consultation
          </button>
        </div>
      </div>

      <div className="stats-grid">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <div className="dashboard-grid">
        {/* Recent Updates Section */}
        <section className="dashboard-section recent-updates">
          <div className="section-header">
            <h2>Recent Activities</h2>
            <div className="section-actions">
              <button className="btn-ghost"><Eye size={16} /> View All</button>
            </div>
          </div>
          
          <div className="updates-grid">
            {recentUpdates.map(update => (
              <div key={update.id} className="update-card">
                <div className="update-header">
                  <span className="update-icon">{update.icon}</span>
                  <div className="update-title">
                    <h4>{update.type}</h4>
                    <p>{update.user}</p>
                  </div>
                  <MoreVertical size={16} className="more-btn" />
                </div>
                <div className="update-progress">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${update.progress}%` }}></div>
                  </div>
                  <span className="progress-text">{update.progress}%</span>
                </div>
                <div className="update-status">
                  <span className={`status-tag ${update.status.toLowerCase()}`}>{update.status} Priority</span>
                  <span className="time">{update.time}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Statistics and Distribution */}
        <div className="side-sections">
          <section className="dashboard-section stats-chart">
            <div className="section-header">
              <h2>Analytics</h2>
            </div>
            <div className="chart-placeholder">
              {/* SVG Mock of a Line Chart */}
              <svg viewBox="0 0 400 200" className="line-chart">
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d="M0,150 Q50,140 100,100 T200,80 T300,120 T400,60" fill="none" stroke="var(--primary)" strokeWidth="3" />
                <path d="M0,150 Q50,140 100,100 T200,80 T300,120 T400,60 L400,200 L0,200 Z" fill="url(#chartGradient)" />
                <circle cx="100" cy="100" r="4" fill="var(--primary)" />
                <circle cx="200" cy="80" r="4" fill="var(--primary)" />
                <circle cx="300" cy="120" r="4" fill="var(--primary)" />
              </svg>
              <div className="chart-labels">
                <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span>
              </div>
            </div>
          </section>

          <section className="dashboard-section distribution">
            <div className="section-header">
              <h2>Consultation Categories</h2>
            </div>
            <div className="donut-container">
              <svg viewBox="0 0 100 100" className="donut-chart">
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f1f5f9" strokeWidth="15" />
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="var(--primary)" strokeWidth="15" strokeDasharray="180 251" strokeDashoffset="0" />
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="var(--accent)" strokeWidth="15" strokeDasharray="40 251" strokeDashoffset="-180" />
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#3b82f6" strokeWidth="15" strokeDasharray="31 251" strokeDashoffset="-220" />
              </svg>
              <div className="donut-center">
                <span className="total-label">Total</span>
                <span className="total-value">1.2k</span>
              </div>
            </div>
            <ul className="dist-legend">
              <li><span className="dot vedic"></span> Vedic (45%)</li>
              <li><span className="dot palm"></span> Palmistry (20%)</li>
              <li><span className="dot vastu"></span> Vastu (15%)</li>
              <li><span className="dot other"></span> Other (20%)</li>
            </ul>
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
