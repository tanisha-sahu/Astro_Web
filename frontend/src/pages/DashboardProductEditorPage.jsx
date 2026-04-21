import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/Dashboard/DashboardLayout';
import ProductForm from '../components/Dashboard/ProductForm';
import { ChevronLeft, Package, Sparkles } from 'lucide-react';
import axios from 'axios';

const DashboardProductEditorPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = Boolean(id);
    
    const [product, setProduct] = useState(null);
    const [collections, setCollections] = useState([]);
    const [loading, setLoading] = useState(isEditMode);
    const [error, setError] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Always fetch collections
                const collectionsRes = await axios.get(`${API_BASE_URL}/collections`, { withCredentials: true });
                setCollections(collectionsRes.data);

                if (isEditMode) {
                    const productRes = await axios.get(`${API_BASE_URL}/products/${id}`, { withCredentials: true });
                    setProduct(productRes.data);
                }
                setLoading(false);
            } catch (err) {
                console.error('Fetch error:', err);
                setError(err.response?.data?.message || 'Failed to load data');
                setLoading(false);
            }
        };

        fetchData();
    }, [id, isEditMode, API_BASE_URL]);

    const handleFormSubmit = async (formData, selectedFiles) => {
        setIsProcessing(true);
        setError(null);
        
        try {
            let imageUrl = formData.image;

            // 1. Upload image if a new file is selected
            if (selectedFiles && selectedFiles.length > 0) {
                const uploadFormData = new FormData();
                uploadFormData.append('image', selectedFiles[0]);

                const uploadRes = await axios.post(`${API_BASE_URL}/upload`, uploadFormData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                    withCredentials: true
                });
                imageUrl = uploadRes.data.url;
            }

            // 2. Prep data for submission
            const dataToSubmit = { 
                ...formData,
                mrp: Number(formData.mrp),
                sellingPrice: Number(formData.sellingPrice),
                stock: Number(formData.stock),
                image: imageUrl,
                specifications: (formData.specifications || []).filter(s => s?.label?.trim() || s?.value?.trim()),
                careInstructions: (formData.careInstructions || []).filter(c => c?.trim())
            };

            if (isEditMode) {
                await axios.put(`${API_BASE_URL}/products/${id}`, dataToSubmit, {
                    withCredentials: true
                });
            } else {
                await axios.post(`${API_BASE_URL}/products`, dataToSubmit, {
                    withCredentials: true
                });
            }

            navigate('/dashboard/products');
        } catch (err) {
            console.error('Submission error:', err);
            setError(err.response?.data?.message || 'Failed to save product');
            setIsProcessing(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="dashboard-editor-page-container">
                <div className="editor-page-header">
                    <div className="editor-header-content">
                        <div className="editor-title-group">
                            <h1 className="editor-main-title">
                                {isEditMode ? <Sparkles className="text-orange-500" size={32} /> : <Package className="text-orange-500" size={32} />}
                                {isEditMode ? 'Edit Product Details' : 'Create New Product'}
                            </h1>
                            <p className="editor-subtitle">
                                {isEditMode ? `Refine the spiritual essence of ${product?.name || 'this item'}` : 'Introduce a new sacred artifact to the Astro Sanatani collection'}
                            </p>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="alert alert-error" style={{ marginBottom: '25px', padding: '15px', background: '#fee2e2', border: '1px solid #fecaca', borderRadius: '12px', color: '#b91c1c', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span>⚠️ {error}</span>
                    </div>
                )}

                {loading ? (
                    <div className="loading-state" style={{ textAlign: 'center', padding: '50px' }}>
                        <p>Loading product details...</p>
                    </div>
                ) : (
                    <ProductForm 
                        initialData={product || {}}
                        collections={collections}
                        onSubmit={handleFormSubmit}
                        onCancel={() => navigate('/dashboard/products')}
                        isLoading={isProcessing}
                    />
                )}
            </div>
        </DashboardLayout>
    );
};

export default DashboardProductEditorPage;
