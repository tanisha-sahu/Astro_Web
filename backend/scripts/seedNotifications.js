const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { User, Notification, Blog } = require('../models');

dotenv.config();

const seedDummyNotifications = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected...');

        const admin = await User.findOne({ roles: 'admin' });
        const astrologer = await User.findOne({ roles: 'astrologer' });
        const user = await User.findOne({ roles: 'user' });

        if (!admin || !astrologer) {
            console.error('Admin or Astrologer not found. Please ensure users exist.');
            process.exit(1);
        }

        const dummyNotifs = [
            {
                role: 'admin',
                sender: astrologer._id,
                title: 'New Blog Wisdom Shared',
                message: `${astrologer.firstName} has shared a new blog draft: "The Power of Saturn". Please review and publish.`,
                type: 'blog_created',
                createdAt: new Date(Date.now() - 3600000) // 1 hour ago
            },
            {
                role: 'all',
                sender: admin._id,
                title: 'New Sacred Wisdom Published',
                message: 'A new divine chronicle "Healing with Crystals" is now available. Explore the celestial knowledge!',
                type: 'blog_published',
                createdAt: new Date(Date.now() - 7200000) // 2 hours ago
            },
            {
                recipient: astrologer._id,
                sender: admin._id,
                title: 'Welcome to the Dashboard',
                message: 'Welcome to your new dashboard! You can now manage your blogs and consultations easily.',
                type: 'info',
                createdAt: new Date(Date.now() - 86400000) // 1 day ago
            }
        ];

        await Notification.insertMany(dummyNotifs);
        console.log('Dummy notifications seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding notifications:', error);
        process.exit(1);
    }
};

seedDummyNotifications();
