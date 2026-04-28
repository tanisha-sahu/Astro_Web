const authService = require('../services/authService');

// @desc    Auth user & get token
// @route   POST /api/v1/auth/login
// @access  Public
const authUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await authService.loginUser(email, password);
        authService.generateToken(res, user._id, user.roles);
        
        res.status(200).json({
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            mobile: user.mobile,
            image: user.image,
            roles: user.roles
        });
    } catch (error) {
        res.status(401);
        next(error);
    }
};

// @desc    Register a new user
// @route   POST /api/v1/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
    try {
        const user = await authService.registerUser(req.body);
        authService.generateToken(res, user._id, user.roles);

        res.status(201).json({
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            mobile: user.mobile,
            image: user.image,
            roles: user.roles
        });
    } catch (error) {
        res.status(400);
        next(error);
    }
};

// @desc    Logout user
// @route   POST /api/v1/auth/logout
// @access  Public
const logoutUser = (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0)
    });
    res.status(200).json({ message: 'Logged out successfully' });
};

// @desc    Get user profile
// @route   GET /api/v1/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
    const user = {
        _id: req.user._id,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        email: req.user.email,
        mobile: req.user.mobile,
        dob: req.user.dob,
        image: req.user.image,
        roles: req.user.roles
    };

    res.status(200).json(user);
};

// @desc    Update user profile
// @route   PUT /api/v1/auth/profile
// @access  Private
const updateUserProfile = async (req, res, next) => {
    try {
        const updatedUser = await authService.updateUserProfile(req.user._id, req.body);

        res.status(200).json({
            _id: updatedUser._id,
            firstName: updatedUser.firstName,
            lastName: updatedUser.lastName,
            email: updatedUser.email,
            mobile: updatedUser.mobile,
            dob: updatedUser.dob,
            image: updatedUser.image,
            roles: updatedUser.roles
        });
    } catch (error) {
        res.status(404);
        next(error);
    }
};

// @desc    Delete user profile
// @route   DELETE /api/v1/auth/profile
// @access  Private
const deleteUserProfile = async (req, res, next) => {
    try {
        await authService.deleteUser(req.user._id);
        
        res.cookie('jwt', '', {
            httpOnly: true,
            expires: new Date(0)
        });

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(404);
        next(error);
    }
};

// @desc    Change password
// @route   PUT /api/v1/auth/change-password
// @access  Private
const changePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;
        await authService.changePassword(req.user._id, currentPassword, newPassword);
        res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
        res.status(400);
        next(error);
    }
};

module.exports = {
    authUser,
    registerUser,
    logoutUser,
    getUserProfile,
    updateUserProfile,
    deleteUserProfile,
    changePassword
};
