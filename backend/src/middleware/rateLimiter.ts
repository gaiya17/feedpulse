import rateLimit from 'express-rate-limit';

// Prevent > 5 submissions per hour per IP 
export const feedbackRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, 
  message: {
    success: false,
    message: "Too many feedback submissions. Please try again in an hour.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});