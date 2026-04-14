const authService = require('../services/authService');

// @desc    Auth user & get token
// @route   POST /api/v1/auth/login
// @access  Public
const authUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await authService.loginUser(email, password);
        authService.generateToken(res, user._id);
        
        res.status(200).json({
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            mobile: user.mobile
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
        authService.generateToken(res, user._id);

        res.status(201).json({
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            mobile: user.mobile
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
        dob: req.user.dob
    };

    res.status(200).json(user);
};

module.exports = {
    authUser,
    registerUser,
    logoutUser,
    getUserProfile
};
