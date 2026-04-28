const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');
const Blog = require('../models/Blog');
const Collection = require('../models/Collection');

/**
 * @desc    Get dashboard statistics
 * @route   GET /api/v1/admin/stats
 * @access  Private/Admin
 */
const getDashboardStats = async (req, res, next) => {
    try {
        // 1. Basic Counts
        const totalUsers = await User.countDocuments();
        const totalOrders = await Order.countDocuments();
        const totalProducts = await Product.countDocuments();
        const totalBlogs = await Blog.countDocuments();
        const totalCollections = await Collection.countDocuments();
        const totalAstrologers = await User.countDocuments({ roles: 'astrologer' });

        // 2. Revenue Calculation (Sum of totalPrice for Shipped/Delivered orders)
        const revenueData = await Order.aggregate([
            {
                $match: {
                    status: { $in: ['Shipped', 'Delivered'] }
                }
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: '$totalPrice' }
                }
            }
        ]);
        const totalRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

        // 3. Recent Activity (Latest 5 orders and 5 users)
        const recentOrders = await Order.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('user', 'firstName lastName email');

        const recentUsers = await User.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select('-password');

        // 4. Order Status Distribution
        const orderStatusDistribution = await Order.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        // 5. Sales Trend (Last 6 months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
        sixMonthsAgo.setDate(1);
        sixMonthsAgo.setHours(0, 0, 0, 0);

        const salesTrend = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: sixMonthsAgo },
                    status: { $in: ['Shipped', 'Delivered'] }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' }
                    },
                    revenue: { $sum: '$totalPrice' },
                    orders: { $sum: 1 }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } }
        ]);

        // 6. Category Distribution
        const categoryDistribution = await Product.aggregate([
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 }
                }
            }
        ]);

        res.status(200).json({
            counts: {
                users: totalUsers,
                orders: totalOrders,
                products: totalProducts,
                blogs: totalBlogs,
                collections: totalCollections,
                astrologers: totalAstrologers,
                revenue: totalRevenue
            },
            recentOrders,
            recentUsers,
            orderStatusDistribution,
            salesTrend,
            categoryDistribution
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get date-wise analytics for Users and Orders
 * @route   GET /api/v1/admin/analytics
 * @access  Private/Admin
 */
const getAdminAnalytics = async (req, res, next) => {
    try {
        const { filter } = req.query;
        let startDate = new Date();
        let groupBy = {};

        switch (filter) {
            case '24h':
                startDate.setHours(startDate.getHours() - 24);
                groupBy = {
                    year: { $year: '$createdAt' },
                    month: { $month: '$createdAt' },
                    day: { $dayOfMonth: '$createdAt' },
                    hour: { $hour: '$createdAt' }
                };
                break;
            case '3d':
                startDate.setDate(startDate.getDate() - 3);
                groupBy = {
                    year: { $year: '$createdAt' },
                    month: { $month: '$createdAt' },
                    day: { $dayOfMonth: '$createdAt' }
                };
                break;
            case '7d':
                startDate.setDate(startDate.getDate() - 7);
                groupBy = {
                    year: { $year: '$createdAt' },
                    month: { $month: '$createdAt' },
                    day: { $dayOfMonth: '$createdAt' }
                };
                break;
            case '1m':
                startDate.setMonth(startDate.getMonth() - 1);
                groupBy = {
                    year: { $year: '$createdAt' },
                    month: { $month: '$createdAt' },
                    day: { $dayOfMonth: '$createdAt' }
                };
                break;
            case '3m':
                startDate.setMonth(startDate.getMonth() - 3);
                groupBy = {
                    year: { $year: '$createdAt' },
                    month: { $month: '$createdAt' },
                    day: { $dayOfMonth: '$createdAt' }
                };
                break;
            case '1y':
                startDate.setFullYear(startDate.getFullYear() - 1);
                groupBy = {
                    year: { $year: '$createdAt' },
                    month: { $month: '$createdAt' }
                };
                break;
            default:
                startDate.setDate(startDate.getDate() - 7);
                groupBy = {
                    year: { $year: '$createdAt' },
                    month: { $month: '$createdAt' },
                    day: { $dayOfMonth: '$createdAt' }
                };
        }

        const userAnalytics = await User.aggregate([
            { $match: { createdAt: { $gte: startDate } } },
            { $group: { _id: groupBy, count: { $sum: 1 } } },
            { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1, '_id.hour': 1 } }
        ]);

        const orderAnalytics = await Order.aggregate([
            { $match: { createdAt: { $gte: startDate } } },
            { $group: { _id: groupBy, count: { $sum: 1 } } },
            { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1, '_id.hour': 1 } }
        ]);

        res.status(200).json({
            users: userAnalytics,
            orders: orderAnalytics
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get dashboard statistics for an astrologer
 * @route   GET /api/v1/admin/astrologer/stats
 * @access  Private/Astrologer
 */
const getAstrologerDashboardStats = async (req, res, next) => {
    try {
        const astrologerId = req.user._id;

        // 1. My Blogs Count
        const myBlogsCount = await Blog.countDocuments({ author: astrologerId });

        // 2. My Recent Blogs
        const recentBlogs = await Blog.find({ author: astrologerId })
            .sort({ createdAt: -1 })
            .limit(5);

        // 4. Mock Consultation Stats (since no model exists yet)
        const consultationStats = {
            total: 124,
            completed: 118,
            pending: 6,
            rating: 4.8
        };

        // 5. Activity Trend (Blog posts over last 6 months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
        sixMonthsAgo.setDate(1);

        const blogTrend = await Blog.aggregate([
            {
                $match: {
                    author: astrologerId,
                    createdAt: { $gte: sixMonthsAgo }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } }
        ]);

        res.status(200).json({
            counts: {
                blogs: myBlogsCount,
                consultations: consultationStats.total,
                rating: consultationStats.rating
            },
            recentBlogs,
            consultationStats,
            blogTrend
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getDashboardStats,
    getAdminAnalytics,
    getAstrologerDashboardStats
};
