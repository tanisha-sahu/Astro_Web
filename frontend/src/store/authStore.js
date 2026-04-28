import { create } from 'zustand';
import authService from '../services/authService';

const useAuthStore = create((set) => ({
    user: null,
    isAuthenticated: false,
    loading: true,
    error: null,

    register: async (userData) => {
        set({ loading: true, error: null });
        try {
            const user = await authService.register(userData);
            set({ user, isAuthenticated: true, loading: false });
        } catch (error) {
            set({ error: error.response?.data?.message || 'Registration failed', loading: false });
            throw error;
        }
    },

    login: async (credentials) => {
        set({ loading: true, error: null });
        try {
            const user = await authService.login(credentials);
            set({ user, isAuthenticated: true, loading: false });
        } catch (error) {
            set({ error: error.response?.data?.message || 'Login failed', loading: false });
            throw error;
        }
    },

    logout: async () => {
        try {
            await authService.logout();
            set({ user: null, isAuthenticated: false, loading: false });
        } catch (error) {
            console.error('Logout failed:', error);
        }
    },

    checkAuth: async () => {
        set({ loading: true });
        try {
            const user = await authService.getProfile();
            set({ user, isAuthenticated: true, loading: false });
        } catch (error) {
            set({ user: null, isAuthenticated: false, loading: false });
        }
    },

    updateProfile: async (userData) => {
        set({ error: null });
        try {
            const updatedUser = await authService.updateProfile(userData);
            set({ user: updatedUser, loading: false });
            return updatedUser;
        } catch (error) {
            set({ error: error.response?.data?.message || 'Update failed', loading: false });
            throw error;
        }
    },

    deleteAccount: async () => {
        set({ error: null });
        try {
            await authService.deleteProfile();
            set({ user: null, isAuthenticated: false, loading: false });
        } catch (error) {
            set({ error: error.response?.data?.message || 'Deletion failed', loading: false });
            throw error;
        }
    },

    changePassword: async (passwords) => {
        set({ error: null });
        try {
            await authService.changePassword(passwords);
        } catch (error) {
            set({ error: error.response?.data?.message || 'Password change failed' });
            throw error;
        }
    },

    hasRole: (allowedRoles) => {
        const user = useAuthStore.getState().user;
        if (!user || !user.roles) return false;
        return user.roles.some(role => allowedRoles.includes(role));
    },

    clearError: () => set({ error: null }),
}));

export default useAuthStore;
