const express = require('express');
const { 
    authUser, 
    registerUser, 
    logoutUser, 
    getUserProfile,
    updateUserProfile,
    deleteUserProfile,
    changePassword
} = require('../../controllers/authController');
const { protect } = require('../../middlewares/authMiddleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', authUser);
router.post('/logout', logoutUser);
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.delete('/profile', protect, deleteUserProfile);
router.put('/change-password', protect, changePassword);

module.exports = router;
