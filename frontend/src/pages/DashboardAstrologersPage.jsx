import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/Dashboard/DashboardLayout';
import { Plus, Users, Mail, Phone, Calendar, Search, ShieldCheck, Sparkles, Settings, Trash2, Filter, ChevronDown } from 'lucide-react';
import { userService } from '../services';
import { IMAGE_BASE_URL } from '../api/axiosInstance';

import DashboardSkeleton from '../components/DashboardSkeleton/DashboardSkeleton';
import './DashboardAstrologersPage.css';

const DashboardAstrologersPage = () => {
    const [astrologers, setAstrologers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const fetchAstrologers = async () => {
        try {
            setLoading(true);
            const data = await userService.fetchAstrologers();
            setAstrologers(data);
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch astrologers:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAstrologers();
    }, []);

    const handleDelete = async (id, name) => {
        if (window.confirm(`Are you sure you want to remove ${name} from the sacred network?`)) {
            try {
                await userService.deleteAstrologer(id);
                setAstrologers(astrologers.filter(a => a._id !== id));
            } catch (error) {
                alert('Failed to remove astrologer');
            }
        }
    };

    const filteredAstrologers = astrologers.filter(astro => 
        `${astro.firstName} ${astro.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        astro.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <DashboardLayout>
            <div className="astrologers-manage-container">
                <div className="page-header">
                    <div className="header-top">
                        <div className="header-info">
                            <div className="header-icon">
                                <ShieldCheck size={24} />
                            </div>
                            <div className="header-text">
                                <h1 className="premium-title">Astro Directory</h1>
                                <p className="premium-subtitle">Manage and onboard sacred spiritual guides for the community</p>
                            </div>
                        </div>
                        <button className="btn-add-premium" onClick={() => navigate('/dashboard/astrologers/add')}>
                            <Plus size={20} strokeWidth={3} />
                            <span>Onboard New Guide</span>
                        </button>
                    </div>
                </div>

                <div className="controls-bar">
                    <div className="controls-left">
                        <div className="premium-search-container">
                            <Search size={18} className="search-icon" />
                            <input 
                                type="text" 
                                placeholder="Search guides by name or email..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {loading ? (
                    <DashboardSkeleton type="grid" />
                ) : filteredAstrologers.length === 0 ? (
                    <div className="empty-state">
                        <Users size={80} style={{ color: '#e2e8f0', marginBottom: '20px' }} />
                        <h3>No Astrologers Found</h3>
                        <p>Try adjusting your search or onboarding a new guide.</p>
                    </div>
                ) : (
                    <div className="astrologers-grid">
                        {filteredAstrologers.map(astro => (
                            <div key={astro._id} className="astro-card-premium">
                                <div className="card-image-area">
                                    <div className="astro-avatar-large">
                                        {astro.image ? (
                                            <img src={astro.image.startsWith('http') ? astro.image : `${IMAGE_BASE_URL}${astro.image}`} alt={astro.firstName} />
                                        ) : (
                                            <>{astro.firstName[0]}{astro.lastName[0]}</>
                                        )}
                                    </div>
                                    <div className="card-top-badges">
                                        <div className="expert-badge">
                                            <Sparkles size={12} />
                                            <span>Expert</span>
                                        </div>
                                    </div>
                                    <div className="card-image-overlay"></div>
                                </div>
                                
                                <div className="card-content">
                                    <div className="astro-main-info">
                                        <h3>{astro.firstName} {astro.lastName}</h3>
                                        <p className="astro-role-tag">Sacred Spiritual Guide</p>
                                    </div>

                                    <div className="astro-contact-details">
                                        <div className="contact-item">
                                            <Mail size={14} />
                                            <span>{astro.email}</span>
                                        </div>
                                        <div className="contact-item">
                                            <Phone size={14} />
                                            <span>{astro.mobile}</span>
                                        </div>
                                        <div className="contact-item">
                                            <Calendar size={14} />
                                            <span>Joined {new Date(astro.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>

                                    <div className="card-actions-full">
                                        <button className="action-btn-p manage" onClick={() => navigate(`/dashboard/astrologers/edit/${astro._id}`)}>
                                            <Settings size={16} />
                                            <span>Manage</span>
                                        </button>
                                        <button className="action-btn-p remove" onClick={() => handleDelete(astro._id, `${astro.firstName} ${astro.lastName}`)}>
                                            <Trash2 size={16} />
                                            <span>Remove</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default DashboardAstrologersPage;

