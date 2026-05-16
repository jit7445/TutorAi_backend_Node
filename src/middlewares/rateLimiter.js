const { RateLimiterRedis } = require('rate-limiter-flexible');
const { createClient } = require('redis');
const config = require('../config/config');

const redisClient = createClient({
  url: config.redisUrl,
  enable_offline_queue: false,
});

redisClient.connect().catch((err) => {
  console.error('Redis connection error in rate limiter:', err);
});

const rateLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'middleware',
  points: 100, // Number of points
  duration: 60, // Per 60 seconds
});

const rateLimiterMiddleware = (req, res, next) => {
  const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

  rateLimiter
    .consume(clientIp)
    .then(() => {
      next();
    })
    .catch((rejectResponse) => {
      res.status(429).json({
        status: 'error',
        message: 'Too Many Requests',
        retryAfter: Math.round(rejectResponse.msBeforeNext / 1000) || 1,
      });
    });
};

module.exports = rateLimiterMiddleware;
