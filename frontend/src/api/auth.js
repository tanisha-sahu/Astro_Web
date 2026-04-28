import axiosInstance from './axiosInstance';

export const loginApi = async (credentials) => {
    const response = await axiosInstance.post('/auth/login', credentials);
    return response.data;
};

export const registerApi = async (userData) => {
    const response = await axiosInstance.post('/auth/register', userData);
    return response.data;
};

export const logoutApi = async () => {
    const response = await axiosInstance.post('/auth/logout');
    return response.data;
};

export const getProfileApi = async () => {
    const response = await axiosInstance.get('/auth/profile');
    return response.data;
};

export const updateProfileApi = async (userData) => {
    const response = await axiosInstance.put('/auth/profile', userData);
    return response.data;
};

export const deleteProfileApi = async () => {
    const response = await axiosInstance.delete('/auth/profile');
    return response.data;
};

export const changePasswordApi = async (passwords) => {
    const response = await axiosInstance.put('/auth/change-password', passwords);
    return response.data;
};
