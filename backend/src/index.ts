import express, { Application, Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

// 1. Import Routes
import feedbackRoutes from './routes/feedbackRoutes.js';
import authRoutes from './routes/authRoutes.js';

// 2. Load Environment Variables 
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 4000;

// 3. Global Middleware
app.use(cors());
app.use(express.json()); // Essential: Must come before routes to parse request bodies

// 4. Security: Rate Limiting
// Requirement 1.7: Prevent the same IP from spamming submissions
const submissionLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour window
  max: 5, // Limit each IP to 5 POST requests per hour
  message: { 
    success: false, 
    message: 'Too many feedback submissions from this IP. Please try again after an hour.' 
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, 
});

// 5. API Routes
// Apply rate limiter ONLY to POST requests to protect AI credits
app.use('/api/feedback', (req, res, next) => {
  if (req.method === 'POST') {
    return submissionLimiter(req, res, next);
  }
  next();
}, feedbackRoutes);

app.use('/api/auth', authRoutes);

// 6. Health Check Route (Requirement 4.1/4.6)
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ 
    success: true, 
    message: "FeedPulse API is alive and kicking!" 
  });
});

// 7. Database & Server Startup
const mongoUri = process.env.MONGO_URI || '';

if (!mongoUri) {
  console.error("❌ ERROR: MONGO_URI is missing from .env!");
  process.exit(1);
}

mongoose.connect(mongoUri)
  .then(() => {
    console.log('✅ Connected to MongoDB Atlas successfully!');
    
    app.listen(PORT, () => {
      console.log(`🚀 FeedPulse Server is running on: http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB Connection Error:', err.message);
  });