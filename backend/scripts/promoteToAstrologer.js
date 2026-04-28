const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const promoteUser = async (email) => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            console.log(`User with email ${email} not found`);
            process.exit(1);
        }

        if (!user.roles.includes('astrologer')) {
            user.roles.push('astrologer');
            await user.save();
            console.log(`User ${email} has been promoted to Astrologer`);
        } else {
            console.log(`User ${email} is already an Astrologer`);
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

const email = process.argv[2];
if (!email) {
    console.log('Please provide an email: node scripts/promoteToAstrologer.js <email>');
    process.exit(1);
}

promoteUser(email);
