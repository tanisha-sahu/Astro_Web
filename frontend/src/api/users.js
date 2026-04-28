import axiosInstance from './axiosInstance';

export const getAstrologersApi = async () => {
    const response = await axiosInstance.get('/users/role/astrologer');
    return response.data;
};

export const getPublicAstrologersApi = async () => {
    const response = await axiosInstance.get('/users/public/astrologers');
    return response.data;
};

export const onboardAstrologerApi = async (userData) => {
    const response = await axiosInstance.post('/users', userData);
    return response.data;
};

export const updateAstrologerApi = async (id, userData) => {
    const response = await axiosInstance.put(`/users/astrologer/${id}`, userData);
    return response.data;
};

export const deleteAstrologerApi = async (id) => {
    const response = await axiosInstance.delete(`/users/astrologer/${id}`);
    return response.data;
};

export const getAstrologerByIdApi = async (id) => {
    const response = await axiosInstance.get(`/users/${id}`);
    return response.data;
};

// New API for all users (Admin only)
export const getAllUsersApi = async (params = {}) => {
    const response = await axiosInstance.get('/users', { params });
    return response.data;
};
