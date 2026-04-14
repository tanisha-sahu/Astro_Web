import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const ProtectedRoute = () => {
    const { isAuthenticated, loading } = useAuthStore();

    if (loading) {
        return (
            <div className="loading-container" style={{ 
                height: '100vh', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                background: 'var(--primary-dark)',
                color: 'var(--gold)'
            }}>
                <div className="loader">Loading Sacred Journey...</div>
            </div>
        );
    }

    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
