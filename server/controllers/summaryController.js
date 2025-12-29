const Summary = require('../models/Summary');
const { summarizeText, analyzeSentiment } = require('../services/openaiService');

// Generate Summary (without saving)
exports.generateSummary = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim().length < 100) {
      return res.status(400).json({ message: 'Text must be at least 100 characters' });
    }

    // Limit text length
    const maxLength = 10000;
    const processedText = text.slice(0, maxLength);

    // Get summary and sentiment in parallel
    const [summaryResult, sentiment] = await Promise.all([
      summarizeText(processedText),
      analyzeSentiment(processedText)
    ]);

    res.json({
      summary: summaryResult.summary,
      bulletPoints: summaryResult.bulletPoints,
      sentiment,
      wordCount: processedText.split(/\s+/).length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Save Summary
exports.saveSummary = async (req, res) => {
    try {
      const { originalText, summary, bulletPoints, sentiment, source, title } = req.body;
  
      const summaryDoc = await Summary.create({
        user: req.user._id,
        originalText,
        summary,
        bulletPoints,
        sentiment,
        source,
        title,
        wordCount: originalText.split(/\s+/).length
      });
  
      res.status(201).json(summaryDoc);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  // Get User Summaries
  exports.getUserSummaries = async (req, res) => {
    try {
      const summaries = await Summary.find({ user: req.user._id })
        .sort({ createdAt: -1 })
        .select('-originalText'); // Exclude full text for performance
  
      res.json(summaries);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  // Get Single Summary
  exports.getSummary = async (req, res) => {
    try {
      const summary = await Summary.findOne({
        _id: req.params.id,
        user: req.user._id
      });
  
      if (!summary) {
        return res.status(404).json({ message: 'Summary not found' });
      }
  
      res.json(summary);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  // Delete Summary
  exports.deleteSummary = async (req, res) => {
    try {
      const summary = await Summary.findOneAndDelete({
        _id: req.params.id,
        user: req.user._id
      });
  
      if (!summary) {
        return res.status(404).json({ message: 'Summary not found' });
      }
  
      res.json({ message: 'Summary deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };