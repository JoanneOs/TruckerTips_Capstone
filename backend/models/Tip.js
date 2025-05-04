const mongoose = require('mongoose');
const slugify = require('slugify');

const tipSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters']
    },
    content: {
      type: String,
      required: [true, 'Please add content']
    },
    slug: String,
    category: {
      type: String,
      required: true,
      enum: [
        'safety',
        'efficiency',
        'maintenance',
        'regulation',
        'health'
      ],
      default: 'safety'
    },
    likes: {
      type: Number,
      default: 0
    },
    likedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    isFeatured: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Create tip slug from the title
tipSchema.pre('save', function(next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});

// Cascade delete comments when a tip is deleted
tipSchema.pre('remove', async function(next) {
  await this.model('Comment').deleteMany({ tip: this._id });
  next();
});

// Reverse populate with virtuals
tipSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'tip',
  justOne: false
});

module.exports = mongoose.model('Tip', tipSchema);