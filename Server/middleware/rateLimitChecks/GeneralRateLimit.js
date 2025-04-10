import rateLimit from 'express-rate-limit';
import { APIError } from '../../Utility/ApiError.js';

export const generalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,

  keyGenerator: req => {
    return req.user?.id || req.ip; // Prioritize user ID if available, otherwise fallback to IP
  },

  handler: (req, res, next) => {
    return new APIError(429, ['Too many requests, please try again later.']).send(res);
  },
});
