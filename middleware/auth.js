const jwt = require('jsonwebtoken');
const User = require('../models/User');
const errorHandler = require('../utils/errorHandler');

exports.protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = {
        userId: decoded.userId,
        role: decoded.role,
      };

      next();
    } catch (err) {
      res.status(401).json({ msg: 'Invalid token' });
    }
  }

  if (!token) {
    res.status(401).json({ msg: 'No token, authorization denied' });
  }
};