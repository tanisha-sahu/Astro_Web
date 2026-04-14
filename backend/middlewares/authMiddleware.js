const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, req_res, next) => {
    let token;

    token = req.cookies.jwt;

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.user = await User.findById(decoded.userId).select('-password');

            next();
        } catch (error) {
            req_res.status(401);
            throw new Error('Not authorized, token failed');
        }
    } else {
        req_res.status(401);
        throw new Error('Not authorized, no token');
    }
};

module.exports = { protect };
