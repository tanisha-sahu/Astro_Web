import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import DashboardLayout from '../Dashboard/DashboardLayout';
import DashboardSkeleton from '../DashboardSkeleton/DashboardSkeleton';
import { ProfileSkeleton } from '../../pages/ProfilePage';

const ProtectedRoute = ({ allowedRoles }) => {
    const { isAuthenticated, loading, user } = useAuthStore();
    const location = useLocation();
    const isDashboardRoute = location.pathname.startsWith('/dashboard');
    const isProfileRoute = location.pathname === '/profile';

    if (loading) {
        if (isDashboardRoute) {
            return (
                <DashboardLayout>
                    <DashboardSkeleton type="dashboard" />
                </DashboardLayout>
            );
        }

        if (isProfileRoute) {
            return <ProfileSkeleton />;
        }

        // Default skeleton for other protected routes
        return <ProfileSkeleton />;
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
