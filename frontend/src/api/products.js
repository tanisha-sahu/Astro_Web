import axiosInstance from './axiosInstance';

export const getProductsApi = async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.collection) params.append('collection', filters.collection);
    if (filters.isFeatured !== undefined) params.append('isFeatured', filters.isFeatured);
    if (filters.limit) params.append('limit', filters.limit);
    if (filters.search) params.append('search', filters.search);
    if (filters.page) params.append('page', filters.page);
    if (filters.status) params.append('status', filters.status);
    if (filters.sortField) params.append('sortField', filters.sortField);
    if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
    if (filters.admin) params.append('admin', filters.admin);

    const response = await axiosInstance.get(`/products?${params.toString()}`);
    return response.data;
};

export const getProductByIdApi = async (idOrSlug) => {
    const response = await axiosInstance.get(`/products/${idOrSlug}`);
    return response.data;
};

export const createProductApi = async (productData) => {
    const response = await axiosInstance.post('/products', productData);
    return response.data;
};

export const updateProductApi = async (id, productData) => {
    const response = await axiosInstance.put(`/products/${id}`, productData);
    return response.data;
};

export const deleteProductApi = async (id) => {
    const response = await axiosInstance.delete(`/products/${id}`);
    return response.data;
};

export const toggleProductStatusApi = async (id) => {
    const response = await axiosInstance.patch(`/products/${id}/toggle-status`);
    return response.data;
};


