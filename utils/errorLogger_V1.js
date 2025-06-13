const ErrorLog = require('../models/settings/ErrorLog_V1');

class ErrorLogger {

    static async logError(error, req, additionalInfo = {}) {
        try {
            const { controller, methodName } = this.captureErrorContext(error);
            // const controller = error.controller || 'UnknownController';
            // const methodName = error.method || 'UnknownMethod';
            const httpMethod = req?.method || 'UNKNOWN';
            const errorLog = new ErrorLog({
                message: error.message || 'Unknown error',
                stack: error.stack,
                statusCode: error.statusCode || 500,
                errorType: this.getErrorType(error),
                method: `${controller} - ${methodName} - ${httpMethod}`, // 👈 key part
                url: req?.originalUrl || req?.url,
                ip: req?.ip || req?.connection?.remoteAddress,
                userAgent: req?.get('User-Agent'),
                userId: req?.user?.Id || req?.user?._id,
                requestBody: this.sanitizeRequestData(req?.body),
                requestParams: req?.params,
                requestQuery: req?.query,
            });

            await errorLog.save();
            // console.log(`Error logged with ID: ${errorLog._id}`);
            return errorLog._id;
        } catch (logError) {
            // console.error('Failed to log error to database:', logError);
            // Fallback to console logging
            console.error('Original error:', error);
        }
    }

    static getErrorType(error) {
        if (error.name === 'ValidationError') return 'ValidationError';
        if (error.name === 'CastError') return 'CastError';
        if (error.code === 11000) return 'DuplicateKeyError';
        if (error.name === 'JsonWebTokenError') return 'JsonWebTokenError';
        if (error.name === 'TokenExpiredError') return 'TokenExpiredError';
        if (error.isCustomError) return 'CustomError';
        return 'UnhandledError';
    }


    static sanitizeRequestData(data) {
        if (!data) return null;

        const sanitized = { ...data };
        const sensitiveFields = ['password', 'token', 'secret', 'key', 'auth'];

        for (const field of sensitiveFields) {
            if (sanitized[field]) {
                sanitized[field] = '[REDACTED]';
            }
        }

        return sanitized;
    }

    static captureErrorContext(error) {
        let controller = 'UnknownController';
        let methodName = 'UnknownMethod';

        if (error && error.stack) {
            const stackLines = error.stack.split('\n');
            if (stackLines.length > 1) {
                const callerLine = stackLines[1].trim();

                let match = callerLine.match(/at\s+(?:(\w+)\.)?(\w+)\s+\((.+?):(\d+):(\d+)\)/);
                if (match) {
                    const fullPath = match[3];
                    const pathParts = fullPath.split(/[\\/]/); // Split by '/' or '\'
                    controller = pathParts[pathParts.length - 1].replace('.js', '');
                    methodName = match[2];
                } else {
                    // Fallback for other formats like: at /path/to/file.js:line:col
                    match = callerLine.match(/at\s+(.+?):(\d+):(\d+)/);
                    if (match) {
                        const fullPath = match[1];
                        const pathParts = fullPath.split(/[\\/]/);
                        controller = pathParts[pathParts.length - 1].replace('.js', '');
                        // methodName remains "UnknownMethod"
                    }
                }
            }
        }

        return { controller, methodName };
    }


    // Get error statistics
    static async getErrorStats(timeRange = 24) {
        try {
            const hoursAgo = new Date(Date.now() - timeRange * 60 * 60 * 1000);

            const stats = await ErrorLog.aggregate([
                { $match: { timestamp: { $gte: hoursAgo } } },
                {
                    $group: {
                        _id: {
                            errorType: '$errorType',
                            statusCode: '$statusCode'
                        },
                        count: { $sum: 1 },
                        lastOccurrence: { $max: '$timestamp' }
                    }
                },
                { $sort: { count: -1 } }
            ]);

            return stats;
        } catch (error) {
            console.error('Error getting stats:', error);
            return [];
        }
    }
}

module.exports = ErrorLogger;