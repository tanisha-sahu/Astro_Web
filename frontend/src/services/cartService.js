import { 
    getCartApi, 
    addToCartApi, 
    updateCartItemApi, 
    removeFromCartApi, 
    clearCartApi 
} from '../api/cart';
import { normalizeImageUrl } from './productService';


const normalizeCartItem = (item) => ({
    id: item.product?._id || item.product,
    name: item.product?.name || 'Product',
    price: item.product?.sellingPrice || 0,
    img: normalizeImageUrl(item.product?.image),
    qty: item.quantity,
    category: item.product?.collection?.name || 'Spiritual'
});

const normalizeCart = (backendCart) => {
    if (!backendCart) return { items: [] };
    return {
        ...backendCart,
        items: (backendCart.items || []).map(normalizeCartItem)
    };
};

const cartService = {
    fetchCart: async () => {
        try {
            const data = await getCartApi();
            return normalizeCart(data);
        } catch (error) {
            console.error('Failed to fetch cart in service:', error);
            return { items: [] };
        }
    },

    addToCart: async (productId, quantity = 1) => {
        try {
            const data = await addToCartApi(productId, quantity);
            return normalizeCart(data);
        } catch (error) {
            console.error('Failed to add to cart in service:', error);
            throw error;
        }
    },

    updateCartItem: async (productId, quantity) => {
        try {
            const data = await updateCartItemApi(productId, quantity);
            return normalizeCart(data);
        } catch (error) {
            console.error('Failed to update cart item in service:', error);
            throw error;
        }
    },

    removeFromCart: async (productId) => {
        try {
            const data = await removeFromCartApi(productId);
            return normalizeCart(data);
        } catch (error) {
            console.error('Failed to remove from cart in service:', error);
            throw error;
        }
    },


    clearCart: async () => {
        try {
            return await clearCartApi();
        } catch (error) {
            console.error('Failed to clear cart in service:', error);
            throw error;
        }
    }
};

export default cartService;
