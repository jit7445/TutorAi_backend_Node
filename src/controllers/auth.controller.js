const User = require('../models/User');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = jwt.sign({ id: user._id }, config.jwtSecret, {
    expiresIn: config.jwtExpire,
  });

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
};

// @desc    Register user
// @route   POST /api/v1/auth/signup
// @access  Public
const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Create user
    const user = await User.create({
      name,
      email,
      password,
    });

    sendTokenResponse(user, 201, res);
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide an email and password',
      });
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid credentials',
      });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid credentials',
      });
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

module.exports = {
  signup,
  login,
};
