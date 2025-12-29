const mongoose = require('mongoose');

const summarySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  originalText: {
    type: String,
    required: true
  },
  summary: {
    type: String,
    required: true
  },
  bulletPoints: [{
    type: String
  }],
  sentiment: {
    score: {
      type: Number,
      min: -1,
      max: 1
    },
    label: {
      type: String,
      enum: ['positive', 'negative', 'neutral']
    }
  },
  wordCount: {
    type: Number
  },
  source: {
    type: String,
    enum: ['article', 'youtube', 'custom'],
    default: 'custom'
  },
  title: {
    type: String,
    default: 'Untitled Summary'
  },
  tags: [{
    type: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
summarySchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Summary', summarySchema);