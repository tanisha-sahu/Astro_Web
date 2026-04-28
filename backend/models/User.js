const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'First name is required']
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: 6,
        select: false
    },
    mobile: {
        type: String,
        required: [true, 'Mobile number is required']
    },
    dob: {
        type: String // We can store as string for now to match the frontend date input
    },
    roles: {
        type: [String],
        enum: ['admin', 'astrologer', 'user'],
        default: ['user']
    },
    image: {
        type: String,
        default: ''
    },
    specialty: {
        type: String,
        default: 'Vedic Astrology'
    },
    experience: {
        type: String,
        default: '10+ Years'
    }
}, {
    timestamps: true
});

// Encrypt password before saving
// Using async function WITHOUT next() argument for Mongoose 9
userSchema.pre('save', async function() {
    if (!this.isModified('password')) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Compare password
userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
