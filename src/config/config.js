require('dotenv').config();

const config = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 7000,
  aiBackendUrl: process.env.AI_BACKEND_URL || 'http://localhost:8000',
  internalApiSecret: process.env.INTERNAL_API_SECRET || 'fallback_secret',
  mongooseUri: process.env.MONGODB_URI,
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
  jwtSecret: process.env.JWT_SECRET || 'fallback_jwt_secret',
  jwtExpire: process.env.JWT_EXPIRE || '30d',
};

module.exports = config;
