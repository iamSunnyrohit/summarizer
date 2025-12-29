const rateLimit = require('express-rate-limit');

exports.summaryLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 10,
  message: 'Too many summarization requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});