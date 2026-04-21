const express = require('express');
const { protect, authorizeRoles } = require('../../middlewares/authMiddleware');
const ROLES = require('../../config/roles');

const router = express.Router();

// @desc    Get all blogs
// @route   GET /api/v1/blogs
// @access  Public
router.get('/', (req, res) => {
    res.status(200).json({ message: 'Fetching all blogs...' });
});

// @desc    Create a blog
// @route   POST /api/v1/blogs
// @access  Private/Astrologer
router.post('/', protect, authorizeRoles(ROLES.ASTROLOGER), (req, res) => {
    res.status(201).json({ message: 'Blog created successfully (Astrologer Only)' });
});

module.exports = router;
