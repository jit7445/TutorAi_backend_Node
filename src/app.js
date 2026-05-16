const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const rateLimiterMiddleware = require('./middlewares/rateLimiter');

const app = express();

// Middleware
app.use(cors());
app.use(rateLimiterMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root Route
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'TutorAI API is running. Access /api/v1/health for health check.',
  });
});

// API Routes
app.use('/api/v1', routes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Route not found',
  });
});

module.exports = app;
