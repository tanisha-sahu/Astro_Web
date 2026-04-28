const User = require('../models/User');
const Order = require('../models/Order');
const Wishlist = require('../models/Wishlist');
const Notification = require('../models/Notification');

/**
 * @desc    Get all users
 * @route   GET /api/v1/users
 * @access  Private/Admin
 */
const getAllUsers = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const { search, role, sortField, sortOrder } = req.query;

        let query = {};

        // Search by name or email
        if (search) {
            query.$or = [
                { firstName: { $regex: search, $options: 'i' } },
                { lastName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        // Filter by role
        if (role && role !== 'all') {
            query.roles = role;
        }

        // Sorting
        let sort = { createdAt: -1 };
        if (sortField) {
            sort = { [sortField]: parseInt(sortOrder) || -1 };
        }

        const total = await User.countDocuments(query);
        const users = await User.find(query)
            .sort(sort)
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            users,
            total,
            pages: Math.ceil(total / limit),
            currentPage: page
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get users by role
 * @route   GET /api/v1/users/role/:role
 * @access  Private/Admin
 */
const getUsersByRole = async (req, res, next) => {
    try {
        let role = req.params.role;
        
        // If role not in params, determine from path (for public routes)
        if (!role) {
            if (req.path.includes('astrologers')) role = 'astrologer';
        }

        const users = await User.find({ roles: role }).sort({ createdAt: -1 });
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Admin create user (specifically for astrologers)
 * @route   POST /api/v1/users
 * @access  Private/Admin
 */
const createUser = async (req, res, next) => {
    try {
        const { firstName, lastName, email, password, mobile, dob, roles, image } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            res.status(400);
            throw new Error('User already exists');
        }

        const user = await User.create({
            firstName,
            lastName,
            email,
            password,
            mobile,
            dob,
            roles: roles || ['user'],
            image: image || ''
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                roles: user.roles
            });
        }
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get user by ID
 * @route   GET /api/v1/users/:id
 * @access  Private/Admin
 */
const getUserById = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            res.status(404);
            throw new Error('User not found');
        }
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Update user
 * @route   PUT /api/v1/users/astrologer/:id
 * @access  Private/Admin
 */
const updateUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            res.status(404);
            throw new Error('User not found');
        }

        user.firstName = req.body.firstName || user.firstName;
        user.lastName = req.body.lastName || user.lastName;
        user.email = req.body.email || user.email;
        user.mobile = req.body.mobile || user.mobile;
        user.dob = req.body.dob || user.dob;
        if (req.body.password) {
            user.password = req.body.password;
        }
        user.image = req.body.image !== undefined ? req.body.image : user.image;

        const updatedUser = await user.save();

        res.status(200).json({
            _id: updatedUser._id,
            firstName: updatedUser.firstName,
            lastName: updatedUser.lastName,
            email: updatedUser.email,
            roles: updatedUser.roles
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Delete user
 * @route   DELETE /api/v1/users/astrologer/:id
 * @access  Private/Admin
 */
const deleteUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            res.status(404);
            throw new Error('User not found');
        }

        await user.deleteOne();
        res.status(200).json({ message: 'User removed successfully' });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get dashboard statistics for the logged in user
 * @route   GET /api/v1/users/profile/stats
 * @access  Private
 */
const getUserDashboardStats = async (req, res, next) => {
    try {
        const userId = req.user._id;

        // 1. Order Count
        const totalOrders = await Order.countDocuments({ user: userId });

        // 2. Wishlist Count
        const wishlist = await Wishlist.findOne({ user: userId });
        const wishlistCount = wishlist ? wishlist.products.length : 0;

        // 3. Unread Notifications
        const unreadNotifications = await Notification.countDocuments({ 
            recipient: userId, 
            read: false 
        });

        // 4. Spending/Order History (Last 6 months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
        sixMonthsAgo.setDate(1);
        sixMonthsAgo.setHours(0, 0, 0, 0);

        const orderHistory = await Order.aggregate([
            {
                $match: {
                    user: userId,
                    createdAt: { $gte: sixMonthsAgo }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' }
                    },
                    totalSpent: { $sum: '$totalPrice' },
                    orderCount: { $sum: 1 }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } }
        ]);

        // 5. Category Distribution
        const categoryDistribution = await Order.aggregate([
            { $match: { user: userId } },
            { $unwind: '$orderItems' },
            {
                $lookup: {
                    from: 'products',
                    localField: 'orderItems.product',
                    foreignField: '_id',
                    as: 'productDetails'
                }
            },
            { $unwind: '$productDetails' },
            {
                $group: {
                    _id: '$productDetails.category',
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } }
        ]);

        // 6. Recent Orders
        const recentOrders = await Order.find({ user: userId })
            .sort({ createdAt: -1 })
            .limit(5);

        res.status(200).json({
            counts: {
                orders: totalOrders,
                wishlist: wishlistCount,
                notifications: unreadNotifications
            },
            orderHistory,
            categoryDistribution,
            recentOrders
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getUsersByRole,
    getAllUsers,
    createUser,
    getUserById,
    updateUser,
    deleteUser,
    getUserDashboardStats
};
