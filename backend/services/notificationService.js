const { Notification } = require('../models');

/**
 * Create a new notification
 */
const createNotification = async (data) => {
    const notification = new Notification(data);
    return await notification.save();
};

/**
 * Get notifications for a specific user
 */
const getNotificationsForUser = async (userId, role) => {
    return await Notification.find({
        $or: [
            { recipient: userId },
            { role: role },
            { role: 'all' }
        ]
    })
    .populate('sender', 'firstName lastName')
    .sort({ createdAt: -1 })
    .limit(20);
};

/**
 * Mark a notification as read
 */
const markAsRead = async (notificationId, userId) => {
    const notification = await Notification.findById(notificationId);
    if (!notification) throw new Error('Notification not found');

    if (notification.recipient) {
        // Targeted notification
        if (notification.recipient.toString() === userId.toString()) {
            notification.isRead = true;
        }
    } else {
        // Broadcast/Role-based notification
        if (!notification.readBy.includes(userId)) {
            notification.readBy.push(userId);
        }
    }
    
    return await notification.save();
};

/**
 * Mark all as read for a user
 */
const markAllAsRead = async (userId, role) => {
    // For targeted
    await Notification.updateMany(
        { recipient: userId, isRead: false },
        { isRead: true }
    );
    
    // For role-based/broadcast
    const unreadRoleBased = await Notification.find({
        $or: [{ role: role }, { role: 'all' }],
        readBy: { $ne: userId }
    });
    
    for (const notif of unreadRoleBased) {
        notif.readBy.push(userId);
        await notif.save();
    }
    
    return { message: 'All notifications marked as read' };
};

module.exports = {
    createNotification,
    getNotificationsForUser,
    markAsRead,
    markAllAsRead
};
