import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import DashboardLayout from '../components/Dashboard/DashboardLayout';
import { 
    Plus, Trash2, Edit2, LayoutGrid, AlertCircle, 
    CheckCircle, Package, Search, ChevronLeft, 
    ChevronRight, Filter, ChevronDown, ArrowUpDown, 
    ChevronUp 
} from 'lucide-react';
import { categoryService } from '../services';
import { IMAGE_BASE_URL } from '../api/axiosInstance';

import DashboardSkeleton from '../components/DashboardSkeleton/DashboardSkeleton';
import './DashboardCollectionsPage.css';

const DashboardCollectionsPage = () => {
    const [collections, setCollections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [viewMode, setViewMode] = useState(localStorage.getItem('collectionsViewMode') || 'grid');
    
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

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(1); // Reset to first page on search
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    const toggleViewMode = (mode) => {
        setViewMode(mode);
        localStorage.setItem('collectionsViewMode', mode);
    };

    const fetchData = async () => {
        try {
            setLoading(true);
            setCollections([]); // Reset collections
            
            // Artificial delay for consistency
            await new Promise(resolve => setTimeout(resolve, 600));

            const params = {
                admin: 'true',
                page,
                limit: 10,
                search: debouncedSearch,
                status: statusFilter,
                sortField,
                sortOrder
            };
            const data = await categoryService.fetchCollections(params);
            
            // Check if it's the paginated response or raw array
            if (data.collections) {
                setCollections(data.collections);
                setTotalPages(data.pages);
                setTotalItems(data.total);
            } else {
                setCollections(data);
                setTotalItems(data.length);
                setTotalPages(1);
            }
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch collections');
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchData();
    }, [debouncedSearch, statusFilter, page, sortField, sortOrder]);

    const handleSort = (field) => {
        if (sortField === field) {
            if (sortOrder === -1) {
                setSortOrder(1);
            } else if (sortOrder === 1) {
                setSortField('createdAt');
                setSortOrder(-1);
            }
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

    const handleToggleStatus = async (id) => {
        try {
            const data = await categoryService.toggleStatus(id);
            setCollections(collections.map(c => c._id === id ? { ...c, isActive: data.isActive } : c));
            setSuccess(`Status updated to ${data.isActive ? 'Active' : 'Inactive'}`);
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            setError('Failed to update status');
            setTimeout(() => setError(null), 3000);
        }
    };


    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this collection?')) return;
        try {
            await categoryService.deleteCollection(id);
            setSuccess('Collection deleted successfully');
            fetchData();
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            setError('Failed to delete collection');
        }
    };


    return (
        <DashboardLayout>
            <div className={`dashboard-collections-container ${viewMode}-view`}>
                <div className="page-header">
                    <div className="header-left">
                        <div className="header-text-group">
                            <h1 className="premium-title">Collections Management</h1>
                        </div>
                    </div>
                    
                    <div className="header-right">
                        <button className="btn-add-premium" onClick={() => navigate('/dashboard/collections/add')}>
                            <Plus size={18} />
                            <span>Add New Collection</span>
                        </button>
                    </div>
                </div>

                <div className="controls-bar">
                    <div className="controls-left">
                        <div className="premium-search-container">
                            <Search size={18} className="search-icon" />
                            <input 
                                type="text" 
                                placeholder="Search..." 
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="controls-right">
                        <div className="filter-item-pill">
                            <Filter size={16} className="pill-icon" />
                            <span className="pill-text">
                                {statusFilter === 'all' ? 'Status' : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
                            </span>
                            <ChevronDown size={14} className="pill-chevron" />
                            <select 
                                value={statusFilter} 
                                onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                                className="overlay-select"
                            >
                                <option value="all">All Status</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>

                        <div className="view-switcher-minimal">
                            <button 
                                className={`minimal-view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                                onClick={() => toggleViewMode('grid')}
                                title="Grid View"
                            >
                                <LayoutGrid size={18} />
                            </button>
                            <button 
                                className={`minimal-view-btn ${viewMode === 'list' ? 'active' : ''}`}
                                onClick={() => toggleViewMode('list')}
                                title="List View"
                            >
                                <span className="icon-bars">≡</span>
                            </button>
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

                <div className={`collections-container-inner ${viewMode}-layout`}>
                    {viewMode === 'list' && (
                        <div className="collections-scroll-wrapper">
                            {loading ? (
                                <DashboardSkeleton type="list" />
                            ) : collections.length === 0 ? (
                                <div className="empty-state">
                                    <Package size={60} style={{ color: '#e2e8f0', marginBottom: '15px' }} />
                                    <h3>No Collections Found</h3>
                                    <p>Adjust your search or filters.</p>
                                </div>
                            ) : (
                                <div className="collections-display">
                                    <div className="collection-manage-item header-row">
                                        <div className="collection-manage-grid">
                                            <div className="item-image-col">IMAGE</div>
                                            <div className="collection-name-col sortable" onClick={() => handleSort('name')}>
                                                <span>COLLECTION NAME</span> {renderSortIcon('name')}
                                            </div>
                                            <div className="collection-desc-col">
                                                <span>DESCRIPTION</span>
                                            </div>
                                            <div className="collection-status-col sortable" onClick={() => handleSort('isActive')}>
                                                <span>STATUS</span> {renderSortIcon('isActive')}
                                            </div>
                                            <div className="collection-actions-col">ACTIONS</div>
                                        </div>
                                    </div>
                                    {collections.map(collection => (
                                        <div key={collection._id} className={`collection-manage-item list-row ${!collection.isActive ? 'is-inactive' : ''}`}>
                                            <div className="collection-manage-grid">
                                                <div className="item-image-col">
                                                    <div className="circular-img-wrapper">
                                                        <img 
                                                            src={collection.image?.startsWith('http') ? collection.image : `${IMAGE_BASE_URL}${collection.image}`} 
                                                            alt={collection.name} 
                                                        />
                                                    </div>
                                                </div>
                                                
                                                <div className="collection-name-col">
                                                    <Link to={`/collection/${collection.slug}`} className="collection-name-link">
                                                        <span className="main-name">{collection.name}</span>
                                                        <span className="sub-name">Collection</span>
                                                    </Link>
                                                </div>

                                                <div className="collection-desc-col">
                                                    <p className="collection-list-desc">{collection.description}</p>
                                                </div>

                                                <div className="collection-status-col">
                                                    <label className="toggle-switch">
                                                        <input 
                                                            type="checkbox" 
                                                            checked={collection.isActive} 
                                                            onChange={() => handleToggleStatus(collection._id)}
                                                        />
                                                        <span className="toggle-slider"></span>
                                                    </label>
                                                </div>

                                                <div className="collection-actions-col row-actions">
                                                    <button className="row-action edit" onClick={() => navigate(`/dashboard/collections/edit/${collection._id}`)}>
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button className="row-action delete" onClick={() => handleDelete(collection._id)}>
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {viewMode === 'grid' && (
                        <>
                            {loading ? (
                                <DashboardSkeleton type="grid" />
                            ) : collections.length === 0 ? (
                                <div className="empty-state">
                                    <Package size={80} style={{ color: '#e2e8f0', marginBottom: '20px' }} />
                                    <h3>No Collections Found</h3>
                                    <p>Try adjusting your search or filters.</p>
                                </div>
                            ) : (
                                <div className="collections-display">
                                    {collections.map(collection => (
                                        <div key={collection._id} className={`collection-manage-item ${!collection.isActive ? 'is-inactive' : ''}`}>
                                            <div className="item-image">
                                                <img 
                                                    src={collection.image?.startsWith('http') ? collection.image : `${IMAGE_BASE_URL}${collection.image}`} 
                                                    alt={collection.name} 
                                                />
                                                <div className="card-badges">
                                                    <span className={`badge ${collection.isActive ? 'active' : 'inactive'}`}>
                                                        {collection.isActive ? 'Active' : 'Inactive'}
                                                    </span>
                                                </div>
                                                <div className="card-overlay"></div>
                                            </div>

                                            <div className="item-content">
                                                <div className="card-info-wrap">
                                                    <div className="collection-info-col">
                                                        <h3>{collection.name}</h3>
                                                        <p className="collection-grid-desc">{collection.description}</p>
                                                    </div>
                                                </div>

                                                <div className="item-actions">
                                                    <button className="action-btn edit" onClick={() => navigate(`/dashboard/collections/edit/${collection._id}`)}>
                                                        <Edit2 size={18} />
                                                    </button>
                                                    <button className="action-btn delete" onClick={() => handleDelete(collection._id)}>
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}

                    {/* Pagination Controls */}
                    {totalItems > 0 && !loading && (
                        <div className="premium-pagination">
                            <div className="pagination-info">
                                Showing <span>{collections.length}</span> of <span>{totalItems}</span> collections
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
            </div>
        </DashboardLayout>
    );
};

export default DashboardCollectionsPage;
