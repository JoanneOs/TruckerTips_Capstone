const Comment = require('../models/Comment');
const Tip = require('../models/Tip');
const logger = require('../utils/logger');

// @desc    Get all comments
// @route   GET /api/comments
// @access  Public
exports.getComments = async (req, res, next) => {
  try {
    const comments = await Comment.find().populate({
      path: 'user',
      select: 'username'
    });

    res.status(200).json({
      success: true,
      count: comments.length,
      data: comments
    });
  } catch (err) {
    logger.error(`Get comments error: ${err.message}`);
    next(err);
  }
};

// @desc    Get single comment
// @route   GET /api/comments/:id
// @access  Public
exports.getComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id).populate({
      path: 'user',
      select: 'username'
    });

    if (!comment) {
      return res.status(404).json({
        success: false,
        error: 'Comment not found'
      });
    }

    res.status(200).json({
      success: true,
      data: comment
    });
  } catch (err) {
    logger.error(`Get comment error: ${err.message}`);
    next(err);
  }
};

// @desc    Add comment
// @route   POST /api/comments
// @access  Private
exports.addComment = async (req, res, next) => {
  try {
    req.body.user = req.user.id;
    
    const tip = await Tip.findById(req.body.tip);
    
    if (!tip) {
      return res.status(404).json({
        success: false,
        error: 'No tip found with this ID'
      });
    }

    const comment = await Comment.create(req.body);

    res.status(201).json({
      success: true,
      data: comment
    });
  } catch (err) {
    logger.error(`Add comment error: ${err.message}`);
    next(err);
  }
};

// Similar detailed implementations for updateComment and deleteComment...