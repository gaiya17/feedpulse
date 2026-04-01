import { Request, Response } from 'express';
import Feedback from '../models/Feedback.js';
import { analyzeFeedback } from '../services/gemini.service.js'; // Import our new AI service

export const createFeedback = async (req: Request, res: Response) => {
  try {
    const { title, description, category, submitterName, submitterEmail } = req.body;

    // 1. Basic Validation (Requirement 1.3)
    if (!title || !description || description.length < 20) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed: Description must be at least 20 characters.',
        error: 'Bad Request'
      });
    }

    // 2. Initial Save to MongoDB (Requirement 1.4)
    const newFeedback = new Feedback({
      title,
      description,
      category,
      submitterName,
      submitterEmail
    });

    const savedFeedback = await newFeedback.save();

    // 3. AI Analysis with Gemini (Requirement 2.1)
    // Wrap in a separate try-catch so AI failure doesn't delete the feedback (Requirement 2.3)
    try {
      const aiData = await analyzeFeedback(title, description);

      if (aiData) {
        // Map Gemini's JSON response to our MongoDB fields (Requirement 2.2)
        savedFeedback.ai_category = aiData.category;
        savedFeedback.ai_sentiment = aiData.sentiment;
        savedFeedback.ai_priority = aiData.priority_score;
        savedFeedback.ai_summary = aiData.summary;
        savedFeedback.ai_tags = aiData.tags;
        savedFeedback.ai_processed = true;

        await savedFeedback.save(); // Update the document with AI results
      }
    } catch (aiError) {
      console.error("AI Analysis failed:", aiError);
      // We don't return an error here because the feedback is already saved (Requirement 2.3)
    }

    // 4. Return Consistent JSON (Requirement 4.1)
    // Replace your final return with this:
return res.status(201).json({
  success: true,
  data: savedFeedback,
  message: savedFeedback.ai_processed 
    ? 'Feedback submitted and AI analyzed!' 
    : 'Feedback submitted, but AI analysis failed.'
});

  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message
    });
  }
};

// --- Requirement 4.2: Get all feedback entries ---
export const getAllFeedback = async (req: Request, res: Response) => {
  try {
    // Senior Tip: Sort by 'createdAt' descending so newest feedback shows up first
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    
    return res.status(200).json({
      success: true,
      count: feedbacks.length,
      data: feedbacks
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Error fetching feedback',
      error: error.message
    });
  }
};

// --- Requirement 4.3: Update feedback status ---
export const updateFeedbackStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = ['New', 'In Progress', 'Resolved'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status format.'
      });
    }

    const updatedFeedback = await Feedback.findByIdAndUpdate(
      id,
      { status },
      { 
        returnDocument: 'after', // This replaces 'new: true' to stop the warning
        runValidators: true 
      }
    );

    if (!updatedFeedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: updatedFeedback,
      message: `Status updated to ${status}`
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Error updating status',
      error: error.message
    });
  }
};