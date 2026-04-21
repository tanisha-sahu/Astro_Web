import React, { useState, useEffect, useRef } from 'react';
import { 
    LayoutGrid, 
    Type, 
    FileText, 
    Upload, 
    CheckCircle, 
    X, 
    Loader2, 
    Eye, 
    EyeOff 
} from 'lucide-react';
import axios from 'axios';
import './CollectionForm.css';

const CollectionForm = ({ initialData = null, isEditMode = false, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        image: '',
        isActive: true
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);

    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || '',
                description: initialData.description || '',
                image: initialData.image || '',
                isActive: initialData.isActive !== undefined ? initialData.isActive : true
            });
            if (initialData.image) {
                const IMAGE_BASE_URL = API_BASE_URL.replace('/api/v1', '');
                setPreviewUrl(initialData.image.startsWith('http') ? initialData.image : `${IMAGE_BASE_URL}${initialData.image}`);
            }
        }
    }, [initialData, API_BASE_URL]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleToggleChange = () => {
        setFormData(prev => ({ ...prev, isActive: !prev.isActive }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const removeImage = (e) => {
        e.stopPropagation();
        setSelectedFile(null);
        setPreviewUrl(null);
        setFormData(prev => ({ ...prev, image: '' }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            let imageUrl = formData.image;

            // 1. Upload image if a new file is chosen
            if (selectedFile) {
                const uploadFormData = new FormData();
                uploadFormData.append('image', selectedFile);

                const uploadRes = await axios.post(`${API_BASE_URL}/upload`, uploadFormData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                    withCredentials: true
                });
                imageUrl = uploadRes.data.url;
            }

            // 2. Submit Collection Data
            const dataToSubmit = { ...formData, image: imageUrl };
            
            if (isEditMode && initialData?._id) {
                await axios.put(`${API_BASE_URL}/collections/${initialData._id}`, dataToSubmit, {
                    withCredentials: true
                });
            } else {
                await axios.post(`${API_BASE_URL}/collections`, dataToSubmit, {
                    withCredentials: true
                });
            }

            onSave();
        } catch (err) {
            console.error('Submit error:', err);
            setError(err.response?.data?.message || 'Failed to save collection');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form className="collection-form-container" onSubmit={handleSubmit}>
            {error && (
                <div className="premium-alert error">
                    <div className="alert-glow"></div>
                    <X size={18} />
                    <span>{error}</span>
                </div>
            )}

            {/* Essential Identity Card */}
            <div className="premium-card">
                <h3 className="section-title-premium"><LayoutGrid size={22} /> Identity & Concept</h3>
                <div className="form-group">
                    <label className="form-label">Collection Name*</label>
                    <div className="input-wrapper">
                        <Type className="input-icon" size={20} />
                        <input 
                            type="text" 
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="e.g. Sacred Rudraksha Series"
                            className="premium-input"
                            required
                        />
                    </div>
                </div>
                <div className="form-group">
                    <label className="form-label">Story & Description</label>
                    <textarea 
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Define the purpose and significance of this collection..."
                        className="premium-textarea no-icon"
                        required
                    ></textarea>
                </div>
            </div>

            {/* Media & Visibility Card */}
            <div className="premium-card">
                <h3 className="section-title-premium"><Upload size={22} /> Presentation & Status</h3>
                
                <div className="form-group" style={{ marginBottom: '30px' }}>
                    <label className="form-label">Collection Visual</label>
                    <div className="drop-zone" onClick={() => fileInputRef.current?.click()}>
                        {previewUrl ? (
                            <div className="preview-container">
                                <img src={previewUrl} alt="Collection Preview" />
                                <button type="button" className="btn-remove-image" onClick={removeImage}>
                                    <X size={18} />
                                </button>
                            </div>
                        ) : (
                            <div className="upload-prompt">
                                <Upload className="upload-icon" size={48} />
                                <h4 className="upload-title">Select Hero Image</h4>
                                <p className="upload-subtitle">High resolution images (1:1) work best</p>
                            </div>
                        )}
                        <input 
                            type="file" 
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            hidden
                            accept="image/*"
                        />
                    </div>
                </div>

                <div className="status-card">
                    <div className="status-label-wrap" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div className={`status-icon-circle ${formData.isActive ? 'active' : 'inactive'}`}>
                            {formData.isActive ? <Eye size={20} /> : <EyeOff size={20} />}
                        </div>
                        <div className="status-text-content">
                            <span className="status-main-text" style={{ display: 'block', fontWeight: 800, color: '#1a1a1a' }}>
                                {formData.isActive ? 'Live on Store' : 'Hidden for Now'}
                            </span>
                            <span className="status-sub-text" style={{ fontSize: '0.8rem', color: '#64748b' }}>
                                {formData.isActive ? 'Publicly visible to all seekers' : 'Visible only to the administration'}
                            </span>
                        </div>
                    </div>
                    <label className="switch">
                        <input type="checkbox" checked={formData.isActive} onChange={handleToggleChange} />
                        <span className="slider"></span>
                    </label>
                </div>
            </div>

            {/* Form Actions */}
            <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={onCancel}>Cancel</button>
                <button type="submit" className="btn-submit" disabled={isLoading}>
                    {isLoading ? (
                        <><Loader2 className="animate-spin" size={20} /> Securing...</>
                    ) : (
                        <><CheckCircle size={20} /> {isEditMode ? 'Update Collection' : 'Create Collection'}</>
                    )}
                </button>
            </div>
        </form>
    );
};

export default CollectionForm;
