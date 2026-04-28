const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (res, userId, roles) => {
    const token = jwt.sign({ userId, roles }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });

    res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development', // Use secure cookies in production
        sameSite: 'strict', // Prevent CSRF attacks
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });
};

const registerUser = async (userData) => {
    const { firstName, lastName, email, password, mobile, dob } = userData;

    const userExists = await User.findOne({ email });

    if (userExists) {
        throw new Error('User already exists');
    }

    const user = await User.create({
        firstName,
        lastName,
        email,
        password,
        mobile,
        dob
    });

    return user;
};

const loginUser = async (email, password) => {
    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {
        return user;
    } else {
        throw new Error('Invalid email or password');
    }
};

const updateUserProfile = async (userId, updateData) => {
    const user = await User.findById(userId);

    if (user) {
        user.firstName = updateData.firstName || user.firstName;
        user.lastName = updateData.lastName || user.lastName;
        user.mobile = updateData.mobile || user.mobile;
        user.dob = updateData.dob || user.dob;
        user.image = updateData.image !== undefined ? updateData.image : user.image;

        if (updateData.password) {
            user.password = updateData.password;
        }

        const updatedUser = await user.save();
        return updatedUser;
    } else {
        throw new Error('User not found');
    }
};

const deleteUser = async (userId) => {
    const user = await User.findById(userId);

    if (user) {
        await user.deleteOne();
    } else {
        throw new Error('User not found');
    }
};

const changePassword = async (userId, currentPassword, newPassword) => {
    const user = await User.findById(userId).select('+password');

    if (user && (await user.matchPassword(currentPassword))) {
        user.password = newPassword;
        await user.save();
    } else {
        throw new Error('Invalid current password');
    }
};

module.exports = {
    generateToken,
    registerUser,
    loginUser,
    updateUserProfile,
    deleteUser,
    changePassword
};
