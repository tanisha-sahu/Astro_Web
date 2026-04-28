import axiosInstance from './axiosInstance';

export const uploadImageApi = async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await axiosInstance.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};
