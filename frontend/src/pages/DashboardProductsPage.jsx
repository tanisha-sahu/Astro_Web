import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import DashboardLayout from '../components/Dashboard/DashboardLayout';
import { Plus, Trash2, Edit2, Package, AlertCircle, CheckCircle, Tag, LayoutGrid } from 'lucide-react';
import axiosInstance, { IMAGE_BASE_URL } from '../api/axiosInstance';
import './DashboardProductsPage.css';

const DashboardProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [viewMode, setViewMode] = useState(localStorage.getItem('productsViewMode') || 'grid');
    const navigate = useNavigate();


    const toggleViewMode = (mode) => {
        setViewMode(mode);
        localStorage.setItem('productsViewMode', mode);
    };

    const fetchData = async () => {
        try {
            setLoading(true);
            const productsRes = await axiosInstance.get('/products?admin=true');
            setProducts(productsRes.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch products');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;
        try {
            await axiosInstance.delete(`/products/${id}`);
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
                        <div className="header-text">
                            <h1 className="premium-title">Products Management</h1>
                            <p className="premium-subtitle">Total inventory items: {products.length}</p>
                        </div>
                    </div>

                    <div className="header-right">
                        <div className="view-switcher-pill">
                            <button 
                                className={`pill-btn ${viewMode === 'grid' ? 'active' : ''}`}
                                onClick={() => toggleViewMode('grid')}
                            >
                                <LayoutGrid size={18} />
                                <span>Grid</span>
                            </button>
                            <button 
                                className={`pill-btn ${viewMode === 'list' ? 'active' : ''}`}
                                onClick={() => toggleViewMode('list')}
                            >
                                <span className="list-icon">≡</span>
                                <span>List</span>
                            </button>
                            <div className={`active-glider ${viewMode}`}></div>
                        </div>
                        <button className="btn-add-premium" onClick={() => navigate('/dashboard/products/add')}>
                            <Plus size={20} />
                            <span>Add New Product</span>
                        </button>
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
                            {products.length > 0 && !loading && (
                                <div className="list-headers">
                                    <div className="header-col col-img">Image</div>
                                    <div className="header-col col-name">Product Name</div>
                                    <div className="header-col col-price">Selling Price</div>
                                    <div className="header-col col-mrp">MRP</div>
                                    <div className="header-col col-stock">Stock</div>
                                    <div className="header-col col-actions">Actions</div>
                                </div>
                            )}

                            {loading ? (
                                <div className="loading-state">Loading products...</div>
                            ) : products.length === 0 ? (
                                <div className="empty-state">
                                    <Package size={48} />
                                    <h3>No Products Found</h3>
                                    <p>Get started by adding your first product.</p>
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
                                                {viewMode === 'grid' && (
                                                    <div className="product-collection-tag">
                                                        <Tag size={12} />
                                                        <span>{product.collection?.name || 'No Collection'}</span>
                                                    </div>
                                                )}
                                                <div className="card-overlay"></div>
                                            </div>
                                            <div className="item-content">
                                                <div className="card-info-wrap">
                                                    <div className="product-info-col">
                                                        <Link to={`/product/${product._id}`} className="product-list-link">
                                                            <h3>{product.name}</h3>
                                                        </Link>
                                                    </div>

                                                    <div className="item-details-group">
                                                        <div className="price-info product-price-col">
                                                            <span className="current-price">₹{product.sellingPrice}</span>
                                                        </div>
                                                        <div className="mrp-info product-mrp-col">
                                                            <span className="original-price">₹{product.mrp}</span>
                                                        </div>
                                                        <div className="stock-info product-stock-col">
                                                            <span className={product.stock > 0 ? 'in-stock' : 'out-of-stock'}>
                                                                {product.stock}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="item-actions product-actions-col">
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
                        </div>
                    )}

                    {viewMode === 'grid' && (
                        <>
                            {loading ? (
                                <div className="loading-state">Loading products...</div>
                            ) : products.length === 0 ? (
                                <div className="empty-state">
                                    <Package size={48} />
                                    <h3>No Products Found</h3>
                                    <p>Get started by adding your first product.</p>
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

                                                <div className="item-actions product-actions-col">
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
                </div>
            </div>
        </DashboardLayout>
    );
};

export default DashboardProductsPage;
