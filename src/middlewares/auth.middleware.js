const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config/config');

// Middleware to verify internal API secret for callbacks (FastAPI to Node.js)
const verifyInternalSecret = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      status: 'error',
      message: 'Unauthorized: Missing or invalid token format',
    });
  }

  const token = authHeader.split(' ')[1];

  if (token !== config.internalApiSecret.trim()) {
    return res.status(403).json({
      status: 'error',
      message: 'Forbidden: Invalid API secret',
    });
  }

  next();
};

// Protect routes for User Authentication (JWT)
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      status: 'error',
      message: 'Not authorized to access this route',
    });
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'User no longer exists',
      });
    }

    next();
  } catch (err) {
    return res.status(401).json({
      status: 'error',
      message: 'Not authorized to access this route',
    });
  }
};

module.exports = {
  verifyInternalSecret,
  protect,
};
