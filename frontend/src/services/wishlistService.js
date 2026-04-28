import API from '../api/axiosInstance';

export const wishlistService = {
    getWishlist: async () => {
        const response = await API.get('/wishlist');
        return response.data.data;
    },

    toggleWishlist: async (productId) => {
        const response = await API.post('/wishlist/toggle', { productId });
        return response.data;
    }
};
