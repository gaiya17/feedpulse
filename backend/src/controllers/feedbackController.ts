import { Request, Response } from 'express';
import Feedback from '../models/Feedback.js'; // Note the .js extension for ESM

export const createFeedback = async (req: Request, res: Response) => {
  try {
    const { title, description, category, submitterName, submitterEmail } = req.body;

    // 1. Basic Validation (Requirement 1.3 & 4.5) [cite: 57, 96]
    if (!title || !description || description.length < 20) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed: Description must be at least 20 characters.',
        error: 'Bad Request'
      });
    }

    // 2. Create the document using our Mongoose model [cite: 100-114]
    const newFeedback = new Feedback({
      title,
      description,
      category,
      submitterName,
      submitterEmail
    });

    // 3. Save to MongoDB Atlas
    const savedFeedback = await newFeedback.save();

    // 4. Consistent JSON Response (Requirement 4.1 & 4.6) [cite: 96]
    return res.status(201).json({
      success: true,
      data: savedFeedback,
      message: 'Feedback submitted successfully!'
    });

  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message
    });
  }
};