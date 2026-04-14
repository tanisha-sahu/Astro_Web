import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: '/api/v1', // Proxy is usually set in vite.config.js or full URL here
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Required for cookies
});

// Response interceptor for error handling
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        const message = error.response?.data?.message || 'Something went wrong';
        console.error('API Error:', message);
        return Promise.reject(error);
    }
);

export default axiosInstance;
