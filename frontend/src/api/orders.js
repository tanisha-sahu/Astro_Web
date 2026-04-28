import axiosInstance from './axiosInstance';

export const createOrderApi = async (orderData) => {
    const response = await axiosInstance.post('/orders', orderData);
    return response.data;
};

export const getOrdersApi = async () => {
    const response = await axiosInstance.get('/orders');
    return response.data;
};

export const getOrderByIdApi = async (id) => {
    const response = await axiosInstance.get(`/orders/${id}`);
    return response.data;
};

export const updateOrderStatusApi = async (id, status) => {
    const response = await axiosInstance.patch(`/orders/${id}/status`, { status });
    return response.data;
};
