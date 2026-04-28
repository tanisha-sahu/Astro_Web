import React, { useState } from 'react';
import useAuthStore from '../store/authStore';
import { User, Mail, Phone, Calendar, LogOut, Edit2, Check, X, Camera, Shield, Trash2, AlertTriangle, AlertCircle, CheckCircle, Image as ImageIcon, Upload, Monitor, Smartphone, ChevronRight } from 'lucide-react';
import { uploadImageApi } from '../api/upload';
import { getImageUrl } from '../utils/imageUtils';
import './ProfilePage.css';

export default function ProfilePage() {
  const { user, logout, updateProfile, deleteAccount, changePassword } = useAuthStore();
  const [editingField, setEditingField] = useState(null);
  const [tempValue, setTempValue] = useState({});
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [showPasswordDropdown, setShowPasswordDropdown] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  if ((loading || uploading) && !user) return <ProfileSkeleton />;
  // If we already have a user, we can still show skeleton during major updates if desired
  // The user specifically asked to show skeleton instead of rotating loader
  if (loading || uploading) return <ProfileSkeleton />;
  if (!user) return null;

  const handleEdit = (field, value) => {
    setEditingField(field);
    setTempValue({ ...tempValue, [field]: value });
  };

  const handleCancel = () => {
    setEditingField(null);
    setTempValue({});
  };

  const handleSave = async (field) => {
    setLoading(true);
    try {
      let updateData = {};
      if (field === 'name') {
        const [firstName, ...lastNameParts] = tempValue[field].split(' ');
        updateData = { firstName, lastName: lastNameParts.join(' ') };
      } else {
        updateData = { [field]: tempValue[field] };
      }
      
      await updateProfile(updateData);
      setEditingField(null);
    } catch (error) {
      console.error('Update failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    e.stopPropagation();
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const data = await uploadImageApi(file);
      await updateProfile({ image: data.url });
      setShowAvatarModal(false);
    } catch (error) {
      console.error('Image upload failed:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
      e.target.value = ''; // Clear input
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteAccount();
    } catch (error) {
      console.error('Deletion failed:', error);
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordErrors({});
    setPasswordSuccess(false);

    const errors = {};
    if (passwordForm.newPassword.length < 6) {
      errors.newPassword = 'Password must be at least 6 characters';
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors);
      return;
    }

    setLoading(true);
    try {
      await changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      setPasswordSuccess(true);
      setTimeout(() => {
        setShowPasswordDropdown(false);
        setPasswordSuccess(false);
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      }, 2000);
    } catch (error) {
      console.error('Password change failed:', error);
      setPasswordErrors({ 
        form: error.response?.data?.message || 'Failed to update password. Check current password.' 
      });
    } finally {
      setLoading(false);
    }
  };

  const ProfileItem = ({ icon: Icon, label, value, field, type = "text" }) => {
    const isEditing = editingField === field;
    
    return (
      <div className={`profile-detail-item ${isEditing ? 'is-editing' : ''}`}>
        <div className="item-icon-wrapper">
          <Icon size={20} />
        </div>
        <div className="item-main-content">
          <label>{label}</label>
          {isEditing ? (
            <div className="edit-input-group">
              <input 
                type={type}
                value={tempValue[field] || ''} 
                onChange={(e) => setTempValue({ ...tempValue, [field]: e.target.value })}
                autoFocus
              />
              <div className="edit-actions">
                <button type="button" onClick={() => handleSave(field)} className="save-btn" disabled={loading}>
                  <Check size={16} />
                </button>
                <button type="button" onClick={handleCancel} className="cancel-btn">
                  <X size={16} />
                </button>
              </div>
            </div>
          ) : (
            <div className="value-display-group">
              <p>{value || 'Not provided'}</p>
              {field !== 'email' && (
                <button type="button" onClick={() => handleEdit(field, value)} className="inline-edit-btn">
                  <Edit2 size={16} />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="profile-page-simple">
      <div className="profile-container">
        {/* Header/Hero Section */}
        <div className="profile-header-card">
          <div className="profile-avatar-wrapper">
            <div className="avatar-image-container">
              {user.image ? (
                <img src={getImageUrl(user.image)} alt={user.firstName} className="profile-image" />
              ) : (
                <div className="profile-avatar-placeholder">
                  <User size={48} />
                </div>
              )}
            </div>
            <button type="button" onClick={() => setShowAvatarModal(true)} className="avatar-edit-btn">
              <Camera size={18} />
            </button>
          </div>
          
          <div className="profile-intro">
            <h1>{user.firstName} {user.lastName}</h1>
            <p className="profile-email-badge">{user.email}</p>
          </div>

          <button type="button" onClick={logout} className="profile-logout-btn">
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Details Section */}
        <div className="profile-content-card">
          <div className="section-title-group">
            <h2>Account Information</h2>
            <p>View and update your personal profile details.</p>
          </div>

          <div className="profile-info-grid">
            <ProfileItem 
              icon={User} 
              label="Full Name" 
              value={`${user.firstName} ${user.lastName}`} 
              field="name"
            />
            <ProfileItem 
              icon={Mail} 
              label="Email Address" 
              value={user.email} 
              field="email"
            />
            <ProfileItem 
              icon={Phone} 
              label="Phone Number" 
              value={user.mobile} 
              field="mobile"
            />
            <ProfileItem 
              icon={Calendar} 
              label="Date of Birth" 
              value={user.dob} 
              field="dob"
              type="date"
            />
          </div>

          <div className="profile-actions-section">
            <div className={`profile-action-item expandable ${showPasswordDropdown ? 'is-expanded' : ''}`}>
              <div className="action-row-main">
                <div className="action-icon">
                  <Shield size={20} />
                </div>
                <div className="action-info">
                  <h4>Security Settings</h4>
                  <p>Manage your password and security preferences.</p>
                </div>
                <button 
                  type="button" 
                  onClick={() => setShowPasswordDropdown(!showPasswordDropdown)} 
                  className={`action-btn-outline ${showPasswordDropdown ? 'active' : ''}`}
                >
                  {showPasswordDropdown ? 'Cancel' : 'Change Password'}
                </button>
              </div>

              {showPasswordDropdown && (
                <div className="action-dropdown-content fade-in">
                  <div className="dropdown-header-mini">
                    <Shield size={18} className="shield-pulse" />
                    <span>Secure Password Update</span>
                  </div>

                  {passwordSuccess && (
                    <div className="form-status-msg success fade-in">
                      <CheckCircle size={18} />
                      <span>Password updated successfully!</span>
                    </div>
                  )}

                  {passwordErrors.form && (
                    <div className="form-status-msg error fade-in">
                      <AlertCircle size={18} />
                      <span>{passwordErrors.form}</span>
                    </div>
                  )}
                  
                  <form onSubmit={handlePasswordChange} className="password-dropdown-form">
                    <div className="form-grid-modern">
                      <div className="form-group-modern">
                        <label>Current Password</label>
                        <div className={`input-with-icon ${passwordErrors.form ? 'has-error' : ''}`}>
                          <Shield size={18} className="field-icon" />
                          <input 
                            type="password" 
                            placeholder="Enter current password to verify"
                            value={passwordForm.currentPassword}
                            onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                            required
                          />
                        </div>
                      </div>

                      <div className="form-grid-row">
                        <div className="form-group-modern">
                          <label>New Password</label>
                          <div className={`input-with-icon ${passwordErrors.newPassword ? 'has-error' : ''}`}>
                            <Shield size={18} className="field-icon" />
                            <input 
                              type="password" 
                              placeholder="Create new password"
                              value={passwordForm.newPassword}
                              onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                              required
                            />
                          </div>
                          {passwordErrors.newPassword && <span className="inline-error-msg">{passwordErrors.newPassword}</span>}
                        </div>

                        <div className="form-group-modern">
                          <label>Confirm Password</label>
                          <div className={`input-with-icon ${passwordErrors.confirmPassword ? 'has-error' : ''}`}>
                            <Shield size={18} className="field-icon" />
                            <input 
                              type="password" 
                              placeholder="Repeat new password"
                              value={passwordForm.confirmPassword}
                              onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                              required
                            />
                          </div>
                          {passwordErrors.confirmPassword && <span className="inline-error-msg">{passwordErrors.confirmPassword}</span>}
                        </div>
                      </div>
                    </div>

                    <div className="dropdown-actions">
                      <button type="submit" className="btn-update-premium" disabled={loading || passwordSuccess}>
                        {loading ? 'Verifying...' : passwordSuccess ? 'Updated!' : 'Apply Security Update ✦'}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>

            <div className="profile-action-item danger">
              <div className="action-icon">
                <Trash2 size={20} />
              </div>
              <div className="action-info">
                <h4>Delete Account</h4>
                <p>Permanently remove your account and all data.</p>
              </div>
              <button type="button" onClick={() => setShowDeleteModal(true)} className="action-btn-danger">Delete</button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay danger-modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal-content premium-delete-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header-premium">
              <div className="warning-icon-premium">
                <AlertTriangle size={36} />
                <div className="icon-pulse"></div>
              </div>
              <h3 className="modal-title-premium">Delete Account?</h3>
              <button className="modal-close-btn-premium" onClick={() => setShowDeleteModal(false)}>
                <X size={20} />
              </button>
            </div>
            
            <div className="modal-body-premium">
              <p>This action is <strong>permanent</strong> and cannot be undone.</p>
              <p className="sub-text">All your data, orders, and spiritual journey history will be lost forever.</p>
            </div>

            <div className="modal-footer-premium">
              <button 
                type="button" 
                onClick={() => setShowDeleteModal(false)} 
                className="btn-secondary-premium" 
                disabled={loading}
              >
                Keep Account
              </button>
              <button 
                type="button" 
                onClick={handleDelete} 
                className="btn-danger-premium" 
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Yes, Delete Account'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Avatar Choice Modal */}
      {showAvatarModal && (
        <div className="modal-overlay glass-overlay" onClick={() => setShowAvatarModal(false)}>
          <div className="modal-content premium-avatar-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header-premium">
              <div className="avatar-header-icon-premium">
                <Camera size={32} />
              </div>
              <h3 className="modal-title-premium">Update Photo</h3>
              <p className="modal-subtitle-premium">Choose your preferred method</p>
              <button className="modal-close-btn-premium" onClick={() => setShowAvatarModal(false)}>
                <X size={20} />
              </button>
            </div>
            
            <div className="avatar-choice-grid-premium">
              <label className="choice-card-premium" onClick={(e) => e.stopPropagation()}>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageUpload} 
                  className="hidden-input" 
                />
                <div className="choice-icon-wrapper-premium gallery">
                  <Monitor size={32} />
                  <div className="icon-badge-premium"><ImageIcon size={14} /></div>
                </div>
                <div className="choice-info-premium">
                  <span className="choice-title-premium">Browse Gallery</span>
                  <p className="choice-desc-premium">Select from your device</p>
                </div>
                <div className="choice-arrow-premium"><ChevronRight size={20} /></div>
              </label>

              <label className="choice-card-premium" onClick={(e) => e.stopPropagation()}>
                <input 
                  type="file" 
                  accept="image/*" 
                  capture="user" 
                  onChange={handleImageUpload} 
                  className="hidden-input" 
                />
                <div className="choice-icon-wrapper-premium camera">
                  <Smartphone size={32} />
                  <div className="icon-badge-premium"><Camera size={14} /></div>
                </div>
                <div className="choice-info-premium">
                  <span className="choice-title-premium">Take a Photo</span>
                  <p className="choice-desc-premium">Use your camera</p>
                </div>
                <div className="choice-arrow-premium"><ChevronRight size={20} /></div>
              </label>
            </div>

            <div className="avatar-footer-premium">
              <button type="button" onClick={() => setShowAvatarModal(false)} className="btn-dismiss-premium">
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      )}
      
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="profile-skeleton-container">
      <div className="profile-container">
        {/* Header Skeleton */}
        <div className="skeleton-card header-skeleton">
          <div className="skeleton-avatar shimmer" />
          <div className="skeleton-intro">
            <div className="skeleton-line title shimmer" />
            <div className="skeleton-line subtitle shimmer" />
          </div>
          <div className="skeleton-button shimmer" />
        </div>

        {/* Content Skeleton */}
        <div className="skeleton-card content-skeleton">
          <div className="skeleton-section-header">
            <div className="skeleton-line title shimmer" />
            <div className="skeleton-line subtitle shimmer" />
          </div>

          <div className="skeleton-grid">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="skeleton-grid-item">
                <div className="skeleton-icon-box shimmer" />
                <div className="skeleton-text-group">
                  <div className="skeleton-line label shimmer" />
                  <div className="skeleton-line value shimmer" />
                </div>
              </div>
            ))}
          </div>

          <div className="skeleton-actions">
            <div className="skeleton-action-item shimmer" />
            <div className="skeleton-action-item shimmer" />
          </div>
        </div>
      </div>
    </div>
  );
}
