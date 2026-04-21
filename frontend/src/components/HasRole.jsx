import useAuthStore from '../store/authStore';

/**
 * Component to conditionally render children based on user roles.
 * @param {Object} props
 * @param {string[]} props.allowedRoles - Array of roles allowed to see the children.
 * @param {React.ReactNode} props.children - Elements to show if authorized.
 * @param {React.ReactNode} [props.fallback] - Optional elements to show if not authorized.
 */
const HasRole = ({ allowedRoles, children, fallback = null }) => {
    const { user, isAuthenticated } = useAuthStore();

    if (!isAuthenticated || !user || !user.roles) {
        return fallback;
    }

    const hasPermission = user.roles.some(role => allowedRoles.includes(role));

    return hasPermission ? <>{children}</> : fallback;
};

export default HasRole;
