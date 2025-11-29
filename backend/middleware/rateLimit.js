const rateLimit = require('express-rate-limit');

// General API rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter limits for sensitive operations
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 auth attempts per windowMs
  message: {
    error: 'Too many authentication attempts, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Report submission rate limiting
const reportLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // limit each IP to 10 reports per hour
  message: {
    error: 'Too many reports submitted, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// AI analysis rate limiting (expensive operations)
const aiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50, // limit each IP to 50 AI requests per hour
  message: {
    error: 'AI service rate limit exceeded, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  apiLimiter,
  authLimiter,
  reportLimiter,
  aiLimiter
};