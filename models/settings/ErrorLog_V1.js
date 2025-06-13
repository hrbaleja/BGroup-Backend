const mongoose = require('mongoose');

const errorLogSchema = new mongoose.Schema({
    message: { type: String, required: true },
    stack: { type: String },
    statusCode: { type: Number, default: 500 },
    errorType: {
        type: String,
        enum: ['ValidationError', 'CastError', 'DuplicateKeyError', 'JsonWebTokenError', 'TokenExpiredError', 'CustomError', 'UnhandledError'],
        default: 'UnhandledError'
    },
    method: { type: String },
    url: { type: String },
    ip: { type: String },
    userAgent: { type: String },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    requestBody: { type: mongoose.Schema.Types.Mixed },
    requestParams: { type: mongoose.Schema.Types.Mixed },
    requestQuery: { type: mongoose.Schema.Types.Mixed },
    createdAt: { type: Date, default: Date.now, },
}, { versionKey: false });

// Index for better query performance
errorLogSchema.index({ timestamp: -1 });
errorLogSchema.index({ errorType: 1 });
errorLogSchema.index({ statusCode: 1 });

module.exports = mongoose.model('ErrorLog', errorLogSchema);
