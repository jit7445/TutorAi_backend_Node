const express = require('express');
const healthRoutes = require('./health.routes');
const aiRoutes = require('./ai.routes');

const router = express.Router();

// Define API routes
router.use('/health', healthRoutes);
router.use('/ai', aiRoutes);

// You can add more routes here
// router.use('/auth', authRoutes);
// router.use('/users', userRoutes);

module.exports = router;
