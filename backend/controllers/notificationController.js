const notificationService = require('../services/notificationService');

/**
 * @desc    Get user's notifications
 * @route   GET /api/v1/notifications
 * @access  Private
 */
const getMyNotifications = async (req, res, next) => {
    try {
        const role = req.user.roles[0]; // Assuming first role is primary
        const notifications = await notificationService.getNotificationsForUser(req.user._id, role);
        res.status(200).json(notifications);
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Mark notification as read
 * @route   PATCH /api/v1/notifications/:id/read
 * @access  Private
 */
const markRead = async (req, res, next) => {
    try {
        const result = await notificationService.markAsRead(req.params.id, req.user._id);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Mark all as read
 * @route   PATCH /api/v1/notifications/mark-all-read
 * @access  Private
 */
const markAllRead = async (req, res, next) => {
    try {
        const role = req.user.roles[0];
        const result = await notificationService.markAllAsRead(req.user._id, role);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Create a notification (Admin only)
 * @route   POST /api/v1/notifications
 * @access  Private/Admin
 */
const createNotification = async (req, res, next) => {
    try {
        const notification = await notificationService.createNotification({
            ...req.body,
            sender: req.user._id
        });
        res.status(201).json(notification);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getMyNotifications,
    markRead,
    markAllRead,
    createNotification
};
