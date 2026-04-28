const orderService = require('../services/orderService');

// @desc    Create new order
// @route   POST /api/v1/orders
// @access  Private
const createOrder = async (req, res, next) => {
    try {
        const {
            orderItems,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
        } = req.body;

        if (orderItems && orderItems.length === 0) {
            return res.status(400).json({ message: 'No order items' });
        }

        const orderData = {
            orderItems,
            user: req.user._id,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
            orderNumber: 'ORD' + Date.now(),
        };

        const createdOrder = await orderService.createOrder(orderData);
        return res.status(201).json(createdOrder);
    } catch (error) {
        return next(error);
    }
};

// @desc    Get all orders (admin) or user orders
// @route   GET /api/v1/orders
// @access  Private
const getOrders = async (req, res, next) => {
    try {
        const isAdmin = req.user.roles.includes('admin') || req.user.roles.includes('astrologer');
        
        let orders;
        if (isAdmin) {
            orders = await orderService.getAllOrders();
        } else {
            orders = await orderService.getUserOrders(req.user._id);
        }
        
        return res.status(200).json(orders);
    } catch (error) {
        return next(error);
    }
};

// @desc    Get order by ID
// @route   GET /api/v1/orders/:id
// @access  Private
const getOrderById = async (req, res, next) => {
    try {
        const order = await orderService.getOrderById(req.params.id);
        
        // Check if user is owner or admin
        const isAdmin = req.user.roles.includes('admin') || req.user.roles.includes('astrologer');
        if (!isAdmin && order.user._id.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to view this order' });
        }
        
        return res.status(200).json(order);
    } catch (error) {
        return next(error);
    }
};

// @desc    Update order status
// @route   PATCH /api/v1/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const updatedOrder = await orderService.updateOrderStatus(req.params.id, status);
        return res.status(200).json(updatedOrder);
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    createOrder,
    getOrders,
    getOrderById,
    updateOrderStatus
};
