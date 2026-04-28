const blogService = require('../services/blogService');

/**
 * @desc    Get all blogs
 * @route   GET /api/v1/blogs
 * @access  Public
 */
const getBlogs = async (req, res, next) => {
    try {
        const blogs = await blogService.getAllBlogs(req.query);
        res.status(200).json(blogs);
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get single blog
 * @route   GET /api/v1/blogs/:idOrSlug
 * @access  Public
 */
const getBlog = async (req, res, next) => {
    try {
        const blog = await blogService.getBlogByIdOrSlug(req.params.idOrSlug);
        res.status(200).json(blog);
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get astrologer's own blogs
 * @route   GET /api/v1/blogs/my-blogs
 * @access  Private/Astrologer
 */
const getMyBlogs = async (req, res, next) => {
    try {
        const blogs = await blogService.getMyBlogs(req.user._id);
        res.status(200).json(blogs);
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get all blogs for admin
 * @route   GET /api/v1/blogs/admin/all
 * @access  Private/Admin
 */
const getAdminBlogs = async (req, res, next) => {
    try {
        const blogs = await blogService.getAdminBlogs();
        res.status(200).json(blogs);
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Create a blog
 * @route   POST /api/v1/blogs
 * @access  Private/Astrologer
 */
const createBlog = async (req, res, next) => {
    try {
        const blog = await blogService.createBlog(req.body, req.user);
        res.status(201).json(blog);
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Update a blog
 * @route   PUT /api/v1/blogs/:id
 * @access  Private/Astrologer/Owner
 */
const updateBlog = async (req, res, next) => {
    try {
        const blog = await blogService.updateBlog(req.params.id, req.body, req.user);
        res.status(200).json(blog);
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Delete a blog
 * @route   DELETE /api/v1/blogs/:id
 * @access  Private/Astrologer/Owner
 */
const deleteBlog = async (req, res, next) => {
    try {
        const result = await blogService.deleteBlog(req.params.id, req.user);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getBlogs,
    getBlog,
    getMyBlogs,
    getAdminBlogs,
    createBlog,
    updateBlog,
    deleteBlog
};
