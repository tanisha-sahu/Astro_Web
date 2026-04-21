import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

const ProtectedRoute = ({ allowedRoles }) => {
    const { isAuthenticated, loading, user } = useAuthStore();

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

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && (!user.roles || !user.roles.some(role => allowedRoles.includes(role)))) {
        return <Navigate to="/" replace />; // Or to a dedicated unauthorized page
    }

    return <Outlet />;
};

export default ProtectedRoute;
