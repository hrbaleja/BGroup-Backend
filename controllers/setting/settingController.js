const ErrorLog = require('../../models/settings/ErrorLog');


exports.fetchErrorLogs = async (req, res,next) => {
  try {
    const errorLogs = await ErrorLog.find().sort({ timestamp: -1 }).limit(10).populate('user', 'name');
    res.json(errorLogs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching error logs', error: error.message });
  }
};