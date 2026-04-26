const config = require('../config/config');

 //Middleware to verify internal API secret for callbacks

const verifyInternalSecret = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      status: 'error',
      message: 'Unauthorized: Missing or invalid token format',
    });
  }

  const token = authHeader.split(' ')[1];

  if (token !== config.internalApiSecret) {
    return res.status(403).json({
      status: 'error',
      message: 'Forbidden: Invalid API secret',
    });
  }

  next();
};

module.exports = {
  verifyInternalSecret,
};
