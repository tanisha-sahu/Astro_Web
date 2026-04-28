import axiosInstance from './axiosInstance';

export const getProductCategoriesApi = async () => {
    const response = await axiosInstance.get('/collections?limit=all');
    return response.data;
};

export const getCollectionByIdApi = async (idOrSlug) => {
    const response = await axiosInstance.get(`/collections/${idOrSlug}`);
    return response.data;
};

export const getCollectionsApi = async (params = {}) => {
    const searchParams = new URLSearchParams(params);
    const response = await axiosInstance.get(`/collections?${searchParams.toString()}`);
    return response.data;
};

export const deleteCollectionApi = async (id) => {
    const response = await axiosInstance.delete(`/collections/${id}`);
    return response.data;
};

export const toggleCollectionStatusApi = async (id) => {
    const response = await axiosInstance.patch(`/collections/${id}/toggle-status`);
    return response.data;
};

export const createCollectionApi = async (collectionData) => {
    const response = await axiosInstance.post('/collections', collectionData);
    return response.data;
};

export const updateCollectionApi = async (id, collectionData) => {
    const response = await axiosInstance.put(`/collections/${id}`, collectionData);
    return response.data;
};


