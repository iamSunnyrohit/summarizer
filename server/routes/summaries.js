const express = require('express');
const router = express.Router();
const {
  generateSummary,
  saveSummary,
  getUserSummaries,
  getSummary,
  deleteSummary
} = require('../controllers/summaryController');
const { protect } = require('../middleware/auth');
const { summaryLimiter } = require('../middleware/rateLimiter');

router.post('/generate', protect, summaryLimiter, generateSummary);
router.post('/', protect, saveSummary);
router.get('/', protect, getUserSummaries);
router.get('/:id', protect, getSummary);
router.delete('/:id', protect, deleteSummary);

module.exports = router;