import { 
    createOrderApi, 
    getOrdersApi, 
    getOrderByIdApi, 
    updateOrderStatusApi 
} from '../api/orders';

const orderService = {
    createOrder: async (orderData) => {
        try {
            return await createOrderApi(orderData);
        } catch (error) {
            console.error('Failed to create order in service:', error);
            throw error;
        }
    },

    fetchOrders: async () => {
        try {
            return await getOrdersApi();
        } catch (error) {
            console.error('Failed to fetch orders in service:', error);
            return [];
        }
    },

    fetchOrderById: async (id) => {
        try {
            return await getOrderByIdApi(id);
        } catch (error) {
            console.error(`Failed to fetch order ${id} in service:`, error);
            throw error;
        }
    },

    updateStatus: async (id, status) => {
        try {
            return await updateOrderStatusApi(id, status);
        } catch (error) {
            console.error('Failed to update order status in service:', error);
            throw error;
        }
    }
};

export default orderService;
