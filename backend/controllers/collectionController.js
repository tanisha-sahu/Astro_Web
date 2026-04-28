const collectionService = require('../services/collectionService');

// @desc    Get all collections
// @route   GET /api/v1/collections
// @access  Public
const getCollections = async (req, res, next) => {
    try {
        const { admin, search, status, page, limit, sortField, sortOrder } = req.query;
        const filters = {
            adminMode: admin === 'true',
            search,
            status,
            page,
            limit,
            sortField,
            sortOrder
        };
        const result = await collectionService.getAllCollections(filters);
        return res.status(200).json(result);
    } catch (error) {
        return next(error);
    }
};

// @desc    Get single collection by ID or Slug
// @route   GET /api/v1/collections/:idOrSlug
// @access  Public
const getCollection = async (req, res, next) => {
    try {
        const collection = await collectionService.getCollectionByIdOrSlug(req.params.idOrSlug);
        return res.status(200).json(collection);
    } catch (error) {
        return next(error);
    }
};

// @desc    Create a collection
// @route   POST /api/v1/collections
// @access  Private/Admin
const createCollection = async (req, res, next) => {
    try {
        const collection = await collectionService.createCollection(req.body);
        return res.status(201).json(collection);
    } catch (error) {
        return next(error);
    }
};

// @desc    Update a collection
// @route   PUT /api/v1/collections/:id
// @access  Private/Admin
const updateCollection = async (req, res, next) => {
    try {
        const updatedCollection = await collectionService.updateCollection(req.params.id, req.body);
        return res.status(200).json(updatedCollection);
    } catch (error) {
        return next(error);
    }
};

// @desc    Delete a collection
// @route   DELETE /api/v1/collections/:id
// @access  Private/Admin
const deleteCollection = async (req, res, next) => {
    try {
        const result = await collectionService.deleteCollection(req.params.id);
        return res.status(200).json(result);
    } catch (error) {
        return next(error);
    }
};

// @desc    Toggle collection status
// @route   PATCH /api/v1/collections/:id/toggle-status
// @access  Private/Admin
const toggleCollectionStatus = async (req, res, next) => {
    try {
        const updatedCollection = await collectionService.toggleCollectionStatus(req.params.id);
        return res.status(200).json(updatedCollection);
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    getCollections,
    getCollection,
    createCollection,
    updateCollection,
    deleteCollection,
    toggleCollectionStatus
};
