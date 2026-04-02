import express, { Application, Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';

import feedbackRoutes from './routes/feedbackRoutes.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 4000;

//  Global Middleware
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json()); 
app.use(mongoSanitize());

const submissionLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour window
  max: 5, // Limit each IP to 5 POST requests per hour
  message: { 
    success: false, 
    message: 'Too many feedback submissions from this IP. Please try again after an hour.' 
  },
  standardHeaders: true, 
  legacyHeaders: false, 
});

app.use((req, res, next) => {
  console.log(`Incoming Request: ${req.method} ${req.url}`);
  next();
});

//  API Routes
app.use('/api/feedback', (req, res, next) => {
  if (req.method === 'POST') {
    return submissionLimiter(req, res, next);
  }
  next();
}, feedbackRoutes);

app.use('/api/auth', authRoutes);

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ 
    success: true, 
    message: "FeedPulse API is alive and kicking!" 
  });
});

// Database & Server Startup
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