import axiosInstance from './axiosInstance';

/**
 * Fetch dashboard statistics for admin
 * @returns {Promise<Object>} Dashboard stats
 */
export const getAdminStatsApi = async () => {
    const response = await axiosInstance.get('/admin/stats');
    return response.data;
};

/**
 * Fetch analytics data for admin
 * @param {string} filter Time range filter
 * @returns {Promise<Object>} Analytics data
 */
export const getAdminAnalyticsApi = async (filter) => {
    const response = await axiosInstance.get(`/admin/analytics?filter=${filter}`);
    return response.data;
};

/**
 * Fetch dashboard statistics for astrologer
 * @returns {Promise<Object>} Astrologer stats
 */
export const getAstrologerStatsApi = async () => {
    const response = await axiosInstance.get('/admin/astrologer/stats');
    return response.data;
};
