import React, { useState, useRef, useEffect } from 'react';
import { 
    Tag, Package, IndianRupee, Info, 
    FileText, Sparkles, Plus, Minus, 
    Upload, X, CheckCircle, AlertCircle,
    ChevronDown, Eye, ToggleLeft, ToggleRight,
    Loader2, Trash2, Layers
} from 'lucide-react';
import { IMAGE_BASE_URL } from '../../api/axiosInstance';
import './ProductForm.css';

const ProductForm = ({ 
    initialData = {}, 
    collections = [], 
    onSubmit, 
    onCancel,
    isLoading = false 
}) => {
    const [formData, setFormData] = useState({
        name: '',
        shortDescription: '',
        description: '',
        mrp: '',
        sellingPrice: '',
        collection: '',
        stock: '',
        status: 'Active',
        specifications: [{ label: '', value: '' }],
        careInstructions: [''],
        ...initialData
    });

    const [selectedFiles, setSelectedFiles] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [errors, setErrors] = useState({});
    const fileInputRef = useRef(null);


    useEffect(() => {
        if (initialData && Object.keys(initialData).length > 0) {
            // Normalize product data for the form
            setFormData(prev => ({
                ...prev,
                ...initialData,
                // Ensure collection is just the ID string for the dropdown
                collection: initialData.collection?._id || initialData.collection || ''
            }));

            // Handle images
            if (initialData.image) {
                const fullUrl = initialData.image.startsWith('http') 
                    ? initialData.image 
                    : `${IMAGE_BASE_URL}${initialData.image}`;
                setPreviews([fullUrl]);
            } else if (initialData.images && initialData.images.length > 0) {
                const imgUrls = initialData.images.map(img => 
                    img.startsWith('http') ? img : `${IMAGE_BASE_URL}${img}`
                );
                setPreviews(imgUrls);
            }
        }
    }, [initialData]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        const val = type === 'checkbox' ? (checked ? 'Active' : 'Inactive') : value;
        setFormData(prev => ({ ...prev, [name]: val }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            setSelectedFiles(prev => [...prev, ...files]);
            const newPreviews = files.map(file => URL.createObjectURL(file));
            setPreviews(prev => [...prev, ...newPreviews]);
        }
    };

    const removePreview = (e, index) => {
        e.stopPropagation();
        setPreviews(prev => prev.filter((_, i) => i !== index));
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const addRow = (type) => {
        if (type === 'spec') {
            setFormData(p => ({ ...p, specifications: [...p.specifications, { label: '', value: '' }] }));
        } else {
            setFormData(p => ({ ...p, careInstructions: [...p.careInstructions, ''] }));
        }
    };

    const removeRow = (type, index) => {
        if (type === 'spec') {
            setFormData(p => ({ ...p, specifications: p.specifications.filter((_, i) => i !== index) }));
        } else {
            setFormData(p => ({ ...p, careInstructions: p.careInstructions.filter((_, i) => i !== index) }));
        }
    };

    const updateRow = (type, index, field, value) => {
        if (type === 'spec') {
            const newSpecs = [...formData.specifications];
            newSpecs[index][field] = value;
            setFormData(p => ({ ...p, specifications: newSpecs }));
        } else {
            const newCare = [...formData.careInstructions];
            newCare[index] = value;
            setFormData(p => ({ ...p, careInstructions: newCare }));
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.name) newErrors.name = 'Product name is required';
        if (!formData.sellingPrice) newErrors.sellingPrice = 'Selling price is required';
        if (!formData.collection) newErrors.collection = 'Please select a category';
        if (!formData.stock) newErrors.stock = 'Stock quantity is required';
        if (previews.length === 0) newErrors.images = 'At least one image is required';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            onSubmit(formData, selectedFiles);
        }
    };

    return (
        <form className="product-form-container" onSubmit={handleSubmit}>
            {/* Essential Info Card */}
            <div className="premium-card">
                <h3 className="section-title-premium"><Info size={22} /> Essential Information</h3>
                
                <div className="form-group full-width" style={{ marginBottom: '10px' }}>
                    <label className="form-label">Product Full Name*</label>
                    <div className="input-wrapper">
                        <Tag className="input-icon" size={20} />
                        <input 
                            type="text" 
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="e.g. Pure Panchdhatu Astrological Ring"
                            className={`premium-input ${errors.name ? 'error' : ''}`}
                        />
                    </div>
                    {errors.name && <span className="error-msg">{errors.name}</span>}
                </div>

                <div className="form-grid">
                    <div className="form-group">
                        <label className="form-label">Category / Collection*</label>
                        <div className="input-wrapper">
                            <Layers className="input-icon" size={20} />
                            <select 
                                name="collection" 
                                value={formData.collection}
                                onChange={handleInputChange}
                                className={`premium-select ${errors.collection ? 'error' : ''}`}
                            >
                                <option value="">Select Category</option>
                                {collections.map(c => (
                                    <option key={c._id} value={c._id}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                        {errors.collection && <span className="error-msg">{errors.collection}</span>}
                    </div>

                    <div className="form-group">
                        <label className="form-label">Inventory Stock*</label>
                        <div className="input-wrapper">
                            <Package className="input-icon" size={20} />
                            <input 
                                type="number" 
                                name="stock"
                                value={formData.stock}
                                onChange={handleInputChange}
                                placeholder="Units available"
                                className={`premium-input ${errors.stock ? 'error' : ''}`}
                            />
                        </div>
                        {errors.stock && <span className="error-msg">{errors.stock}</span>}
                    </div>

                    <div className="form-group">
                        <label className="form-label">Market Price (MRP)*</label>
                        <div className="input-wrapper">
                            <IndianRupee className="input-icon" size={20} />
                            <input 
                                type="number" 
                                name="mrp"
                                value={formData.mrp}
                                onChange={handleInputChange}
                                placeholder="0.00"
                                className="premium-input"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Special Selling Price*</label>
                        <div className="input-wrapper">
                            <IndianRupee className="input-icon" size={20} />
                            <input 
                                type="number" 
                                name="sellingPrice"
                                value={formData.sellingPrice}
                                onChange={handleInputChange}
                                placeholder="0.00"
                                className={`premium-input ${errors.sellingPrice ? 'error' : ''}`}
                            />
                        </div>
                        {errors.sellingPrice && <span className="error-msg">{errors.sellingPrice}</span>}
                    </div>
                </div>
            </div>

            {/* Visibility & Media Card */}
            <div className="premium-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                    <h3 className="section-title-premium" style={{ margin: 0 }}><Eye size={22} /> Visibility & Media</h3>
                    <div className="status-toggle-container">
                        <span className="form-label" style={{ margin: 0, color: formData.status === 'Active' ? '#ff7000' : '#64748b' }}>
                            {formData.status}
                        </span>
                        <label className="switch">
                            <input 
                                type="checkbox" 
                                name="status"
                                checked={formData.status === 'Active'}
                                onChange={handleInputChange}
                            />
                            <span className="slider"></span>
                        </label>
                    </div>
                </div>

                <div className="file-upload-section">
                    <div className="drop-zone" onClick={() => fileInputRef.current?.click()}>
                        {!previews.length && (
                            <>
                                <Upload className="upload-icon" size={48} />
                                <h4 className="upload-title">Divine Product Media</h4>
                                <p className="upload-subtitle">Upload original, high-resolution spiritual photographs</p>
                            </>
                        )}
                        
                        <input 
                            type="file" 
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            multiple
                            hidden
                            accept="image/*"
                        />

                        {previews.length > 0 && (
                            <div className="preview-grid" onClick={(e) => e.stopPropagation()}>
                                {previews.map((url, idx) => (
                                    <div key={idx} className="preview-container">
                                        <img src={url} alt={`Preview ${idx}`} />
                                        <button type="button" className="btn-remove-preview" onClick={(e) => removePreview(e, idx)}>
                                            <X size={16} />
                                        </button>
                                    </div>
                                ))}
                                {/* Add More Button inside the grid */}
                                <div className="add-more-preview" onClick={() => fileInputRef.current?.click()}>
                                    <Plus size={24} />
                                    <span>Add More</span>
                                </div>
                            </div>
                        )}
                    </div>
                    {errors.images && <span className="error-msg" style={{ marginTop: '12px', display: 'block' }}>{errors.images}</span>}
                </div>
            </div>

            {/* Content & Story Card */}
            <div className="premium-card">
                <h3 className="section-title-premium"><FileText size={22} /> Product Narrative</h3>
                <div className="form-group" style={{ marginBottom: '25px' }}>
                    <label className="form-label">Divine Tagline</label>
                    <div className="input-wrapper">
                        <Sparkles className="input-icon" size={20} />
                        <input 
                            type="text" 
                            name="shortDescription"
                            value={formData.shortDescription}
                            onChange={handleInputChange}
                            placeholder="One sentence that captures the essence"
                            className="premium-input"
                        />
                    </div>
                </div>
                <div className="form-group">
                    <label className="form-label">Spiritual Backstory & Details*</label>
                    <textarea 
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Describe the spiritual significance, craftsmanship, and benefits..."
                        className="premium-textarea no-icon"
                        style={{ paddingLeft: '16px !important' }}
                    ></textarea>
                </div>
            </div>

            {/* Technical Attributes Card */}
            <div className="premium-card">
                <div className="form-grid">
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h3 className="section-title-premium" style={{ margin: 0, fontSize: '1rem' }}><Layers size={18} /> Specifications</h3>
                            <button type="button" className="btn-add" onClick={() => addRow('spec')}>
                                <Plus size={14} /> Add New
                            </button>
                        </div>
                        {formData.specifications.map((spec, idx) => (
                            <div key={idx} className="dynamic-row">
                                <input 
                                    placeholder="Label" 
                                    className="premium-input no-icon" 
                                    value={spec.label}
                                    style={{ paddingLeft: '16px !important' }}
                                    onChange={(e) => updateRow('spec', idx, 'label', e.target.value)}
                                />
                                <input 
                                    placeholder="Value" 
                                    className="premium-input no-icon" 
                                    value={spec.value}
                                    style={{ paddingLeft: '16px !important' }}
                                    onChange={(e) => updateRow('spec', idx, 'value', e.target.value)}
                                />
                                <button type="button" className="btn-remove" onClick={() => removeRow('spec', idx)}>
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))}
                    </div>

                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h3 className="section-title-premium" style={{ margin: 0, fontSize: '1rem' }}><CheckCircle size={18} /> Care Guide</h3>
                            <button type="button" className="btn-add" onClick={() => addRow('care')}>
                                <Plus size={14} /> Add New
                            </button>
                        </div>
                        {formData.careInstructions.map((care, idx) => (
                            <div key={idx} className="dynamic-row">
                                <input 
                                    placeholder="Instruction detail" 
                                    className="premium-input no-icon" 
                                    value={care}
                                    style={{ paddingLeft: '16px !important' }}
                                    onChange={(e) => updateRow('care', idx, null, e.target.value)}
                                />
                                <button type="button" className="btn-remove" onClick={() => removeRow('care', idx)}>
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={onCancel}>Cancel</button>
                <button type="submit" className="btn-submit" disabled={isLoading}>
                    {isLoading ? (
                        <><Loader2 className="animate-spin" size={20} /> Securing Divine Data...</>
                    ) : (
                        <><CheckCircle size={20} /> {initialData?._id ? 'Update' : 'Create'}</>
                    )}
                </button>
            </div>
        </form>
    );
};

export default ProductForm;
