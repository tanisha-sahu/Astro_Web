import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import DashboardLayout from '../components/Dashboard/DashboardLayout';
import { 
    Trash2, Package, AlertCircle, 
    CheckCircle, Tag, LayoutGrid, Search, 
    Heart, ChevronLeft, ChevronRight, ArrowUpDown, 
    ChevronUp, ChevronDown, Eye
} from 'lucide-react';
import { wishlistService } from '../services';
import { IMAGE_BASE_URL } from '../api/axiosInstance';
import { useWishlist } from '../context/WishlistContext';

import DashboardSkeleton from '../components/DashboardSkeleton/DashboardSkeleton';
import './DashboardProductsPage.css'; // Reuse products page CSS

const DashboardFavoritesPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [viewMode, setViewMode] = useState(localStorage.getItem('productsViewMode') || 'grid');
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    
    const { toggleWishlist } = useWishlist();
    const navigate = useNavigate();

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    const toggleViewMode = (mode) => {
        setViewMode(mode);
        localStorage.setItem('productsViewMode', mode);
    };

    const fetchData = async () => {
        try {
            setLoading(true);
            setProducts([]);
            
            // Artificial delay for consistency
            await new Promise(resolve => setTimeout(resolve, 600));

            const data = await wishlistService.getWishlist();
            setProducts(data || []);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch favorite products');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleRemoveFavorite = async (id) => {
        try {
            await toggleWishlist(id);
            setProducts(products.filter(p => p._id !== id));
            setSuccess('Removed from favorites');
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            setError('Failed to remove from favorites');
        }
    };

    const filteredProducts = products.filter(p => 
        p.name.toLowerCase().includes(debouncedSearch.toLowerCase())
    );

    return (
        <DashboardLayout>
            <div className={`dashboard-products-container ${viewMode}-view`}>
                <div className="page-header">
                    <div className="header-left">
                        <div className="header-text-group">
                            <h1 className="premium-title">My Favorites</h1>
                            <p className="premium-subtitle">Manage your sacred collection of spiritual articles</p>
                        </div>
                    </div>
                    
                    <div className="header-right">
                        <button className="btn-add-premium" onClick={() => navigate('/sanatani-life')}>
                            <Search size={18} />
                            <span>Explore Products</span>
                        </button>
                    </div>
                </div>

                <div className="controls-bar">
                    <div className="controls-left">
                        <div className="premium-search-container">
                            <Search size={18} className="search-icon" />
                            <input 
                                type="text" 
                                placeholder="Search favorites..." 
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
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

                    <div className="controls-right">
                        {/* Right side is now empty in Favorites page, but kept for layout consistency */}
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
                            ) : filteredProducts.length === 0 ? (
                                <div className="empty-state">
                                    <Heart size={60} style={{ color: '#e2e8f0', marginBottom: '15px' }} />
                                    <h3>No Favorites Found</h3>
                                    <p>{search ? 'Adjust your search.' : 'You haven\'t added any products to your favorites yet.'}</p>
                                </div>
                            ) : (
                                <div className="products-display">
                                    <div className="product-manage-item header-row">
                                        <div className="product-manage-grid">
                                            <div className="item-image-col">IMAGE</div>
                                            <div className="product-name-col">
                                                <span>PRODUCT NAME</span>
                                            </div>
                                            <div className="product-pricing-col">
                                                <span>PRICING</span>
                                            </div>
                                            <div className="product-stock-col">
                                                <span>STATUS</span>
                                            </div>
                                            <div className="product-actions-col">ACTIONS</div>
                                        </div>
                                    </div>
                                    {filteredProducts.map(product => (
                                        <div key={product._id} className="product-manage-item list-row">
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
                                                        <span className="sub-name">{product.collection?.name || 'Vedic Article'}</span>
                                                    </Link>
                                                </div>

                                                <div className="product-pricing-col">
                                                    <div className="pricing-data">
                                                        <span className="sale-price">₹{product.sellingPrice}</span>
                                                    </div>
                                                </div>

                                                <div className="product-stock-col">
                                                    <span className={`stock-count ${product.stock > 0 ? 'in' : 'out'}`}>
                                                        {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                                                    </span>
                                                </div>

                                                <div className="product-actions-col row-actions">
                                                    <button className="row-action delete" onClick={() => handleRemoveFavorite(product._id)} title="Remove from favorites">
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
                            ) : filteredProducts.length === 0 ? (
                                <div className="empty-state">
                                    <Heart size={80} style={{ color: '#e2e8f0', marginBottom: '20px' }} />
                                    <h3>No Favorites Found</h3>
                                    <p>{search ? 'Try adjusting your search.' : 'You haven\'t added any favorites yet.'}</p>
                                </div>
                            ) : (
                                <div className="products-display">
                                    {filteredProducts.map(product => (
                                        <div key={product._id} className="product-manage-item">
                                            <div className="item-image">
                                                <img 
                                                    src={product.image?.startsWith('http') ? product.image : `${IMAGE_BASE_URL}${product.image}`} 
                                                    alt={product.name} 
                                                />
                                                <div className="product-collection-tag">
                                                    <Tag size={12} />
                                                    <span>{product.collection?.name || 'Vedic Article'}</span>
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
                                                        </div>
                                                        <div className="stock-info product-stock-col">
                                                            <span className={product.stock > 0 ? 'in-stock' : 'out-of-stock'}>
                                                                {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="item-actions">
                                                    <button className="action-btn view" onClick={() => navigate(`/product/${product._id}`)}>
                                                        <Eye size={18} />
                                                    </button>
                                                    <button className="action-btn delete" onClick={() => handleRemoveFavorite(product._id)}>
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
                </div>
            </div>
        </DashboardLayout>
    );
};

export default DashboardFavoritesPage;
