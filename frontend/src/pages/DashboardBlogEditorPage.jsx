import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/Dashboard/DashboardLayout';
import BlogForm from '../components/Dashboard/BlogForm';
import { BookOpen, Sparkles, AlertCircle } from 'lucide-react';
import { blogService } from '../services';
import { uploadImageApi } from '../api/upload';
import DashboardSkeleton from '../components/DashboardSkeleton/DashboardSkeleton';


const DashboardBlogEditorPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = Boolean(id);
    
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(isEditMode);
    const [error, setError] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        if (isEditMode) {
            const fetchData = async () => {
                try {
                    const data = await blogService.fetchBlogByIdOrSlug(id);
                    setBlog(data);
                    setLoading(false);

                } catch (err) {
                    console.error('Fetch error:', err);
                    setError('Failed to load blog details');
                    setLoading(false);
                }
            };
            fetchData();
        }
    }, [id, isEditMode]);

    const handleFormSubmit = async (formData, selectedFiles) => {
        setIsProcessing(true);
        setError(null);
        
        try {
            let imageUrl = formData.image;

            // Upload image if a new file is selected
            if (selectedFiles && selectedFiles.length > 0) {
                const uploadRes = await uploadImageApi(selectedFiles[0]);
                imageUrl = uploadRes.url;
            }


            const dataToSubmit = { 
                ...formData,
                image: imageUrl
            };

            if (isEditMode) {
                await blogService.updateBlog(id, dataToSubmit);
            } else {
                await blogService.createBlog(dataToSubmit);
            }


            navigate('/dashboard/blogs');
        } catch (err) {
            console.error('Submission error:', err);
            setError(err.response?.data?.message || 'Failed to save blog');
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
                                {isEditMode ? <Sparkles className="text-orange-500" size={32} /> : <BookOpen className="text-orange-500" size={32} />}
                                {isEditMode ? 'Edit Divine Chronicle' : 'Compose New Wisdom'}
                            </h1>
                            <p className="editor-subtitle">
                                {isEditMode ? `Polishing the sacred teachings of ${blog?.title || 'this article'}` : 'Share your celestial insights and Vedic knowledge with the seekers'}
                            </p>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="alert alert-error" style={{ marginBottom: '25px', padding: '15px', background: '#fee2e2', border: '1px solid #fecaca', borderRadius: '12px', color: '#b91c1c', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <AlertCircle size={20} />
                        <span>{error}</span>
                    </div>
                )}

                {loading ? (
                    <DashboardSkeleton type="form" />
                ) : (
                    <BlogForm 
                        initialData={blog || {}}
                        onSubmit={handleFormSubmit}
                        onCancel={() => navigate('/dashboard/blogs')}
                        isLoading={isProcessing}
                    />
                )}
            </div>
        </DashboardLayout>
    );
};

export default DashboardBlogEditorPage;
