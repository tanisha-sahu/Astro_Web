const errorHandler = (err, req, req_res, next) => {
    let statusCode = req_res.statusCode === 200 ? 500 : req_res.statusCode;
    let message = err.message;

    // Check for Mongoose bad ObjectId
    if (err.name === 'CastError' && err.kind === 'ObjectId') {
        statusCode = 404;
        message = 'Resource not found';
    }

    req_res.status(statusCode).json({
        message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    });
};

const notFound = (req, req_res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    req_res.status(404);
    next(error);
};

module.exports = { errorHandler, notFound };
