const productService = require('../services/productService');

// @desc    Get all products
// @route   GET /api/v1/products
// @access  Public
const getProducts = async (req, res, next) => {
    try {
        const { collection, isFeatured, admin, search, status, page, limit, sortField, sortOrder } = req.query;
        const filters = {
            adminMode: admin === 'true',
            search,
            page,
            limit,
            sortField,
            sortOrder
        };
        if (collection) filters.collection = collection;
        if (isFeatured !== undefined) filters.isFeatured = isFeatured === 'true';
        
        if (status === 'active') filters.isActive = true;
        if (status === 'inactive') filters.isActive = false;

        const result = await productService.getAllProducts(filters);
        return res.status(200).json(result);
    } catch (error) {
        return next(error);
    }
};

// @desc    Get single product by ID or Slug
// @route   GET /api/v1/products/:idOrSlug
// @access  Public
const getProduct = async (req, res, next) => {
    try {
        const product = await productService.getProductByIdOrSlug(req.params.idOrSlug);
        return res.status(200).json(product);
    } catch (error) {
        return next(error);
    }
};

// @desc    Create a product
// @route   POST /api/v1/products
// @access  Private/Admin
const createProduct = async (req, res, next) => {
    try {
        const product = await productService.createProduct(req.body);
        return res.status(201).json(product);
    } catch (error) {
        return next(error);
    }
};

// @desc    Update a product
// @route   PUT /api/v1/products/:id
// @access  Private/Admin
const updateProduct = async (req, res, next) => {
    try {
        const updatedProduct = await productService.updateProduct(req.params.id, req.body);
        return res.status(200).json(updatedProduct);
    } catch (error) {
        return next(error);
    }
};

// @desc    Delete a product
// @route   DELETE /api/v1/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res, next) => {
    try {
        const result = await productService.deleteProduct(req.params.id);
        return res.status(200).json(result);
    } catch (error) {
        return next(error);
    }
};

// @desc    Toggle product status
// @route   PATCH /api/v1/products/:id/toggle-status
// @access  Private/Admin
const toggleProductStatus = async (req, res, next) => {
    try {
        const updatedProduct = await productService.toggleProductStatus(req.params.id);
        return res.status(200).json(updatedProduct);
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    toggleProductStatus
};
