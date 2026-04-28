const { Order, User } = require('../models');
const notificationService = require('./notificationService');

const createOrder = async (orderData) => {
    const order = await Order.create(orderData);
    
    // Notify Admins
    try {
        const user = await User.findById(orderData.user);
        await notificationService.createNotification({
            role: 'admin',
            sender: orderData.user,
            title: 'New Order Received',
            message: `A new order ${order.orderNumber} has been placed by ${user?.firstName || 'a customer'}. Total: ₹${order.totalPrice}`,
            type: 'order_placed',
            relatedId: order._id
        });
    } catch (error) {
        console.error('Failed to create order notification:', error);
    }
    
    return order;
};

const getOrderById = async (id) => {
    const order = await Order.findById(id).populate('user', 'firstName lastName email');
    if (!order) {
        throw new Error('Order not found');
    }
    return order;
};

const getUserOrders = async (userId) => {
    return await Order.find({ user: userId })
        .populate('user', 'firstName lastName email')
        .sort({ createdAt: -1 });
};

const getAllOrders = async () => {
    return await Order.find({})
        .populate('user', 'firstName lastName email')
        .sort({ createdAt: -1 });
};

const updateOrderStatus = async (id, status) => {
    const order = await Order.findById(id);
    if (!order) {
        throw new Error('Order not found');
    }
    order.status = status;
    return await order.save();
};

module.exports = {
    createOrder,
    getOrderById,
    getUserOrders,
    getAllOrders,
    updateOrderStatus
};
