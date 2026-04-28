import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import DashboardLayout from '../components/Dashboard/DashboardLayout';
import { 
    Plus, Trash2, Edit2, Package, AlertCircle, 
    CheckCircle, Tag, LayoutGrid, Search, 
    ChevronLeft, ChevronRight, Filter, ChevronDown, 
    ArrowUpDown, ChevronUp 
} from 'lucide-react';
import { productService, categoryService } from '../services';
import { IMAGE_BASE_URL } from '../api/axiosInstance';

import DashboardSkeleton from '../components/DashboardSkeleton/DashboardSkeleton';
import './DashboardProductsPage.css';

const DashboardProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [viewMode, setViewMode] = useState(localStorage.getItem('productsViewMode') || 'grid');
    
    // Filter & Pagination States
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [collections, setCollections] = useState([]);
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
        localStorage.setItem('productsViewMode', mode);
    };

    const fetchCollections = async () => {
        try {
            const data = await categoryService.fetchProductCategories();
            setCollections(data);
        } catch (err) {
            console.error('Failed to fetch collections');
        }
    };


    const fetchData = async () => {
        try {
            setLoading(true);
            setProducts([]); // Reset products
            
            // Artificial delay for consistency
            await new Promise(resolve => setTimeout(resolve, 600));

            const filters = {
                admin: 'true',
                page,
                limit: 10,
                search: debouncedSearch,
                status: statusFilter,
                collection: categoryFilter !== 'all' ? categoryFilter : '',
                sortField,
                sortOrder
            };
            const data = await productService.fetchProducts(filters);
            setProducts(data.products || []);
            setTotalPages(data.pages || 1);
            setTotalItems(data.total || 0);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch products');
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchCollections();
    }, []);

    useEffect(() => {
        fetchData();
    }, [debouncedSearch, statusFilter, categoryFilter, page, sortField, sortOrder]);

    const handleSort = (field) => {
        if (sortField === field) {
            // Cycle: DESC -> ASC -> Default(createdAt DESC)
            if (sortOrder === -1) {
                setSortOrder(1);
            } else if (sortOrder === 1) {
                setSortField('createdAt');
                setSortOrder(-1);
            }
        } else {
            setSortField(field);
            setSortOrder(-1); // Default to DESC for new field
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
            const data = await productService.toggleStatus(id);
            setProducts(products.map(p => p._id === id ? { ...p, isActive: data.isActive } : p));
            setSuccess(`Status updated to ${data.isActive ? 'Active' : 'Inactive'}`);
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            setError('Failed to update status');
            setTimeout(() => setError(null), 3000);
        }
    };


    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;
        try {
            await productService.deleteProduct(id);
            setSuccess('Product deleted');
            fetchData();
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            setError('Failed to delete product');
        }
    };


    return (
        <DashboardLayout>
            <div className={`dashboard-products-container ${viewMode}-view`}>
                <div className="page-header">
                    <div className="header-left">
                        <div className="header-text-group">
                            <h1 className="premium-title">Products Management</h1>
                        </div>
                    </div>

                    <div className="header-right">
                        <button className="btn-add-premium" onClick={() => navigate('/dashboard/products/add')}>
                            <Plus size={18} />
                            <span>Add New Product</span>
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

                        <div className="filter-item-pill">
                            <Tag size={16} className="pill-icon" />
                            <span className="pill-text">
                                {categoryFilter === 'all' ? 'Category' : (collections.find(c => c._id === categoryFilter)?.name || 'Category')}
                            </span>
                            <ChevronDown size={14} className="pill-chevron" />
                            <select 
                                value={categoryFilter} 
                                onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
                                className="overlay-select"
                            >
                                <option value="all">All Categories</option>
                                {collections.map(col => (
                                    <option key={col._id} value={col._id}>{col.name}</option>
                                ))}
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

                <div className={`products-container-inner ${viewMode}-layout`}>
                    {viewMode === 'list' && (
                        <div className="products-scroll-wrapper">
                            {loading ? (
                                <DashboardSkeleton type="list" />
                            ) : products.length === 0 ? (
                                <div className="empty-state">
                                    <Package size={60} style={{ color: '#e2e8f0', marginBottom: '15px' }} />
                                    <h3>No Products Found</h3>
                                    <p>Adjust your search or filters.</p>
                                </div>
                            ) : (
                                <div className="products-display">
                                    <div className="product-manage-item header-row">
                                        <div className="product-manage-grid">
                                            <div className="item-image-col">IMAGE</div>
                                            <div className="product-name-col sortable" onClick={() => handleSort('name')}>
                                                <span>PRODUCT NAME</span> {renderSortIcon('name')}
                                            </div>
                                            <div className="product-pricing-col sortable" onClick={() => handleSort('sellingPrice')}>
                                                <span>PRICING</span> {renderSortIcon('sellingPrice')}
                                            </div>
                                            <div className="product-stock-col sortable" onClick={() => handleSort('stock')}>
                                                <span>STOCK</span> {renderSortIcon('stock')}
                                            </div>
                                            <div className="product-status-col sortable" onClick={() => handleSort('isActive')}>
                                                <span>STATUS</span> {renderSortIcon('isActive')}
                                            </div>
                                            <div className="product-actions-col">ACTIONS</div>
                                        </div>
                                    </div>
                                    {products.map(product => (
                                        <div key={product._id} className={`product-manage-item list-row ${!product.isActive ? 'is-inactive' : ''}`}>
                                            <div className="product-manage-grid">
                                                <div className="item-image-col">
                                                    <div className="circular-img-wrapper">
                                                        <img 
                                                            src={product.image?.startsWith('http') ? product.image : `${IMAGE_BASE_URL}${product.image}`} 
                                                            alt={product.name} 
                                                        />
                                                    </div>
                                                </div>

                                                <div className="product-name-col">
                                                    <Link to={`/product/${product._id}`} className="product-name-link">
                                                        <span className="main-name">{product.name}</span>
                                                        <span className="sub-name">{product.collection?.name || 'No Category'}</span>
                                                    </Link>
                                                </div>

                                                <div className="product-pricing-col">
                                                    <div className="pricing-data">
                                                        <span className="sale-price">₹{product.sellingPrice}</span>
                                                        <span className="old-price">₹{product.mrp}</span>
                                                    </div>
                                                </div>

                                                <div className="product-stock-col">
                                                    <span className={`stock-count ${product.stock > 0 ? 'in' : 'out'}`}>
                                                        {product.stock}
                                                    </span>
                                                </div>

                                                <div className="product-status-col">
                                                    <label className="toggle-switch">
                                                        <input 
                                                            type="checkbox" 
                                                            checked={product.isActive} 
                                                            onChange={() => handleToggleStatus(product._id)}
                                                        />
                                                        <span className="toggle-slider"></span>
                                                    </label>
                                                </div>

                                                <div className="product-actions-col row-actions">
                                                    <button className="row-action edit" onClick={() => navigate(`/dashboard/products/edit/${product._id}`)}>
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button className="row-action delete" onClick={() => handleDelete(product._id)}>
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
                            ) : products.length === 0 ? (
                                <div className="empty-state">
                                    <Package size={80} style={{ color: '#e2e8f0', marginBottom: '20px' }} />
                                    <h3>No Products Found</h3>
                                    <p>Try adjusting your search or filters.</p>
                                </div>
                            ) : (
                                <div className="products-display">
                                    {products.map(product => (
                                        <div key={product._id} className={`product-manage-item ${!product.isActive ? 'is-inactive' : ''}`}>
                                            <div className="item-image">
                                                <img 
                                                    src={product.image?.startsWith('http') ? product.image : `${IMAGE_BASE_URL}${product.image}`} 
                                                    alt={product.name} 
                                                />
                                                <div className="card-badges">
                                                    <span className={`badge ${product.isActive ? 'active' : 'inactive'}`}>
                                                        {product.isActive ? 'Active' : 'Inactive'}
                                                    </span>
                                                </div>
                                                <div className="product-collection-tag">
                                                    <Tag size={12} />
                                                    <span>{product.collection?.name || 'No Collection'}</span>
                                                </div>
                                                <div className="card-overlay"></div>
                                            </div>
                                            <div className="item-content">
                                                <div className="card-info-wrap">
                                                    <div className="product-info-col">
                                                        <h3>{product.name}</h3>
                                                    </div>

                                                    <div className="item-details-group">
                                                        <div className="price-info product-price-col">
                                                            <span className="current-price">₹{product.sellingPrice}</span>
                                                            {product.mrp > product.sellingPrice && (
                                                                <span className="original-price">₹{product.mrp}</span>
                                                            )}
                                                        </div>
                                                        <div className="stock-info product-stock-col">
                                                            <span className={product.stock > 0 ? 'in-stock' : 'out-of-stock'}>
                                                                {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="item-actions">
                                                    <button className="action-btn edit" onClick={() => navigate(`/dashboard/products/edit/${product._id}`)}>
                                                        <Edit2 size={18} />
                                                    </button>
                                                    <button className="action-btn delete" onClick={() => handleDelete(product._id)}>
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
                                Showing <span>{products.length}</span> of <span>{totalItems}</span> articles
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

export default DashboardProductsPage;
