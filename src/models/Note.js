const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
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
  pdfUrl: {
    type: String,
    required: [true, 'Please add a PDF URL'],
  },
  thumbnailUrl: {
    type: String,
  },
  sourceUrl: {
    type: String,
    description: 'The original link or PDF that was used to generate this note',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Note', noteSchema);
