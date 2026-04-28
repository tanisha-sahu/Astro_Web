import axiosInstance from './axiosInstance';

export const getMyNotificationsApi = async () => {
    const response = await axiosInstance.get('/notifications');
    return response.data;
};

export const markNotificationReadApi = async (id) => {
    const response = await axiosInstance.patch(`/notifications/${id}/read`);
    return response.data;
};

export const markAllNotificationsReadApi = async () => {
    const response = await axiosInstance.patch('/notifications/mark-all-read');
    return response.data;
};

export const createNotificationApi = async (data) => {
    const response = await axiosInstance.post('/notifications', data);
    return response.data;
};
