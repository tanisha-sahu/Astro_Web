import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/Dashboard/DashboardLayout';
import { 
    Users, Mail, Phone, Calendar, Search, 
    ShieldCheck, Trash2, Filter, ChevronLeft, 
    ChevronRight, ChevronDown, ArrowUpDown, 
    ChevronUp, MoreVertical, Shield, Bell, 
    Send, X as CloseIcon
} from 'lucide-react';
import { userService, notificationService } from '../services';
import DashboardSkeleton from '../components/DashboardSkeleton/DashboardSkeleton';
import './DashboardUsersPage.css';

const DashboardUsersPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    
    // Pagination & Sorting
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [sortField, setSortField] = useState('createdAt');
    const [sortOrder, setSortOrder] = useState(-1);

    // Notification Modal State
    const [showNotifModal, setShowNotifModal] = useState(false);
    const [targetUser, setTargetUser] = useState(null);
    const [notifTitle, setNotifTitle] = useState('');
    const [notifMessage, setNotifMessage] = useState('');
    const [sending, setSending] = useState(false);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
            setPage(1);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const filters = {
                page,
                limit: 10,
                search: debouncedSearch,
                role: roleFilter,
                sortField,
                sortOrder
            };
            const data = await userService.fetchAllUsers(filters);
            setUsers(data.users || []);
            setTotalPages(data.pages || 1);
            setTotalItems(data.total || 0);
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch users:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [debouncedSearch, roleFilter, page, sortField, sortOrder]);

    const handleSort = (field) => {
        if (sortField === field) {
            setSortOrder(sortOrder === -1 ? 1 : -1);
        } else {
            setSortField(field);
            setSortOrder(-1);
        }
        setPage(1);
    };

    const renderSortIcon = (field) => {
        if (sortField !== field) return <ArrowUpDown size={12} className="sort-icon-inactive" />;
        return sortOrder === 1 ? <ChevronUp size={12} className="sort-icon-active" /> : <ChevronDown size={12} className="sort-icon-active" />;
    };

    const handleDelete = async (id, name) => {
        if (window.confirm(`Are you sure you want to remove ${name} from the portal?`)) {
            try {
                await userService.deleteAstrologer(id);
                fetchUsers();
            } catch (error) {
                alert('Failed to remove user');
            }
        }
    };

    const handleOpenNotifModal = (user) => {
        setTargetUser(user);
        setNotifTitle('Sacred Update');
        setNotifMessage('');
        setShowNotifModal(true);
    };

    const handleSendNotif = async (e) => {
        e.preventDefault();
        if (!notifTitle || !notifMessage) return;

        try {
            setSending(true);
            await notificationService.createNotification({
                recipient: targetUser._id,
                title: notifTitle,
                message: notifMessage,
                type: 'info'
            });
            alert('Notification sent successfully!');
            setShowNotifModal(false);
        } catch (error) {
            console.error('Failed to send notification:', error);
            alert('Failed to send notification');
        } finally {
            setSending(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="users-manage-container">
                <div className="page-header">
                    <div className="header-info">
                        <div className="header-icon">
                            <Users size={24} />
                        </div>
                        <div className="header-text">
                            <h1 className="premium-title">User Directory</h1>
                            <p className="premium-subtitle">Manage all community members and their access levels</p>
                        </div>
                    </div>
                </div>

                <div className="controls-bar">
                    <div className="controls-left">
                        <div className="premium-search-container">
                            <Search size={18} className="search-icon" />
                            <input 
                                type="text" 
                                placeholder="Search by name or email..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="controls-right">
                        <div className="filter-item-pill">
                            <Filter size={16} className="pill-icon" />
                            <span className="pill-text">
                                {roleFilter === 'all' ? 'All Roles' : roleFilter.charAt(0).toUpperCase() + roleFilter.slice(1)}
                            </span>
                            <ChevronDown size={14} className="pill-chevron" />
                            <select 
                                value={roleFilter} 
                                onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
                                className="overlay-select"
                            >
                                <option value="all">All Roles</option>
                                <option value="user">Users</option>
                                <option value="astrologer">Astrologers</option>
                                <option value="admin">Admins</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="users-list-wrapper">
                    <div className="users-table-header">
                        <div className="header-cell sortable" onClick={() => handleSort('firstName')}>
                            USER {renderSortIcon('firstName')}
                        </div>
                        <div className="header-cell">CONTACT INFO</div>
                        <div className="header-cell sortable" onClick={() => handleSort('roles')}>
                            ROLES {renderSortIcon('roles')}
                        </div>
                        <div className="header-cell sortable" onClick={() => handleSort('createdAt')}>
                            JOINED ON {renderSortIcon('createdAt')}
                        </div>
                        <div className="header-cell text-right">ACTIONS</div>
                    </div>

                    {loading ? (
                        <DashboardSkeleton type="list" />
                    ) : users.length === 0 ? (
                        <div className="empty-state">
                            <Users size={60} style={{ color: '#e2e8f0', marginBottom: '15px' }} />
                            <h3>No Users Found</h3>
                            <p>Try adjusting your search or filters.</p>
                        </div>
                    ) : (
                        <div className="users-list-body">
                            {users.map(user => (
                                <div key={user._id} className="user-row">
                                    <div className="user-cell">
                                        <div className="user-info-group">
                                            <div className="user-avatar-circle">
                                                {user.image ? (
                                                    <img 
                                                        src={user.image.startsWith('http') ? user.image : `http://localhost:5000${user.image}`} 
                                                        alt={user.firstName} 
                                                        style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                                                    />
                                                ) : (
                                                    <>{user.firstName[0]}{user.lastName[0]}</>
                                                )}
                                            </div>
                                            <div className="user-name-meta">
                                                <span className="user-name">{user.firstName} {user.lastName}</span>
                                                <span className="user-id-badge">ID: {user._id.slice(-6).toUpperCase()}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="user-cell">
                                        <div className="contact-info-group">
                                            <div className="contact-item">
                                                <Mail size={12} />
                                                <span>{user.email}</span>
                                            </div>
                                            <div className="contact-item">
                                                <Phone size={12} />
                                                <span>{user.mobile || 'No Mobile'}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="user-cell">
                                        <div className="roles-pill-wrap">
                                            {user.roles.map(role => (
                                                <span key={role} className={`role-tag ${role}`}>
                                                    {role === 'admin' && <Shield size={10} />}
                                                    {role === 'astrologer' && <ShieldCheck size={10} />}
                                                    {role}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="user-cell">
                                        <div className="joined-date">
                                            <Calendar size={14} />
                                            <span>{new Date(user.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <div className="user-cell text-right">
                                        <div className="action-buttons">
                                            <button 
                                                className="row-action-btn notify"
                                                onClick={() => handleOpenNotifModal(user)}
                                                title="Send Notification"
                                            >
                                                <Bell size={16} />
                                            </button>
                                            <button 
                                                className="row-action-btn delete"
                                                onClick={() => handleDelete(user._id, `${user.firstName} ${user.lastName}`)}
                                                title="Remove User"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {totalItems > 0 && !loading && (
                    <div className="premium-pagination">
                        <div className="pagination-info">
                            Showing <span>{users.length}</span> of <span>{totalItems}</span> members
                        </div>
                        <div className="pagination-controls">
                            <button 
                                className="pagination-btn arrow"
                                disabled={page === 1}
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                            >
                                <ChevronLeft size={18} />
                            </button>
                            
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                                <button 
                                    key={p}
                                    className={`pagination-btn ${p === page ? 'active' : ''}`}
                                    onClick={() => setPage(p)}
                                >
                                    {p}
                                </button>
                            ))}

                            <button 
                                className="pagination-btn arrow"
                                disabled={page === totalPages}
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            >
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                )}

                {/* Send Notification Modal */}
                {showNotifModal && (
                    <div className="modal-overlay">
                        <div className="premium-modal">
                            <div className="modal-header">
                                <h3>Send Sacred Alert</h3>
                                <button className="close-btn" onClick={() => setShowNotifModal(false)}>
                                    <CloseIcon size={20} />
                                </button>
                            </div>
                            <form onSubmit={handleSendNotif} className="notif-form">
                                <div className="to-user">
                                    <span>To:</span> <strong>{targetUser?.firstName} {targetUser?.lastName}</strong>
                                </div>
                                <div className="form-group">
                                    <label>Alert Title</label>
                                    <input 
                                        type="text" 
                                        placeholder="e.g., Update on your consultation"
                                        value={notifTitle}
                                        onChange={(e) => setNotifTitle(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Message Content</label>
                                    <textarea 
                                        placeholder="Enter your message here..."
                                        value={notifMessage}
                                        onChange={(e) => setNotifMessage(e.target.value)}
                                        required
                                        rows={4}
                                    />
                                </div>
                                <div className="modal-actions">
                                    <button type="button" className="btn-cancel" onClick={() => setShowNotifModal(false)}>Cancel</button>
                                    <button type="submit" className="btn-send-notif" disabled={sending}>
                                        {sending ? 'Sending...' : 'Send Revelation'}
                                        <Send size={16} />
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default DashboardUsersPage;
