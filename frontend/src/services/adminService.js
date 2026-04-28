import { getAdminStatsApi, getAdminAnalyticsApi, getAstrologerStatsApi } from '../api/admin';

const adminService = {
    /**
     * Fetch astrologer dashboard stats
     * @returns {Promise<Object>} Stats object
     */
    fetchAstrologerStats: async () => {
        try {
            return await getAstrologerStatsApi();
        } catch (error) {
            console.error('Failed to fetch astrologer stats in service:', error);
            throw error;
        }
    },

    /**
     * Fetch dashboard stats
     * @returns {Promise<Object>} Stats object
     */
    fetchDashboardStats: async () => {
        try {
            return await getAdminStatsApi();
        } catch (error) {
            console.error('Failed to fetch admin stats in service:', error);
            throw error;
        }
    },

    /**
     * Fetch admin analytics
     * @param {string} filter Time range filter
     * @returns {Promise<Object>} Analytics data
     */
    fetchAdminAnalytics: async (filter) => {
        try {
            return await getAdminAnalyticsApi(filter);
        } catch (error) {
            console.error('Failed to fetch admin analytics in service:', error);
            throw error;
        }
    }
};

export default adminService;
