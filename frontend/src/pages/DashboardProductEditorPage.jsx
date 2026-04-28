import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/Dashboard/DashboardLayout';
import ProductForm from '../components/Dashboard/ProductForm';
import { ChevronLeft, Package, Sparkles } from 'lucide-react';
import { productService, categoryService } from '../services';
import { uploadImageApi } from '../api/upload';
import DashboardSkeleton from '../components/DashboardSkeleton/DashboardSkeleton';


const DashboardProductEditorPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = Boolean(id);
    
    const [product, setProduct] = useState(null);
    const [collections, setCollections] = useState([]);
    const [loading, setLoading] = useState(isEditMode);
    const [error, setError] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);


    useEffect(() => {
        const fetchData = async () => {
            try {
                // Always fetch collections
                const data = await categoryService.fetchProductCategories();
                setCollections(data);

                if (isEditMode) {
                    const foundProduct = await productService.fetchProductByIdOrSlug(id);
                    setProduct(foundProduct);
                }

                setLoading(false);
            } catch (err) {
                console.error('Fetch error:', err);
                setError(err.response?.data?.message || 'Failed to load data');
                setLoading(false);
            }
        };

        fetchData();
    }, [id, isEditMode]);

    const handleFormSubmit = async (formData, selectedFiles) => {
        setIsProcessing(true);
        setError(null);
        
        try {
            let imageUrl = formData.image;

            // 1. Upload image if a new file is selected
            if (selectedFiles && selectedFiles.length > 0) {
                const uploadRes = await uploadImageApi(selectedFiles[0]);
                imageUrl = uploadRes.url;
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
                await productService.updateProduct(id, dataToSubmit);
            } else {
                await productService.createProduct(dataToSubmit);
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
                    <DashboardSkeleton type="form" />
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
