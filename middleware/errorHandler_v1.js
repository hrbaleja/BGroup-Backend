const ErrorLogger = require('../utils/errorLogger_V1');
const CustomError = require('../utils/customError_V1');

const errorHandler = async (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;

    // Log error to database
    const errorLogId = await ErrorLogger.logError(err, req);

    // Set default status code
    const statusCode = err.statusCode || (res.statusCode === 200 ? 500 : res.statusCode);

    // Handle specific error types
    if (err.name === 'CastError') {
        const message = 'Resource not found';
        error = new CustomError(message, 404);
    }

    if (err.code === 11000) {
        const message = 'Duplicate field value entered';
        error = new CustomError(message, 400);
    }

    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(val => val.message).join(', ');
        error = new CustomError(message, 400);
    }

    if (err.name === 'JsonWebTokenError') {
        const message = 'Invalid token';
        error = new CustomError(message, 401);
    }

    if (err.name === 'TokenExpiredError') {
        const message = 'Token expired';
        error = new CustomError(message, 401);
    }

    // Send error response
    res.status(error.statusCode || statusCode).json({
        success: false,
        message: error.message || err.message,
        errorId: errorLogId,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

module.exports = errorHandler;