import { getAstrologersApi, onboardAstrologerApi } from '../api/users';
import { getUserStatsApi } from '../api/user';

const userService = {
    /**
     * Fetch user dashboard stats
     * @returns {Promise<Object>} Stats object
     */
    fetchUserDashboardStats: async () => {
        try {
            return await getUserStatsApi();
        } catch (error) {
            console.error('Failed to fetch user stats in service:', error);
            throw error;
        }
    },

    fetchAstrologers: async () => {
        try {
            return await getAstrologersApi();
        } catch (error) {
            console.error('Failed to fetch astrologers in service:', error);
            throw error;
        }
    },

    fetchPublicAstrologers: async () => {
        try {
            const { getPublicAstrologersApi } = await import('../api/users');
            return await getPublicAstrologersApi();
        } catch (error) {
            console.error('Failed to fetch public astrologers in service:', error);
            throw error;
        }
    },

    onboardAstrologer: async (userData) => {
        try {
            const { onboardAstrologerApi } = await import('../api/users');
            return await onboardAstrologerApi(userData);
        } catch (error) {
            console.error('Failed to onboard astrologer in service:', error);
            throw error;
        }
    },
    
    updateAstrologer: async (id, userData) => {
        try {
            const { updateAstrologerApi } = await import('../api/users');
            return await updateAstrologerApi(id, userData);
        } catch (error) {
            console.error('Failed to update astrologer in service:', error);
            throw error;
        }
    },

    deleteAstrologer: async (id) => {
        try {
            const { deleteAstrologerApi } = await import('../api/users');
            return await deleteAstrologerApi(id);
        } catch (error) {
            console.error('Failed to delete astrologer in service:', error);
            throw error;
        }
    },

    fetchAstrologerById: async (id) => {
        try {
            const { getAstrologerByIdApi } = await import('../api/users');
            return await getAstrologerByIdApi(id);
        } catch (error) {
            console.error('Failed to fetch astrologer by ID in service:', error);
            throw error;
        }
    },

    fetchAllUsers: async (filters = {}) => {
        try {
            const { getAllUsersApi } = await import('../api/users');
            return await getAllUsersApi(filters);
        } catch (error) {
            console.error('Failed to fetch all users in service:', error);
            throw error;
        }
    }
};

export default userService;
