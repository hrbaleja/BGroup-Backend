const ErrorLog = require('../models/settings/ErrorLog');
const { STATUS } = require('../constants/company');

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || STATUS.SERVER_ERROR;
  // Log the error
  const errorLog = new ErrorLog({
    user: req.user ? req.user.Id : null,
    controller: err.controller,
    method: err.method,
    errorMessage: err.message,
    errorStack: err.stack
  });

  errorLog.save().catch(logErr => console.error('Error saving error log:', logErr));

  res.status(err.statusCode).json({
    success: false,
    error: err.message
  });
};