const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
        if (error.message.includes('IP not whitelisted')) {
            console.error('⚠️ ACTION REQUIRED: Your current IP address is not whitelisted in MongoDB Atlas.');
            console.error('Please visit https://www.mongodb.com/docs/atlas/security-whitelist/ to add your IP.');
        }
        process.exit(1);
    }
};

module.exports = connectDB;
