
import rateLimit from 'express-rate-limit';
import { APIError } from '../../Utility/ApiError.js';

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 7, // Limit each IP to 7 login attempts per windowMs
  standardHeaders: true,
  legacyHeaders: false,

  keyGenerator: req => {
    return req.user?.id || req.ip; // Prioritize user ID if available, otherwise fallback to IP
  },

  handler: (req, res, next) => {
    return new APIError(429, [
          'Too many login attempts, please try again later.',
        ]).send(res);
  },
});
