const express = require('express');
const { 
    getUsersByRole, 
    getAllUsers, 
    createUser, 
    getUserById, 
    updateUser, 
    deleteUser,
    getUserDashboardStats 
} = require('../../controllers/userController');
const { protect, authorizeRoles } = require('../../middlewares/authMiddleware');
const ROLES = require('../../config/roles');

const router = express.Router();

// Public routes (accessible without login)
router.get('/public/astrologers', getUsersByRole);

router.use(protect);
router.get('/profile/stats', getUserDashboardStats);

router.use(authorizeRoles(ROLES.ADMIN));

router.get('/', getAllUsers);
router.get('/role/:role', getUsersByRole);
router.post('/', createUser);
router.get('/:id', getUserById);
router.put('/astrologer/:id', updateUser);
router.delete('/astrologer/:id', deleteUser);

module.exports = router;
