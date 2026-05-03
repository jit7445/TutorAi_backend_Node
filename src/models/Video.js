const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
  },
  videoUrl: {
    type: String,
    required: [true, 'Please add a video URL'],
  },
  sourceUrl: {
    type: String,
    description: 'The original link or PDF that was used to generate this video',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Video', videoSchema);
