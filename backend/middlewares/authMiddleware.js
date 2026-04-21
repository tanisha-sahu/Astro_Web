const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token = req.cookies.jwt;

    if (!token) {
        res.status(401);
        return next(new Error('Not authorized, no token'));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.userId).select('-password');
        
        if (!req.user) {
            res.status(401);
            return next(new Error('Not authorized, user not found'));
        }

        return next();
    } catch (error) {
        res.status(401);
        return next(new Error('Not authorized, token failed'));
    }
};

const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !req.user.roles) {
            res.status(403);
            return next(new Error('Not authorized, no roles found'));
        }

        const hasRole = req.user.roles.some(role => allowedRoles.includes(role));

        if (!hasRole) {
            res.status(403);
            return next(new Error('Not authorized to access this resource'));
        }

        return next();
    };
};

module.exports = { protect, authorizeRoles };
