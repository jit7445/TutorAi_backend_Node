const express = require('express');
const healthRoutes = require('./health.routes');
const aiRoutes = require('./ai.routes');
const userRoutes = require('./user.routes');
const dataRoutes = require('./data.routes');
const authRoutes = require('./auth.routes');
const { protect } = require('../middlewares/auth.middleware');

const router = express.Router();

// Define API routes
router.use('/health', healthRoutes);
router.use('/auth', authRoutes);

// Apply protection specifically where needed
router.use('/ai', aiRoutes); 
router.use('/users', protect, userRoutes);
router.use('/store', protect, dataRoutes);
// router.use('/users', userRoutes);

module.exports = router;
