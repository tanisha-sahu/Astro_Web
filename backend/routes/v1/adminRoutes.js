const express = require('express');
const { getDashboardStats, getAdminAnalytics, getAstrologerDashboardStats } = require('../../controllers/adminController');
const { protect, authorizeRoles } = require('../../middlewares/authMiddleware');
const ROLES = require('../../config/roles');

const router = express.Router();

// All admin routes are protected
router.use(protect);

// Astrologer can access their own stats
router.get('/astrologer/stats', authorizeRoles(ROLES.ADMIN, ROLES.ASTROLOGER), getAstrologerDashboardStats);

// Admin only routes
router.use(authorizeRoles(ROLES.ADMIN));

router.get('/stats', getDashboardStats);
router.get('/analytics', getAdminAnalytics);

module.exports = router;
