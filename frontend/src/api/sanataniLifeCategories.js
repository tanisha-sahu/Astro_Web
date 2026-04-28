import axiosInstance from './axiosInstance';

export const getSanataniLifeCategoriesApi = async () => {
    const response = await axiosInstance.get('/collections?limit=all');
    return response.data;
};
