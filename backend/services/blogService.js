const { Blog } = require('../models');
const notificationService = require('./notificationService');

/**
 * Get all blogs with optional filters
 */
const getAllBlogs = async (filters = {}) => {
    const query = { isPublished: true };
    
    if (filters.category) {
        query.category = filters.category;
    }
    
    if (filters.author) {
        query.author = filters.author;
    }

    return await Blog.find(query)
        .populate('author', 'firstName lastName')
        .sort({ createdAt: -1 });
};

/**
 * Get single blog by ID or Slug
 */
const getBlogByIdOrSlug = async (idOrSlug) => {
    const isObjectId = idOrSlug.match(/^[0-9a-fA-F]{24}$/);
    const query = isObjectId ? { _id: idOrSlug } : { slug: idOrSlug };
    
    const blog = await Blog.findOne(query).populate('author', 'firstName lastName');
    if (!blog) {
        throw new Error('Blog not found');
    }
    return blog;
};

/**
 * Get blogs by author (My Blogs)
 */
const getMyBlogs = async (authorId) => {
    return await Blog.find({ author: authorId }).sort({ createdAt: -1 });
};

/**
 * Get all blogs for admin (including drafts)
 */
const getAdminBlogs = async () => {
    return await Blog.find({})
        .populate('author', 'firstName lastName email')
        .sort({ createdAt: -1 });
};

/**
 * Create a new blog
 */
const createBlog = async (blogData, user) => {
    // Force published to false for new blogs created by anyone (admin can publish later)
    const { isPublished, ...data } = blogData;
    
    const blog = new Blog({
        ...data,
        author: user._id,
        isPublished: false 
    });
    const savedBlog = await blog.save();

    // Notify Admins if created by an Astrologer
    if (user.roles.includes('astrologer')) {
        try {
            await notificationService.createNotification({
                role: 'admin',
                sender: user._id,
                title: 'New Blog Wisdom Shared',
                message: `${user.firstName || 'An astrologer'} has shared a new blog draft: "${savedBlog.title}". Please review and publish.`,
                type: 'blog_created',
                relatedId: savedBlog._id
            });
        } catch (error) {
            console.error('Failed to create notification for admin:', error);
        }
    }

    return savedBlog;
};

/**
 * Update a blog
 */
const updateBlog = async (blogId, blogData, user) => {
    const blog = await Blog.findById(blogId);
    
    if (!blog) {
        throw new Error('Blog not found');
    }
    
    const isAdmin = user.roles.includes('admin');
    const isOwner = blog.author.toString() === user._id.toString();

    // Check authorization
    if (!isOwner && !isAdmin) {
        throw new Error('Not authorized to update this blog');
    }
    
    // Only admins can change publication status
    const dataToUpdate = { ...blogData };
    if (!isAdmin) {
        delete dataToUpdate.isPublished;
    }
    
    const wasPublished = blog.isPublished;
    Object.assign(blog, dataToUpdate);
    const updatedBlog = await blog.save();

    // Notify All Users if blog is newly published by Admin
    if (!wasPublished && updatedBlog.isPublished && isAdmin) {
        try {
            await notificationService.createNotification({
                role: 'all',
                sender: user._id,
                title: 'New Sacred Wisdom Published',
                message: `A new divine chronicle "${updatedBlog.title}" is now available. Explore the celestial knowledge!`,
                type: 'blog_published',
                relatedId: updatedBlog._id
            });
        } catch (error) {
            console.error('Failed to create broadcast notification:', error);
        }
    }

    return updatedBlog;
};

/**
 * Delete a blog
 */
const deleteBlog = async (blogId, user) => {
    const blog = await Blog.findById(blogId);
    
    if (!blog) {
        throw new Error('Blog not found');
    }
    
    const isAdmin = user.roles.includes('admin');
    const isOwner = blog.author.toString() === user._id.toString();

    // Check authorization
    if (!isOwner && !isAdmin) {
        throw new Error('Not authorized to delete this blog');
    }
    
    await blog.deleteOne();
    return { message: 'Blog deleted successfully' };
};

module.exports = {
    getAllBlogs,
    getBlogByIdOrSlug,
    getMyBlogs,
    getAdminBlogs,
    createBlog,
    updateBlog,
    deleteBlog
};
