const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const logger = require('../utils/logger');

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  const { username, password } = req.body;

  try {
    // Input validation
    if (!username || !password) {
      logger.error('Missing credentials');
      return res.status(400).json({ success: false, error: 'Please provide all required fields' });
    }

    // Check if user exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ success: false, error: 'User already exists' });
    }

    // Create user
    const user = await User.create({ username, password });

    // Create token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE
    });

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username
      }
    });
  } catch (err) {
    logger.error(`Registration error: ${err.message}`);
    next(err);
  }
};

// Similar detailed implementation for login...