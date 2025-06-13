const ErrorLog = require('../../models/settings/ErrorLog_V1');
const ErrorLogger = require('../utils/errorLogger_V1');
const asyncHandler = require('../utils/asyncHandler_V1');

// Get all errors with pagination and filtering
exports.getAllErrors = asyncHandler(async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = {};
    if (req.query.errorType) filter.errorType = req.query.errorType;
    if (req.query.statusCode) filter.statusCode = req.query.statusCode;
    if (req.query.resolved) filter.resolved = req.query.resolved === 'true';
    if (req.query.severity) filter.severity = req.query.severity;

    // Date range filter
    if (req.query.startDate || req.query.endDate) {
        filter.timestamp = {};
        if (req.query.startDate) filter.timestamp.$gte = new Date(req.query.startDate);
        if (req.query.endDate) filter.timestamp.$lte = new Date(req.query.endDate);
    }

    const errors = await ErrorLog.find(filter)
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(limit)
        .populate('userId', 'name email');

    const total = await ErrorLog.countDocuments(filter);

    res.status(200).json({
        success: true,
        data: {
            errors,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalErrors: total,
                hasNext: page < Math.ceil(total / limit),
                hasPrev: page > 1
            }
        }
    });
});

// Get error statistics
exports.getErrorStats = asyncHandler(async (req, res, next) => {
    const timeRange = parseInt(req.query.hours) || 24;
    const stats = await ErrorLogger.getErrorStats(timeRange);

    res.status(200).json({
        success: true,
        data: {
            timeRange: `${timeRange} hours`,
            statistics: stats
        }
    });
});

// Mark error as resolved
exports.markErrorResolved = asyncHandler(async (req, res, next) => {
    const error = await ErrorLog.findByIdAndUpdate(
        req.params.id,
        { resolved: true },
        { new: true }
    );

    if (!error) {
        return next(new CustomError('Error log not found', 404));
    }

    res.status(200).json({
        success: true,
        message: 'Error marked as resolved',
        data: error
    });
});

// Delete old error logs
exports.cleanupOldErrors = asyncHandler(async (req, res, next) => {
    const daysOld = parseInt(req.query.days) || 30;
    const cutoffDate = new Date(Date.now() - daysOld * 24 * 60 * 60 * 1000);

    const result = await ErrorLog.deleteMany({
        timestamp: { $lt: cutoffDate },
        resolved: true
    });

    res.status(200).json({
        success: true,
        message: `Cleaned up ${result.deletedCount} old error logs`,
        data: {
            deletedCount: result.deletedCount,
            cutoffDate
        }
    });
});