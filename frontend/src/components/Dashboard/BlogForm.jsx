import React, { useState, useRef, useEffect } from 'react';
import { 
    Tag, FileText, Info, 
    Sparkles, Upload, X, CheckCircle, 
    Eye, Loader2, Layers, Clock, BookOpen
} from 'lucide-react';
import { IMAGE_BASE_URL } from '../../api/axiosInstance';
import './BlogForm.css';

const CATEGORIES = ['Vedas', 'Jyotish', 'Mythology', 'Spirituality', 'Chronicles', 'Other'];

const BlogForm = ({ 
    initialData = {}, 
    onSubmit, 
    onCancel,
    isLoading = false 
}) => {
    const [formData, setFormData] = useState({
        title: '',
        excerpt: '',
        content: '',
        category: 'Other',
        image: '',
        ...initialData
    });

    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState('');
    const [errors, setErrors] = useState({});
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (initialData && Object.keys(initialData).length > 0) {
            setFormData(prev => ({
                ...prev,
                ...initialData
            }));

            if (initialData.image) {
                const fullUrl = initialData.image.startsWith('http') 
                    ? initialData.image 
                    : `${IMAGE_BASE_URL}${initialData.image}`;
                setPreview(fullUrl);
            }
        }
    }, [initialData]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        const val = type === 'checkbox' ? checked : value;
        setFormData(prev => ({ ...prev, [name]: val }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreview(URL.createObjectURL(file));
            if (errors.image) setErrors(prev => ({ ...prev, image: null }));
        }
    };

    const removePreview = (e) => {
        e.stopPropagation();
        setPreview('');
        setSelectedFile(null);
        setFormData(prev => ({ ...prev, image: '' }));
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.title) newErrors.title = 'Blog title is required';
        if (!formData.excerpt) newErrors.excerpt = 'Excerpt is required';
        if (!formData.content) newErrors.content = 'Content is required';
        if (!preview) newErrors.image = 'Featured image is required';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            onSubmit(formData, selectedFile ? [selectedFile] : []);
        }
    };

    return (
        <form className="blog-form-container simple-form" onSubmit={handleSubmit}>
            <div className="premium-card single-card">
                <div className="form-header">
                    <h3 className="form-title"><BookOpen size={18} /> Compose Blog</h3>
                    <p className="form-subtitle">Share your spiritual wisdom with the world</p>
                </div>

                <div className="form-body">
                    {/* Title & Category Row */}
                    <div className="form-row">
                        <div className="form-group flex-2">
                            <label className="simple-label">Article Title*</label>
                            <input 
                                type="text" 
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                placeholder="Enter title..."
                                className={`simple-input ${errors.title ? 'error' : ''}`}
                            />
                            {errors.title && <span className="error-text">{errors.title}</span>}
                        </div>

                        <div className="form-group flex-1">
                            <label className="simple-label">Category*</label>
                            <select 
                                name="category" 
                                value={formData.category}
                                onChange={handleInputChange}
                                className="simple-select"
                            >
                                {CATEGORIES.map(c => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Excerpt */}
                    <div className="form-group">
                        <label className="simple-label">Short Excerpt*</label>
                        <textarea 
                            name="excerpt"
                            value={formData.excerpt}
                            onChange={handleInputChange}
                            placeholder="A brief summary for seekers..."
                            className={`simple-textarea small ${errors.excerpt ? 'error' : ''}`}
                            rows="2"
                        ></textarea>
                        {errors.excerpt && <span className="error-text">{errors.excerpt}</span>}
                    </div>

                    {/* Featured Image - Compact Upload */}
                    <div className="form-group">
                        <label className="simple-label">Featured Image*</label>
                        <div className="compact-upload-zone" onClick={() => fileInputRef.current?.click()}>
                            {!preview ? (
                                <div className="upload-cta">
                                    <Upload size={16} /> <span>Click to upload image</span>
                                </div>
                            ) : (
                                <div className="compact-preview">
                                    <img src={preview} alt="Preview" />
                                    <button type="button" className="remove-btn" onClick={removePreview}>
                                        <X size={14} />
                                    </button>
                                </div>
                            )}
                            <input type="file" ref={fileInputRef} onChange={handleFileChange} hidden accept="image/*" />
                        </div>
                        {errors.image && <span className="error-text">{errors.image}</span>}
                    </div>

                    {/* Main Content */}
                    <div className="form-group">
                        <label className="simple-label">Full Article Content*</label>
                        <textarea 
                            name="content"
                            value={formData.content}
                            onChange={handleInputChange}
                            placeholder="Write your article details here..."
                            className={`simple-textarea large ${errors.content ? 'error' : ''}`}
                            rows="8"
                        ></textarea>
                        {errors.content && <span className="error-text">{errors.content}</span>}
                    </div>
                </div>

                <div className="form-footer">
                    <button type="button" className="simple-btn secondary" onClick={onCancel}>Cancel</button>
                    <button type="submit" className="simple-btn primary" disabled={isLoading}>
                        {isLoading ? (
                            <><Loader2 className="animate-spin" size={16} /> Saving...</>
                        ) : (
                            <CheckCircle size={16} /> && (initialData?._id ? 'Update Changes' : 'Save & Submit')
                        )}
                    </button>
                </div>
            </div>
        </form>
    );
};

export default BlogForm;
