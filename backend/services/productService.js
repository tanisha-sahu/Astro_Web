const { Product } = require('../models');

const getAllProducts = async (filters = {}) => {
    const query = {};
    
    // Only enforce isActive if not in adminMode, UNLESS explicitly filtering by status in adminMode
    if (filters.adminMode !== true) {
        query.isActive = true;
    } else if (filters.isActive !== undefined) {
        query.isActive = filters.isActive;
    }

    if (filters.collection) {
        query.collection = filters.collection;
    }
    if (filters.isFeatured !== undefined) {
        query.isFeatured = filters.isFeatured;
    }
    if (filters.search) {
        query.name = { $regex: filters.search, $options: 'i' };
    }

    const page = parseInt(filters.page) || 1;
    const limit = parseInt(filters.limit) || 10;
    const skip = (page - 1) * limit;

    const sortField = filters.sortField || 'createdAt';
    const sortOrder = parseInt(filters.sortOrder) || -1;
    const sort = { [sortField]: sortOrder };

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
        .populate('collection', 'name slug')
        .sort(sort)
        .skip(skip)
        .limit(limit);

    return {
        products,
        total,
        page,
        pages: Math.ceil(total / limit)
    };
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

const toggleProductStatus = async (id) => {
    const product = await Product.findById(id);
    if (!product) {
        throw new Error('Product not found');
    }
    
    // Use findByIdAndUpdate and skip full document validation to avoid issues with other fields
    return await Product.findByIdAndUpdate(
        id,
        { $set: { isActive: !product.isActive } },
        { new: true, runValidators: false }
    );
};

module.exports = {
    getAllProducts,
    getProductByIdOrSlug,
    createProduct,
    updateProduct,
    deleteProduct,
    toggleProductStatus
};
