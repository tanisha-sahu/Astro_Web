import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/Dashboard/DashboardLayout';
import { 
    ShoppingBag, AlertCircle, CheckCircle, Search, 
    ChevronLeft, ChevronRight, Filter, ChevronDown, 
    ArrowUpDown, ChevronUp, Eye, MoreVertical
} from 'lucide-react';
import { orderService } from '../services';
import useAuthStore from '../store/authStore';
import { ROLES } from '../constants/roles';

import DashboardSkeleton from '../components/DashboardSkeleton/DashboardSkeleton';
import './DashboardOrdersPage.css';

const DashboardOrdersPage = () => {
    const { user } = useAuthStore();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    
    // Filter & Pagination States
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [debouncedSearch, setDebouncedSearch] = useState('');
    
    // Sorting States
    const [sortField, setSortField] = useState('createdAt');
    const [sortOrder, setSortOrder] = useState(-1);

    const navigate = useNavigate();
    
    const userRoles = Array.isArray(user?.roles) ? user.roles : [];
    const isAdmin = userRoles.includes(ROLES.ADMIN) || userRoles.includes(ROLES.ASTROLOGER);

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(1); // Reset to first page on search
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    const fetchData = async () => {
        try {
            setLoading(true);
            
            // Artificial delay for consistency
            await new Promise(resolve => setTimeout(resolve, 600));

            const data = await orderService.fetchOrders();
            
            // Simple client-side filtering and sorting for now since backend getOrders is basic
            let filteredOrders = [...data];

            if (debouncedSearch) {
                const s = debouncedSearch.toLowerCase();
                filteredOrders = filteredOrders.filter(o => 
                    o.orderNumber.toLowerCase().includes(s) || 
                    (o.user?.firstName?.toLowerCase().includes(s)) ||
                    (o.user?.lastName?.toLowerCase().includes(s))
                );
            }

            if (statusFilter !== 'all') {
                filteredOrders = filteredOrders.filter(o => o.status === statusFilter);
            }

            // Sorting
            filteredOrders.sort((a, b) => {
                let valA = a[sortField];
                let valB = b[sortField];
                
                if (sortField === 'userName') {
                    valA = a.user && typeof a.user === 'object' ? `${a.user.firstName} ${a.user.lastName}` : 'Guest';
                    valB = b.user && typeof b.user === 'object' ? `${b.user.firstName} ${b.user.lastName}` : 'Guest';
                }

                if (valA < valB) return sortOrder;
                if (valA > valB) return -sortOrder;
                return 0;
            });

            setTotalItems(filteredOrders.length);
            setTotalPages(Math.ceil(filteredOrders.length / 10));
            setOrders(filteredOrders.slice((page - 1) * 10, page * 10));
            
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch orders');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [debouncedSearch, statusFilter, page, sortField, sortOrder]);

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
        return sortOrder === 1 ? 
            <ChevronUp size={12} className="sort-icon-active" /> : 
            <ChevronDown size={12} className="sort-icon-active" />;
    };

    const handleUpdateStatus = async (id, status) => {
        try {
            await orderService.updateStatus(id, status);
            setOrders(orders.map(o => o._id === id ? { ...o, status } : o));
            setSuccess(`Order status updated to ${status}`);
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            setError('Failed to update order status');
            setTimeout(() => setError(null), 3000);
        }
    };

    return (
        <DashboardLayout>
            <div className="dashboard-orders-container">
                <div className="page-header">
                    <div className="header-left">
                        <div className="header-text-group">
                            <h1 className="premium-title">{isAdmin ? 'Orders Management' : 'My Orders'}</h1>
                        </div>
                    </div>
                </div>

                <div className="controls-bar">
                    <div className="controls-left">
                        <div className="premium-search-container">
                            <Search size={18} className="search-icon" />
                            <input 
                                type="text" 
                                placeholder="Search by order # or name..." 
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="controls-right">
                        <div className="filter-item-pill">
                            <Filter size={16} className="pill-icon" />
                            <span className="pill-text">
                                {statusFilter === 'all' ? 'All Status' : statusFilter}
                            </span>
                            <ChevronDown size={14} className="pill-chevron" />
                            <select 
                                value={statusFilter} 
                                onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                                className="overlay-select"
                            >
                                <option value="all">All Status</option>
                                <option value="Pending">Pending</option>
                                <option value="Processing">Processing</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>
                        </div>
                    </div>
                </div>

                {success && (
                    <div className="alert alert-success">
                        <CheckCircle size={18} />
                        <span>{success}</span>
                    </div>
                )}

                {error && (
                    <div className="alert alert-error">
                        <AlertCircle size={18} />
                        <span>{error}</span>
                    </div>
                )}

                <div className="orders-scroll-wrapper">
                    {loading ? (
                        <DashboardSkeleton type="list" />
                    ) : orders.length === 0 ? (
                        <div className="empty-state">
                            <ShoppingBag size={60} style={{ color: '#e2e8f0', marginBottom: '15px' }} />
                            <h3>No Orders Found</h3>
                            <p>Looks like there are no orders matching your criteria.</p>
                        </div>
                    ) : (
                        <div className="orders-display">
                            <div className={`order-manage-item header-row`}>
                                <div className={`order-manage-grid ${!isAdmin ? 'user-view' : ''}`}>
                                    <div className="order-num-col sortable" onClick={() => handleSort('orderNumber')}>
                                        <span>ORDER #</span> {renderSortIcon('orderNumber')}
                                    </div>
                                    {isAdmin && (
                                        <div className="order-user-col sortable" onClick={() => handleSort('userName')}>
                                            <span>CUSTOMER</span> {renderSortIcon('userName')}
                                        </div>
                                    )}
                                    <div className="order-date-col sortable" onClick={() => handleSort('createdAt')}>
                                        <span>DATE</span> {renderSortIcon('createdAt')}
                                    </div>
                                    <div className="order-items-col">ITEMS</div>
                                    <div className="order-total-col sortable" onClick={() => handleSort('totalPrice')}>
                                        <span>TOTAL</span> {renderSortIcon('totalPrice')}
                                    </div>
                                    <div className="order-status-col sortable" onClick={() => handleSort('status')}>
                                        <span>STATUS</span> {renderSortIcon('status')}
                                    </div>
                                    <div className="order-actions-col">ACTIONS</div>
                                </div>
                            </div>
                            {orders.map(order => (
                                <div key={order._id} className="order-manage-item list-row">
                                    <div className={`order-manage-grid ${!isAdmin ? 'user-view' : ''}`}>
                                        <div className="order-num-col">
                                            <span className="order-id-badge">{order.orderNumber}</span>
                                        </div>
                                        
                                        {isAdmin && (
                                            <div className="order-user-col">
                                                {order.user && typeof order.user === 'object' ? (
                                                    <>
                                                        <span className="user-name">{order.user.firstName} {order.user.lastName}</span>
                                                        <span className="user-email">{order.user.email}</span>
                                                    </>
                                                ) : (
                                                    <span className="user-name">Guest / Deleted User</span>
                                                )}
                                            </div>
                                        )}

                                        <div className="order-date-col">
                                            <span className="date-text">{new Date(order.createdAt).toLocaleDateString()}</span>
                                        </div>

                                        <div className="order-items-col">
                                            <span className="items-summary">
                                                {order.orderItems?.[0]?.name || 'Unknown Item'}
                                                {order.orderItems?.length > 1 && ` + ${order.orderItems.length - 1} more`}
                                            </span>
                                            <span className="items-qty">{order.orderItems?.reduce((acc, item) => acc + item.qty, 0)} qty</span>
                                        </div>

                                        <div className="order-total-col">
                                            <span className="total-price">₹{order.totalPrice.toLocaleString()}</span>
                                        </div>

                                        <div className="order-status-col">
                                            {isAdmin ? (
                                                <div className="status-select-wrapper">
                                                    <select 
                                                        value={order.status} 
                                                        onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                                                        className={`status-tag-select ${order.status.toLowerCase()}`}
                                                    >
                                                        <option value="Pending">Pending</option>
                                                        <option value="Processing">Processing</option>
                                                        <option value="Shipped">Shipped</option>
                                                        <option value="Delivered">Delivered</option>
                                                        <option value="Cancelled">Cancelled</option>
                                                    </select>
                                                </div>
                                            ) : (
                                                <span className={`status-tag ${order.status.toLowerCase()}`}>
                                                    {order.status}
                                                </span>
                                            )}
                                        </div>

                                        <div className="order-actions-col row-actions">
                                            <button 
                                                className="row-action view" 
                                                title="View Details"
                                                onClick={() => navigate(`/dashboard/orders/${order._id}`)}
                                            >
                                                <Eye size={16} />
                                            </button>
                                            <button className="row-action more">
                                                <MoreVertical size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {totalItems > 10 && !loading && (
                    <div className="premium-pagination">
                        <div className="pagination-info">
                            Showing <span>{orders.length}</span> of <span>{totalItems}</span> orders
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
            </div>
        </DashboardLayout>
    );
};

export default DashboardOrdersPage;
