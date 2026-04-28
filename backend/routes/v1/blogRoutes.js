const express = require('express');
const { protect, authorizeRoles } = require('../../middlewares/authMiddleware');
const ROLES = require('../../config/roles');
const blogController = require('../../controllers/blogController');

const router = express.Router();

// Public routes
router.get('/', blogController.getBlogs);
router.get('/:idOrSlug', blogController.getBlog);

// Protected routes
router.use(protect);

// Astrologer only: Get their own blogs
router.get('/my/all', authorizeRoles(ROLES.ASTROLOGER), blogController.getMyBlogs);

// Admin only: Get all blogs for management
router.get('/admin/all', authorizeRoles(ROLES.ADMIN), blogController.getAdminBlogs);

// Creation and Management (Astrologers can create/update their own, Admin can manage all)
router.post('/', authorizeRoles(ROLES.ASTROLOGER, ROLES.ADMIN), blogController.createBlog);
router.put('/:id', authorizeRoles(ROLES.ASTROLOGER, ROLES.ADMIN), blogController.updateBlog);
router.delete('/:id', authorizeRoles(ROLES.ASTROLOGER, ROLES.ADMIN), blogController.deleteBlog);

module.exports = router;
