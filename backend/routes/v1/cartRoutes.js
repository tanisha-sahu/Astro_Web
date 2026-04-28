const express = require('express');
const { 
    getCart, 
    addToCart, 
    updateCartItem, 
    removeFromCart, 
    clearCart 
} = require('../../controllers/cartController');
const { protect } = require('../../middlewares/authMiddleware');

const router = express.Router();

router.route('/')
    .get(protect, getCart);

router.route('/add')
    .post(protect, addToCart);

router.route('/update')
    .put(protect, updateCartItem);

router.route('/remove/:productId')
    .delete(protect, removeFromCart);

router.route('/clear')
    .delete(protect, clearCart);

module.exports = router;
