import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/Dashboard/DashboardLayout';
import CollectionForm from '../components/Dashboard/CollectionForm';
import DashboardSkeleton from '../components/DashboardSkeleton/DashboardSkeleton';
import { LayoutGrid, ChevronLeft } from 'lucide-react';
import { categoryService } from '../services';

const DashboardCollectionEditorPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = Boolean(id);
    const [initialData, setInitialData] = useState(null);
    const [loading, setLoading] = useState(isEditMode);


    useEffect(() => {
        if (isEditMode) {
            const fetchCollection = async () => {
                try {
                    const data = await categoryService.fetchCollectionByIdOrSlug(id);
                    setInitialData(data);
                } catch (err) {
                    console.error('Failed to fetch collection:', err);
                } finally {
                    setLoading(false);
                }
            };
            fetchCollection();
        }
    }, [id, isEditMode]);


    return (
        <DashboardLayout>
            <div className="dashboard-editor-page-container">
                <header className="editor-page-header">
                    <div style={{ marginTop: '10px' }}>
                        <h1 className="editor-main-title">
                            <LayoutGrid size={40} />
                            {isEditMode ? 'Edit Collection' : 'Create Collection'}
                        </h1>
                        <p className="editor-subtitle">
                            {isEditMode 
                                ? `Refining the essence of "${initialData?.name || '...'}"` 
                                : 'Shape a new sacred category for the Sanatani community'}
                        </p>
                    </div>
                </header>

                <div className="editor-form-wrapper">
                    {loading ? (
                        <DashboardSkeleton type="form" />
                    ) : (
                        <CollectionForm 
                            isEditMode={isEditMode}
                            initialData={initialData}
                            onSave={() => navigate('/dashboard/collections')}
                            onCancel={() => navigate('/dashboard/collections')}
                        />
                    )}
                </div>
            </div>
            
            <style dangerouslySetInnerHTML={{ __html: `
                .btn-back-minimal {
                    background: transparent;
                    border: none;
                    color: #64748b;
                    font-size: 0.9rem;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    cursor: pointer;
                    padding: 0;
                    margin-bottom: 5px;
                    transition: 0.2s;
                }
                .btn-back-minimal:hover {
                    color: #ff7000;
                }
                .sacred-loader {
                    width: 50px;
                    height: 50px;
                    border: 4px solid #f1f5f9;
                    border-top: 4px solid #ff7000;
                    border-radius: 50%;
                    margin: 0 auto;
                    animation: spin 1s linear infinite;
                }
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}} />
        </DashboardLayout>
    );
};

export default DashboardCollectionEditorPage;
