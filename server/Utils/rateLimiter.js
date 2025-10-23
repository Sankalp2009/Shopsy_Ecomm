import { rateLimit } from 'express-rate-limit';

export const generalLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 min
  limit: 100,
  message: {
    error: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const authLimit = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 min
  limit: 5,
  message: {
    error: 'Too many login attempts, please try again later.',
  },
  skipSuccessfulRequests: true,
  standardHeaders: true,
  legacyHeaders: false,
});
