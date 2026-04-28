const express = require('express');
const { protect, authorizeRoles } = require('../../middlewares/authMiddleware');
const productController = require('../../controllers/productController');
const ROLES = require('../../config/roles');

const router = express.Router();

// @desc    Get all products
// @route   GET /api/v1/products
// @access  Public
router.get('/', productController.getProducts);
router.get('/:idOrSlug', productController.getProduct);

// @desc    Create a product
// @route   POST /api/v1/products
// @access  Private/Admin
router.post('/', protect, authorizeRoles(ROLES.ADMIN), productController.createProduct);

// @desc    Update a product
// @route   PUT /api/v1/products/:id
// @access  Private/Admin
router.put('/:id', protect, authorizeRoles(ROLES.ADMIN), productController.updateProduct);

// @desc    Delete a product
// @route   DELETE /api/v1/products/:id
// @access  Private/Admin
router.delete('/:id', protect, authorizeRoles(ROLES.ADMIN), productController.deleteProduct);

// @desc    Toggle a product status
// @route   PATCH /api/v1/products/:id/toggle-status
// @access  Private/Admin
router.patch('/:id/toggle-status', protect, authorizeRoles(ROLES.ADMIN), productController.toggleProductStatus);

module.exports = router;
