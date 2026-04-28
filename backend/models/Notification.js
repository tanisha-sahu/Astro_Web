const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null // null for broadcast or role-based
    },
    role: {
        type: String,
        enum: ['admin', 'astrologer', 'user', 'all', null],
        default: null
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['blog_created', 'blog_published', 'order_placed', 'info'],
        default: 'info'
    },
    relatedId: {
        type: mongoose.Schema.Types.ObjectId,
        default: null
    },
    readBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    isRead: {
        type: Boolean,
        default: false // Only used for targeted notifications (recipient != null)
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Indexing for faster queries
notificationSchema.index({ recipient: 1, role: 1, createdAt: -1 });

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
