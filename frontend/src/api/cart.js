import axiosInstance from './axiosInstance';

export const getCartApi = async () => {
    const response = await axiosInstance.get('/cart');
    return response.data;
};

export const addToCartApi = async (productId, quantity = 1) => {
    const response = await axiosInstance.post('/cart/add', { productId, quantity });
    return response.data;
};

export const updateCartItemApi = async (productId, quantity) => {
    const response = await axiosInstance.put('/cart/update', { productId, quantity });
    return response.data;
};

export const removeFromCartApi = async (productId) => {
    const response = await axiosInstance.delete(`/cart/remove/${productId}`);
    return response.data;
};

export const clearCartApi = async () => {
    const response = await axiosInstance.delete('/cart/clear');
    return response.data;
};
