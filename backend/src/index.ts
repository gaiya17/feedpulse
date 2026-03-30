import express, { Application, Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import feedbackRoutes from './routes/feedbackRoutes.js';

// 1. Load Environment Variables 
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 4000;

// 2. Middleware
app.use(cors());
app.use(express.json()); // Allows the server to "read" JSON data sent by the user 
app.use('/api/feedback', feedbackRoutes);

// 3. MongoDB Connection Logic
const mongoUri = process.env.MONGO_URI || '';

if (!mongoUri) {
  console.error("❌ ERROR: MONGO_URI is not defined in .env file!");
  process.exit(1); // Stop the server if there is no database link
}

mongoose.connect(mongoUri)
  .then(() => {
    console.log('✅ Connected to MongoDB Atlas successfully!');
    
    // 4. Start the Server ONLY after the database is ready
    app.listen(PORT, () => {
      console.log(`🚀 FeedPulse Server is running on: http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB Connection Error:', err.message);
  });

// 5. A simple "Health Check" route
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ 
    success: true, 
    message: "FeedPulse API is alive and kicking!" 
  }); // Consistent JSON response
});