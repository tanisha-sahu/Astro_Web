const { Product } = require('../models');

const getAllProducts = async (filters = {}) => {
    const query = {};
    
    // Only enforce isActive if not in adminMode
    if (filters.adminMode !== true) {
        query.isActive = true;
    }

    if (filters.collection) {
        query.collection = filters.collection;
    }
    if (filters.isFeatured !== undefined) {
        query.isFeatured = filters.isFeatured;
    }
    return await Product.find(query).populate('collection', 'name slug');
};

const createProduct = async (productData) => {
    return await Product.create(productData);
};

const updateProduct = async (id, updateData) => {
    const product = await Product.findById(id);
    
    if (product) {
        Object.assign(product, updateData);
        return await product.save();
    } else {
        throw new Error('Product not found');
    }
};

const deleteProduct = async (id) => {
    const product = await Product.findById(id);
    
    if (product) {
        await product.deleteOne();
        return { message: 'Product removed' };
    } else {
        throw new Error('Product not found');
    }
};

const getProductByIdOrSlug = async (idOrSlug) => {
    let product;
    if (idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
        product = await Product.findById(idOrSlug).populate('collection', 'name slug');
    } else {
        product = await Product.findOne({ slug: idOrSlug }).populate('collection', 'name slug');
    }
    
    if (!product) {
        throw new Error('Product not found');
    }
    return product;
};

module.exports = {
    getAllProducts,
    getProductByIdOrSlug,
    createProduct,
    updateProduct,
    deleteProduct
};
