const express = require('express');
const router = express.Router();
const { 
    createOrder, 
    getOrders, 
    getOrderById, 
    updateOrderStatus 
} = require('../../controllers/orderController');
const { protect, authorizeRoles } = require('../../middlewares/authMiddleware');

router.route('/')
    .post(protect, createOrder)
    .get(protect, getOrders);

router.route('/:id')
    .get(protect, getOrderById);

router.route('/:id/status')
    .patch(protect, authorizeRoles('admin', 'astrologer'), updateOrderStatus);

module.exports = router;
