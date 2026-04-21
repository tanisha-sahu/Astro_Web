const { Collection } = require('../models');

const getAllCollections = async (filters = {}) => {
    const query = {};
    // Only enforce isActive if not in adminMode
    if (filters.adminMode !== true) {
        query.isActive = true;
    }
    return await Collection.find(query);
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

module.exports = {
    getAllCollections,
    getCollectionByIdOrSlug,
    createCollection,
    updateCollection,
    deleteCollection
};
