import axiosInstance from './axiosInstance';

/**
 * Fetch dashboard statistics for the logged in user
 * @returns {Promise<Object>} User dashboard stats
 */
export const getUserStatsApi = async () => {
    const response = await axiosInstance.get('/users/profile/stats');
    return response.data;
};
