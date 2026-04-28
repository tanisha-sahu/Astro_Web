import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Star as StarIcon,
  Package,
  LayoutGrid,
  FileText,
  ShoppingBag,
  Heart,
  Calendar,
  MessageSquare,
  Loader2,
  TrendingUp,
  BarChart3
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import useAuthStore from '../store/authStore';
import { ROLES } from '../constants/roles';
import { adminService, orderService, userService } from '../services';
import DashboardSkeleton from '../components/DashboardSkeleton/DashboardSkeleton';
import './DashboardPage.css';

const DashboardPage = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [userOrders, setUserOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userStatsData, setUserStatsData] = useState(null);
  const [analyticsFilter, setAnalyticsFilter] = useState('7d');
  const [analyticsData, setAnalyticsData] = useState({ users: [], orders: [] });
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  
  const userRoles = Array.isArray(user?.roles) ? user.roles : [];
  const isAdmin = userRoles.includes(ROLES.ADMIN);
  const isAstrologer = userRoles.includes(ROLES.ASTROLOGER);
  const isManagement = isAdmin || isAstrologer;

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        if (isAdmin) {
          const adminData = await adminService.fetchDashboardStats();
          setStats(adminData);
        } else if (isAstrologer) {
          const astroData = await adminService.fetchAstrologerStats();
          setStats(astroData);
        } else {
          const [orderData, userStats] = await Promise.all([
            orderService.fetchOrders(),
            userService.fetchUserDashboardStats()
          ]);
          setUserOrders(orderData);
          setUserStatsData(userStats);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [isAdmin, isAstrologer]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!isAdmin) return;
      setAnalyticsLoading(true);
      try {
        const data = await adminService.fetchAdminAnalytics(analyticsFilter);
        setAnalyticsData(data);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setAnalyticsLoading(false);
      }
    };

    fetchAnalytics();
  }, [isAdmin, analyticsFilter]);

  const formatAnalyticsData = (data) => {
    if (!data) return [];
    return data.map(item => {
      let label = '';
      const { year, month, day, hour } = item._id;
      if (hour !== undefined) {
        label = `${hour}:00`;
      } else if (day !== undefined) {
        label = `${day}/${month}`;
      } else {
        label = `${new Date(year, month - 1).toLocaleString('default', { month: 'short' })}`;
      }
      return {
        name: label,
        value: item.count
      };
    });
  };

  const usersChartData = formatAnalyticsData(analyticsData.users);
  const ordersChartData = formatAnalyticsData(analyticsData.orders);

  const spendingChartData = userStatsData?.orderHistory?.map(item => ({
    name: new Date(item._id.year, item._id.month - 1).toLocaleString('default', { month: 'short' }),
    spent: item.totalSpent,
    orders: item.orderCount
  })) || [];

  const blogTrendData = stats?.blogTrend?.map(item => ({
    name: new Date(item._id.year, item._id.month - 1).toLocaleString('default', { month: 'short' }),
    posts: item.count
  })) || [];

  const COLORS = ['#3b82f6', '#8b5cf6', '#f59e0b', '#10b981', '#ef4444', '#ec4899'];

  const distributionData = isAdmin 
    ? stats?.categoryDistribution?.map(cat => ({ name: cat._id || 'Other', value: cat.count }))
    : isAstrologer 
      ? [
          { name: 'Completed', value: stats?.consultationStats?.completed || 0 },
          { name: 'Pending', value: stats?.consultationStats?.pending || 0 }
        ]
      : userStatsData?.categoryDistribution?.map(cat => ({ name: cat._id || 'Other', value: cat.count })) || [];

  // Management Stats
  const managementStats = (isAdmin && stats) ? [
    { title: 'Total Revenue', value: `₹${(stats.counts?.revenue || 0).toLocaleString()}`, icon: TrendingUp, color: 'green' },
    { title: 'Total Orders', value: (stats.counts?.orders || 0).toString(), icon: ShoppingBag, color: 'purple' },
    { title: 'Total Products', value: (stats.counts?.products || 0).toString(), icon: Package, color: 'blue' },
    { title: 'Collections', value: (stats.counts?.collections || 0).toString(), icon: LayoutGrid, color: 'orange' },
    { title: 'Blogs', value: (stats.counts?.blogs || 0).toString(), icon: FileText, color: 'blue' },
    { title: 'Total Users', value: (stats.counts?.users || 0).toString(), icon: Users, color: 'blue' },
    { title: 'Astrologers', value: (stats.counts?.astrologers || 0).toString(), icon: StarIcon, color: 'yellow' },
  ] : [];

  // Astrologer Stats
  const astrologerStats = (isAstrologer && stats) ? [
    { title: 'My Blogs', value: (stats.counts?.blogs || 0).toString(), icon: FileText, color: 'blue' },
    { title: 'Consultations', value: (stats.counts?.consultations || 0).toString(), icon: Calendar, color: 'green' },
    { title: 'Rating', value: `${stats.counts?.rating || 0} ★`, icon: StarIcon, color: 'yellow' },
  ] : [];

  // User Stats
  const userStats = [
    { title: 'My Orders', value: userStatsData?.counts?.orders?.toString() || userOrders.length.toString(), icon: ShoppingBag, color: 'blue' },
    { title: 'Wishlist', value: userStatsData?.counts?.wishlist?.toString() || '0', icon: Heart, color: 'orange' },
    { title: 'Consultations', value: '0', icon: Calendar, color: 'green' },
    { title: 'Notifications', value: userStatsData?.counts?.notifications?.toString() || '0', icon: MessageSquare, color: 'purple' },
  ];

  const currentStats = isAdmin ? managementStats : (isAstrologer ? astrologerStats : userStats);

  // Format orders for display
  const formatOrder = (order) => {
    const statusProgress = {
      'Pending': 10,
      'Processing': 25,
      'Shipped': 75,
      'Delivered': 100,
      'Cancelled': 0
    };

    return {
      id: order._id,
      orderNumber: order.orderNumber || `#${order._id.toString().slice(-6).toUpperCase()}`,
      type: 'Product Order',
      customer: isAdmin ? (order.user ? `${order.user.firstName} ${order.user.lastName}` : 'Guest User') : 'Me',
      time: new Date(order.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      status: order.status,
      progress: statusProgress[order.status] || 0,
      icon: '🛍️'
    };
  };

  const recentUpdates = isAdmin 
    ? (stats?.recentOrders || []).map(formatOrder)
    : (userStatsData?.recentOrders || []).map(formatOrder);

  if (loading) {
    return (
      <DashboardLayout>
        <DashboardSkeleton type="dashboard" />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="dashboard-header-section">
        <div className="header-text">
          <h1>Welcome back, {user?.firstName || 'Seeker'}</h1>
          <p className="subtitle">
            {isAdmin ? 'Management Dashboard' : (isAstrologer ? 'Astrologer Portal' : 'Your Spiritual Journey Dashboard')}
          </p>
        </div>
        <div className="header-actions">
          {isAdmin ? (
            <button className="btn-primary" onClick={() => navigate('/dashboard/products/add')}>
              <Plus size={18} /> New Product
            </button>
          ) : isAstrologer ? (
            <button className="btn-primary" onClick={() => navigate('/dashboard/blogs/add')}>
              <FileText size={18} /> Create Blog
            </button>
          ) : (
            <button className="btn-primary" onClick={() => navigate('/astro-consultation')}>
              <Calendar size={18} /> Book Consultation
            </button>
          )}
        </div>
      </div>

      <div className="stats-grid">
        {currentStats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <div className="dashboard-grid">
        {/* Left Column: Main Analytics and Recent Data */}
        <div className="main-content-column">
          {/* Primary Analytics Section */}
          <section className="dashboard-section main-analytics">
            <div className="section-header">
              <h2>{isAdmin ? 'Performance Overview' : (isAstrologer ? 'My Activity & Impact' : 'Spending & Activity')}</h2>
              {isAdmin && (
                <div className="filter-options">
                  <select 
                    value={analyticsFilter} 
                    onChange={(e) => setAnalyticsFilter(e.target.value)}
                    className="filter-select"
                  >
                    <option value="24h">Last 24 Hours</option>
                    <option value="3d">Last 3 Days</option>
                    <option value="7d">Last 7 Days</option>
                    <option value="1m">Last 1 Month</option>
                    <option value="3m">Last 3 Months</option>
                    <option value="1y">Last 1 Year</option>
                  </select>
                </div>
              )}
            </div>

            <div className="main-charts-grid">
              {isAdmin ? (
                <>
                  <div className="chart-item">
                    <h3>Users Growth</h3>
                    <div className="recharts-container" style={{ height: 250, width: '100%' }}>
                      {analyticsLoading ? (
                        <div className="chart-loader"><Loader2 className="animate-spin" /></div>
                      ) : (
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={usersChartData}>
                            <defs>
                              <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                            <Tooltip 
                              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                            />
                            <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorUsers)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      )}
                    </div>
                  </div>
                  <div className="chart-item">
                    <h3>Orders Analytics</h3>
                    <div className="recharts-container" style={{ height: 250, width: '100%' }}>
                      {analyticsLoading ? (
                        <div className="chart-loader"><Loader2 className="animate-spin" /></div>
                      ) : (
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={ordersChartData}>
                            <defs>
                              <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                            <Tooltip 
                              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                            />
                            <Area type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#colorOrders)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      )}
                    </div>
                  </div>
                </>
              ) : isAstrologer ? (
                <div className="chart-item full-width">
                  <h3>Blog Activity (Posts per Month)</h3>
                  <div className="recharts-container" style={{ height: 300, width: '100%' }}>
                    {blogTrendData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={blogTrendData}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                          <Tooltip 
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}
                          />
                          <Bar dataKey="posts" name="Posts" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={40} />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="empty-state">No blog activity recorded.</div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="chart-item full-width">
                  <h3>Spending Overview</h3>
                  <div className="recharts-container" style={{ height: 300, width: '100%' }}>
                    {spendingChartData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={spendingChartData}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                          <Tooltip 
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}
                          />
                          <Bar dataKey="spent" name="Spent (₹)" fill="var(--primary)" radius={[6, 6, 0, 0]} barSize={40} />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="empty-state">No spending history found.</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Recent Activity Section */}
          <section className="dashboard-section recent-activity">
            <div className="section-header">
              <h2>{isAdmin ? 'Recent Orders' : (isAstrologer ? 'My Recent Blogs' : 'My Recent Orders')}</h2>
              <div className="section-actions">
                <button className="btn-ghost" onClick={() => navigate(isAdmin ? '/dashboard/orders' : (isAstrologer ? '/dashboard/blogs' : '/dashboard/orders'))}>
                  <Eye size={16} /> View All
                </button>
              </div>
            </div>
            
            <div className="updates-grid">
              {isAstrologer ? (
                (stats?.recentBlogs || []).map(blog => (
                  <div 
                    key={blog._id} 
                    className="update-card" 
                    onClick={() => navigate(`/dashboard/blogs/edit/${blog._id}`)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="update-header">
                      <span className="update-icon">📝</span>
                      <div className="update-title">
                        <h4>{blog.title}</h4>
                        <p>{new Date(blog.createdAt).toLocaleDateString()}</p>
                      </div>
                      <MoreVertical size={16} className="more-btn" />
                    </div>
                    <div className="update-status">
                      <span className={`status-tag ${blog.status === 'published' ? 'delivered' : 'pending'}`}>
                        {blog.status === 'published' ? 'Published' : 'Draft'}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                recentUpdates.map(update => (
                  <div 
                    key={update.id} 
                    className="update-card" 
                    onClick={() => navigate(`/dashboard/orders/${update.id}`)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="update-header">
                      <span className="update-icon">{update.icon}</span>
                      <div className="update-title">
                        <h4>{isAdmin ? update.type : update.orderNumber}</h4>
                        <p>{isAdmin ? update.customer : update.time}</p>
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
                      <span className={`status-tag ${update.status.toLowerCase().replace(' ', '-')}`}>{update.status}</span>
                      <span className="time">{update.time}</span>
                    </div>
                  </div>
                ))
              )}
              {((isAstrologer && stats?.recentBlogs.length === 0) || (!isAstrologer && recentUpdates.length === 0)) && (
                <div className="empty-state">
                  <p>No recent activity found.</p>
                </div>
              )}
            </div>
          </section>

          {/* Recent Community Section - Admin Only */}
          {isAdmin && stats && (
            <section className="dashboard-section recent-community">
              <div className="section-header">
                <h2>Recent Community</h2>
                <div className="section-actions">
                  <button className="btn-ghost" onClick={() => navigate('/dashboard/users')}>
                    <Eye size={16} /> View All
                  </button>
                </div>
              </div>
              <div className="community-table-compact">
                {stats.recentUsers.length === 0 ? (
                  <div className="empty-state">No users found.</div>
                ) : (
                  <div className="table-responsive">
                    <table className="compact-table">
                      <thead>
                        <tr>
                          <th>Member</th>
                          <th>Role</th>
                          <th>Joined</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stats.recentUsers.map(u => (
                          <tr key={u._id}>
                            <td>
                              <div className="user-mini-info">
                                <div className="mini-avatar">{u.firstName[0]}{u.lastName[0]}</div>
                                <div className="mini-text">
                                  <p className="name">{u.firstName} {u.lastName}</p>
                                  <p className="email">{u.email}</p>
                                </div>
                              </div>
                            </td>
                            <td>
                              <span className={`role-tag-mini ${u.roles[0]}`}>{u.roles[0]}</span>
                            </td>
                            <td>
                              <span className="date-mini">{new Date(u.createdAt).toLocaleDateString()}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </section>
          )}
        </div>

        {/* Right Column: Secondary Data and Quick Actions */}
        <div className="side-content-column">
          {/* Quick Actions */}
          <section className="dashboard-section side-actions">
            <div className="section-header">
              <h2>Quick Actions</h2>
            </div>
            <div className="actions-vertical-grid">
              {isAdmin ? (
                <>
                  <button className="action-btn-large" onClick={() => navigate('/dashboard/users')}>
                    <div className="action-icon profile"><Users size={20} /></div>
                    <div className="action-info">
                      <span className="title">User Management</span>
                      <span className="desc">Manage community roles</span>
                    </div>
                  </button>
                  <button className="action-btn-large" onClick={() => navigate('/dashboard/astrologers/add')}>
                    <div className="action-icon heart"><StarIcon size={20} /></div>
                    <div className="action-info">
                      <span className="title">Add Astrologer</span>
                      <span className="desc">Expand your expert team</span>
                    </div>
                  </button>
                  <button className="action-btn-large" onClick={() => navigate('/dashboard/blogs')}>
                    <div className="action-icon calendar"><FileText size={20} /></div>
                    <div className="action-info">
                      <span className="title">Review Blogs</span>
                      <span className="desc">Moderation queue</span>
                    </div>
                  </button>
                </>
              ) : isAstrologer ? (
                <>
                  <button className="action-btn-large" onClick={() => navigate('/dashboard/blogs/add')}>
                    <div className="action-icon calendar"><FileText size={20} /></div>
                    <div className="action-info">
                      <span className="title">Create Blog</span>
                      <span className="desc">Share your wisdom</span>
                    </div>
                  </button>
                  <button className="action-btn-large" onClick={() => navigate('/profile')}>
                    <div className="action-icon profile"><Users size={20} /></div>
                    <div className="action-info">
                      <span className="title">Profile Bio</span>
                      <span className="desc">Update expertise</span>
                    </div>
                  </button>
                  <button className="action-btn-large" onClick={() => window.open('https://wa.me/your-number', '_blank')}>
                    <div className="action-icon heart"><MessageSquare size={20} /></div>
                    <div className="action-info">
                      <span className="title">WhatsApp Leads</span>
                      <span className="desc">Check messages</span>
                    </div>
                  </button>
                </>
              ) : (
                <>
                  <button className="action-btn-large" onClick={() => navigate('/astro-consultation')}>
                    <div className="action-icon calendar"><Calendar size={20} /></div>
                    <div className="action-info">
                      <span className="title">Book Consultation</span>
                      <span className="desc">Talk to top astrologers</span>
                    </div>
                  </button>
                  <button className="action-btn-large" onClick={() => navigate('/dashboard/favorites')}>
                    <div className="action-icon heart"><Heart size={20} /></div>
                    <div className="action-info">
                      <span className="title">My Wishlist</span>
                      <span className="desc">View saved items</span>
                    </div>
                  </button>
                  <button className="action-btn-large" onClick={() => navigate('/profile')}>
                    <div className="action-icon profile"><Users size={20} /></div>
                    <div className="action-info">
                      <span className="title">Account Settings</span>
                      <span className="desc">Update your profile</span>
                    </div>
                  </button>
                </>
              )}
            </div>
          </section>

          <section className="dashboard-section distribution">
            <div className="section-header">
              <h2>{isManagement ? (isAdmin ? 'Inventory Distribution' : 'Consultation Stats') : 'Top Categories'}</h2>
            </div>
            <div className="recharts-container" style={{ height: 200, width: '100%', position: 'relative' }}>
              {distributionData && distributionData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={distributionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {distributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="empty-state">No distribution data.</div>
              )}
              {distributionData && distributionData.length > 0 && (
                <div className="donut-center-text">
                  <span className="total-value">
                    {distributionData.reduce((acc, curr) => acc + curr.value, 0)}
                  </span>
                  <span className="total-label">Total</span>
                </div>
              )}
            </div>
            <ul className="dist-legend">
              {distributionData && distributionData.slice(0, 4).map((item, i) => (
                <li key={i}>
                  <span className="dot" style={{ background: COLORS[i % COLORS.length] }}></span> 
                  {item.name} ({item.value})
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
