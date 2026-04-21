import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/Dashboard/DashboardLayout';
import { Plus, Trash2, Edit2, LayoutGrid, AlertCircle, CheckCircle, Package, MoreVertical } from 'lucide-react';
import axios from 'axios';
import './DashboardCollectionsPage.css';

const DashboardCollectionsPage = () => {
    const [collections, setCollections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [viewMode, setViewMode] = useState(localStorage.getItem('collectionsViewMode') || 'grid');
    const navigate = useNavigate();

    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
    const IMAGE_BASE_URL = API_BASE_URL.replace('/api/v1', '');

    const toggleViewMode = (mode) => {
        setViewMode(mode);
        localStorage.setItem('collectionsViewMode', mode);
    };

    const fetchCollections = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_BASE_URL}/collections?admin=true`, {
                withCredentials: true
            });
            setCollections(response.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch collections');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCollections();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this collection?')) return;
        try {
            await axios.delete(`${API_BASE_URL}/collections/${id}`, {
                withCredentials: true
            });
            setSuccess('Collection deleted successfully');
            fetchCollections();
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
                        <div className="header-content">
                            <h1 className="premium-title">Collections Management</h1>
                            <p className="premium-subtitle">Total inventory groupings: <strong>{collections.length}</strong></p>
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
                        </div>
                        <button className="btn-add-premium" onClick={() => navigate('/dashboard/collections/add')}>
                            <Plus size={20} />
                            <span>Add New Collection</span>
                        </button>
                    </div>
                </div>

                {success && (
                    <div className="premium-alert success">
                        <CheckCircle size={18} />
                        <span>{success}</span>
                    </div>
                )}

                {error && (
                    <div className="premium-alert error">
                        <AlertCircle size={18} />
                        <span>{error}</span>
                    </div>
                )}

                <div className={`collections-container-inner ${viewMode}-layout`}>
                    {viewMode === 'list' && (
                        <div className="collections-scroll-wrapper">
                            {loading ? (
                                <div className="loading-state">Loading collections...</div>
                            ) : collections.length === 0 ? (
                                <div className="empty-state">
                                    <Package size={48} />
                                    <h3>No Collections Found</h3>
                                    <p>Start organizing your products by creating your first collection.</p>
                                </div>
                            ) : (
                                <div className="collections-display">
                                    <div className="collection-manage-item header-row">
                                        <div className="item-image">IMAGE</div>
                                        <div className="collection-info-col">COLLECTION NAME</div>
                                        <div className="collection-desc-col">DESCRIPTION</div>
                                        <div className="collection-status-col">STATUS</div>
                                        <div className="item-actions">ACTIONS</div>
                                    </div>
                                    {collections.map(collection => (
                                        <div key={collection._id} className="collection-manage-item">
                                            <div className="item-image">
                                                <img 
                                                    src={collection.image?.startsWith('http') ? collection.image : `${IMAGE_BASE_URL}${collection.image}`} 
                                                    alt={collection.name} 
                                                />
                                            </div>
                                            
                                            <div className="collection-info-col">
                                                <h3>{collection.name}</h3>
                                            </div>

                                            <div className="collection-desc-col">
                                                <p className="collection-list-desc">{collection.description}</p>
                                            </div>

                                            <div className="collection-status-col">
                                                <span className={`status-pill ${collection.isActive ? 'active' : 'inactive'}`}>
                                                    {collection.isActive ? 'Active' : 'Inactive'}
                                                </span>
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
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {viewMode === 'grid' && (
                        <>
                            {loading ? (
                                <div className="loading-state">Loading collections...</div>
                            ) : collections.length === 0 ? (
                                <div className="empty-state">
                                    <Package size={48} />
                                    <h3>No Collections Found</h3>
                                    <p>Start organizing your products by creating your first collection.</p>
                                </div>
                            ) : (
                                <div className="collections-display">
                                    {collections.map(collection => (
                                        <div key={collection._id} className="collection-manage-item">
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

                                            <div className="collection-info-col">
                                                <h3>{collection.name}</h3>
                                                <p className="collection-grid-desc">{collection.description}</p>
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

export default DashboardCollectionsPage;
