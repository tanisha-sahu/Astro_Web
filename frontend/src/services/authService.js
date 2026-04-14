import axiosInstance from '../api/axiosInstance';

const authService = {
    register: async (userData) => {
        const response = await axiosInstance.post('/auth/register', userData);
        return response.data;
    },
    login: async (credentials) => {
        const response = await axiosInstance.post('/auth/login', credentials);
        return response.data;
    },
    logout: async () => {
        const response = await axiosInstance.post('/auth/logout');
        return response.data;
    },
    getProfile: async () => {
        const response = await axiosInstance.get('/auth/profile');
        return response.data;
    }
};

export default authService;
