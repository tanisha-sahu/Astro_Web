const { Collection } = require('../models');

const getAllCollections = async (filters = {}) => {
    const query = {};
    
    // Only enforce isActive if not in adminMode, UNLESS explicitly filtering by status in adminMode
    if (filters.adminMode !== true) {
        query.isActive = true;
    } else if (filters.status !== undefined && filters.status !== 'all') {
        query.isActive = filters.status === 'active';
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

    // If limit is -1 or specifically requested without pagination (e.g. for dropdowns)
    if (filters.limit === 'all' || (!filters.page && !filters.limit && filters.adminMode)) {
        return await Collection.find(query).sort(sort);
    }

    const total = await Collection.countDocuments(query);
    const collections = await Collection.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit);

    return {
        collections,
        total,
        page,
        pages: Math.ceil(total / limit)
    };
};

const createCollection = async (collectionData) => {
    const { name, description, image } = collectionData;
    
    const collectionExists = await Collection.findOne({ name });
    if (collectionExists) {
        throw new Error('Collection already exists');
    }

    return await Collection.create({
        name,
        description,
        image
    });
};

const updateCollection = async (id, updateData) => {
    const collection = await Collection.findById(id);
    
    if (collection) {
        collection.name = updateData.name || collection.name;
        collection.description = updateData.description || collection.description;
        collection.image = updateData.image || collection.image;
        collection.isActive = updateData.isActive !== undefined ? updateData.isActive : collection.isActive;

        return await collection.save();
    } else {
        throw new Error('Collection not found');
    }
};

const deleteCollection = async (id) => {
    const collection = await Collection.findById(id);
    
    if (collection) {
        await collection.deleteOne();
        return { message: 'Collection removed' };
    } else {
        throw new Error('Collection not found');
    }
};

const getCollectionByIdOrSlug = async (idOrSlug) => {
    let collection;
    if (idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
        collection = await Collection.findById(idOrSlug);
    } else {
        collection = await Collection.findOne({ slug: idOrSlug });
    }
    
    if (!collection) {
        throw new Error('Collection not found');
    }
    return collection;
};

const toggleCollectionStatus = async (id) => {
    const collection = await Collection.findById(id);
    if (!collection) {
        throw new Error('Collection not found');
    }
    
    return await Collection.findByIdAndUpdate(
        id,
        { $set: { isActive: !collection.isActive } },
        { new: true, runValidators: false }
    );
};

module.exports = {
    getAllCollections,
    getCollectionByIdOrSlug,
    createCollection,
    updateCollection,
    deleteCollection,
    toggleCollectionStatus
};
