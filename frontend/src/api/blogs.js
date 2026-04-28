import axiosInstance from './axiosInstance';

export const getBlogsApi = async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.category) params.append('category', filters.category);
    params.append('limit', 'all');
    
    const response = await axiosInstance.get(`/blogs?${params.toString()}`);
    return response.data;
};

export const getBlogByIdApi = async (idOrSlug) => {
    const response = await axiosInstance.get(`/blogs/${idOrSlug}`);
    return response.data;
};

export const getMyBlogsApi = async () => {
    const response = await axiosInstance.get('/blogs/my/all');
    return response.data;
};

export const getAdminBlogsApi = async () => {
    const response = await axiosInstance.get('/blogs/admin/all');
    return response.data;
};

export const createBlogApi = async (blogData) => {
    const response = await axiosInstance.post('/blogs', blogData);
    return response.data;
};

export const updateBlogApi = async (id, blogData) => {
    const response = await axiosInstance.put(`/blogs/${id}`, blogData);
    return response.data;
};

export const deleteBlogApi = async (id) => {
    const response = await axiosInstance.delete(`/blogs/${id}`);
    return response.data;
};
