import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from '../components/Dashboard/DashboardLayout';
import { UserPlus, Mail, Lock, Phone, Calendar, User, ArrowLeft, ShieldCheck, AlertCircle, Send, Save, Sparkles } from 'lucide-react';
import { userService } from '../services';
import DashboardSkeleton from '../components/DashboardSkeleton/DashboardSkeleton';
import './DashboardAstrologerAddPage.css'; // Reuse existing styles

const DashboardAstrologerEditorPage = () => {
    const { id } = useParams();
    const isEditMode = Boolean(id);
    const navigate = useNavigate();
    
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(isEditMode);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        mobile: '',
        dob: ''
    });

    useEffect(() => {
        if (isEditMode) {
            const fetchAstro = async () => {
                try {
                    const data = await userService.fetchAstrologerById(id);
                    setFormData({
                        firstName: data.firstName || '',
                        lastName: data.lastName || '',
                        email: data.email || '',
                        password: '', // Don't pre-fill password for security
                        mobile: data.mobile || '',
                        dob: data.dob ? data.dob.split('T')[0] : ''
                    });
                    setFetching(false);
                } catch (err) {
                    setError('Failed to fetch guide details');
                    setFetching(false);
                }
            };
            fetchAstro();
        }
    }, [id, isEditMode]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (isEditMode) {
                // For edit, only send password if it's changed
                const updateData = { ...formData };
                if (!updateData.password) delete updateData.password;
                
                await userService.updateAstrologer(id, updateData);
            } else {
                await userService.onboardAstrologer({
                    ...formData,
                    roles: ['astrologer']
                });
            }

            navigate('/dashboard/astrologers');
        } catch (err) {
            setError(err.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'register'} astrologer`);
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <DashboardLayout>
                <DashboardSkeleton type="form" />
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="astrologer-add-container">
                <div className="registration-card">
                    <div className="card-form-area">
                        <div className="form-header-premium">
                            <div className="header-icon-box">
                                {isEditMode ? <Sparkles size={28} /> : <UserPlus size={28} />}
                            </div>
                            <h2>{isEditMode ? 'Manage Guide' : 'Onboard Astrologer'}</h2>
                            <p>
                                {isEditMode 
                                    ? 'Update the profile and spiritual details of this celestial guide'
                                    : 'Register a new spiritual guide to expand the sacred network and share divine wisdom'}
                            </p>
                        </div>

                        {error && (
                            <div className="error-banner">
                                <AlertCircle size={18} />
                                <span>{error}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="premium-form">
                            <div className="form-group">
                                <label>
                                    <User size={12} />
                                    First Name
                                </label>
                                <div className="input-container">
                                    <User size={18} />
                                    <input 
                                        type="text" 
                                        name="firstName" 
                                        value={formData.firstName} 
                                        onChange={handleChange} 
                                        required 
                                        placeholder="E.g. Siddharth"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>
                                    <User size={12} />
                                    Last Name
                                </label>
                                <div className="input-container">
                                    <User size={18} />
                                    <input 
                                        type="text" 
                                        name="lastName" 
                                        value={formData.lastName} 
                                        onChange={handleChange} 
                                        required 
                                        placeholder="E.g. Sharma"
                                    />
                                </div>
                            </div>

                            <div className="form-group full-width">
                                <label>
                                    <Mail size={12} />
                                    Email Address
                                </label>
                                <div className="input-container">
                                    <Mail size={18} />
                                    <input 
                                        type="email" 
                                        name="email" 
                                        value={formData.email} 
                                        onChange={handleChange} 
                                        required 
                                        placeholder="official@astrosanatani.com"
                                    />
                                </div>
                            </div>

                            <div className="form-group full-width">
                                <label>
                                    <Lock size={12} />
                                    {isEditMode ? 'Update Access Key (Leave blank to keep current)' : 'Temporary Access Key'}
                                </label>
                                <div className="input-container">
                                    <Lock size={18} />
                                    <input 
                                        type="password" 
                                        name="password" 
                                        value={formData.password} 
                                        onChange={handleChange} 
                                        required={!isEditMode} 
                                        placeholder={isEditMode ? 'New secure password' : 'Generate a secure temporary password'}
                                        minLength="6"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>
                                    <Phone size={12} />
                                    Mobile Connectivity
                                </label>
                                <div className="input-container">
                                    <Phone size={18} />
                                    <input 
                                        type="tel" 
                                        name="mobile" 
                                        value={formData.mobile} 
                                        onChange={handleChange} 
                                        required 
                                        placeholder="+91 XXXXX XXXXX"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>
                                    <Calendar size={12} />
                                    Date of Awakening
                                </label>
                                <div className="input-container">
                                    <Calendar size={18} />
                                    <input 
                                        type="date" 
                                        name="dob" 
                                        value={formData.dob} 
                                        onChange={handleChange} 
                                        required 
                                    />
                                </div>
                            </div>

                            <div className="form-actions-premium">
                                <button type="button" className="cancel-button" onClick={() => navigate('/dashboard/astrologers')}>
                                    Dismiss
                                </button>
                                <button type="submit" className="submit-button-premium" disabled={loading}>
                                    {loading ? 'Processing...' : (isEditMode ? 'Update Profile' : 'Grant Access')}
                                    {isEditMode ? <Save size={16} /> : <Send size={16} />}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default DashboardAstrologerEditorPage;
