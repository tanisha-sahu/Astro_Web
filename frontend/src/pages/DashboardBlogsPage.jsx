import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import DashboardLayout from '../components/Dashboard/DashboardLayout';
import { 
    Plus, Trash2, Edit2, FileText, 
    AlertCircle, CheckCircle, Tag, 
    Calendar, Eye, User, Globe, Lock,
    BookOpen, Settings, Sparkles, Search
} from 'lucide-react';
import { blogService } from '../services';

import useAuthStore from '../store/authStore';
import { ROLES } from '../constants/roles';
import DashboardSkeleton from '../components/DashboardSkeleton/DashboardSkeleton';
import './DashboardBlogsPage.css';

const DashboardBlogsPage = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    const { user } = useAuthStore();

    const isAdmin = user?.roles?.includes(ROLES.ADMIN);

    const fetchData = async () => {
        try {
            setLoading(true);
            setBlogs([]); // Reset blogs
            
            // Artificial delay for consistency
            await new Promise(resolve => setTimeout(resolve, 600));

            const data = isAdmin ? await blogService.fetchAdminBlogs() : await blogService.fetchMyBlogs();
            setBlogs(data);
            setLoading(false);

        } catch (err) {
            setError('Failed to fetch blogs');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [isAdmin]);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this blog?')) return;
        try {
            await blogService.deleteBlog(id);
            setSuccess('Blog deleted successfully');
            fetchData();
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            setError('Failed to delete blog');
            setTimeout(() => setError(null), 3000);
        }
    };


    const handlePublishToggle = async (id, currentStatus) => {
        if (!isAdmin) return;
        try {
            await blogService.updateBlog(id, { isPublished: !currentStatus });
            setSuccess(`Blog is now ${!currentStatus ? 'Public' : 'Private'}`);
            fetchData();
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            setError('Failed to update status');
        }
    };


    const filteredBlogs = blogs.filter(blog => 
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.authorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <DashboardLayout>
            <div className="blogs-manage-container">
                <div className="page-header">
                    <div className="header-top">
                        <div className="header-info">
                            <div className="header-icon">
                                <BookOpen size={24} />
                            </div>
                            <div className="header-text">
                                <h1 className="premium-title">{isAdmin ? 'Divine Chronicles' : 'My Wisdom'}</h1>
                                <p className="premium-subtitle">
                                    {isAdmin ? 'Regulate and share sacred articles from the spiritual guides' : 'Manage your contributions to the celestial network'}
                                </p>
                            </div>
                        </div>
                        <button className="btn-add-premium" onClick={() => navigate('/dashboard/blogs/add')}>
                            <Plus size={20} strokeWidth={3} />
                            <span>Write New Wisdom</span>
                        </button>
                    </div>
                </div>

                <div className="controls-bar">
                    <div className="controls-left">
                        <div className="premium-search-container">
                            <Search size={18} className="search-icon" />
                            <input 
                                type="text" 
                                placeholder="Search chronicles by title, guide, or category..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
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

                <div className="blogs-content-area">
                    {loading ? (
                        <DashboardSkeleton type="grid" />
                    ) : filteredBlogs.length === 0 ? (
                        <div className="empty-state">
                            <FileText size={80} style={{ color: '#e2e8f0', marginBottom: '20px' }} />
                            <h3>No Chronicles Found</h3>
                            <p>{searchTerm ? 'Try adjusting your search terms.' : (isAdmin ? 'No astrologers have shared their wisdom yet.' : 'Begin your journey of sharing Vedic knowledge with the world.')}</p>
                        </div>
                    ) : (
                        <div className="blogs-grid">
                            {filteredBlogs.map(blog => (
                                <div key={blog._id} className={`blog-card-premium ${!blog.isPublished ? 'is-draft' : ''}`}>
                                    <div className="card-media-area">
                                        <img src={blog.image} alt={blog.title} />
                                        <div className="card-top-badges">
                                            <span className={`status-badge-p ${blog.isPublished ? 'published' : 'draft'}`}>
                                                {blog.isPublished ? <Globe size={10} /> : <Lock size={10} />}
                                                {blog.isPublished ? 'Public' : 'Private'}
                                            </span>
                                        </div>
                                        <div className="category-badge-p">
                                            <Sparkles size={10} />
                                            <span>{blog.category}</span>
                                        </div>
                                        <div className="media-overlay"></div>
                                    </div>
                                    
                                    <div className="card-content">
                                        <div className="card-meta-info">
                                            <div className="meta-item-p">
                                                <Calendar size={12} />
                                                <span>{new Date(blog.createdAt).toLocaleDateString('en-IN', {
                                                    day: 'numeric',
                                                    month: 'short'
                                                })}</span>
                                            </div>
                                            {isAdmin && blog.authorName && (
                                                <div className="meta-item-p" title={blog.authorName}>
                                                    <User size={12} />
                                                    <span className="truncate">{blog.authorName.split(' ')[0]}</span>
                                                </div>
                                            )}
                                        </div>
                                        
                                        <h3 className="blog-card-title">{blog.title}</h3>
                                        <p className="blog-card-excerpt">{blog.excerpt}</p>
                                        
                                        <div className="card-actions-full">
                                            {isAdmin ? (
                                                <button 
                                                    className={`action-btn-p ${blog.isPublished ? 'unpublish' : 'publish'}`}
                                                    onClick={() => handlePublishToggle(blog._id, blog.isPublished)}
                                                >
                                                    {blog.isPublished ? <Lock size={16} /> : <Globe size={16} />}
                                                    <span>{blog.isPublished ? 'Make Private' : 'Make Public'}</span>
                                                </button>
                                            ) : (
                                                <button 
                                                    className="action-btn-p edit"
                                                    onClick={() => navigate(`/dashboard/blogs/edit/${blog._id}`)}
                                                >
                                                    <Edit2 size={16} />
                                                    <span>Edit</span>
                                                </button>
                                            )}
                                            
                                            {isAdmin ? (
                                                <button 
                                                    className="action-btn-p edit"
                                                    onClick={() => navigate(`/dashboard/blogs/edit/${blog._id}`)}
                                                >
                                                    <Edit2 size={16} />
                                                    <span>Edit</span>
                                                </button>
                                            ) : (
                                                <button 
                                                    className="action-btn-p delete"
                                                    onClick={() => handleDelete(blog._id)}
                                                >
                                                    <Trash2 size={16} />
                                                    <span>Delete</span>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default DashboardBlogsPage;
