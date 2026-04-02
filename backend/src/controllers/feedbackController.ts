import { Request, Response } from 'express';
import Feedback from '../models/Feedback.js';
import { analyzeFeedback, generateTrendSummary } from '../services/gemini.service.js';

// Public Feedback Submission
export const createFeedback = async (req: Request, res: Response) => {
  try {
    const { title, description, category, submitterName, submitterEmail } = req.body;

    // Validation
    if (!title || !description || description.length < 20) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed: Title is required and description must be at least 20 characters.',
        error: 'Bad Request'
      });
    }

    // Save to MongoDB
    const newFeedback = new Feedback({
      title,
      description,
      category,
      submitterName,
      submitterEmail
    });

    const savedFeedback = await newFeedback.save();

    // Immediate AI Analysis
    try {
  const aiData = await analyzeFeedback(title, description);

  if (aiData) {
    savedFeedback.ai_category = aiData.category;
    savedFeedback.ai_sentiment = aiData.sentiment;
    savedFeedback.ai_priority = aiData.priority_score;
    savedFeedback.ai_summary = aiData.summary; 
    savedFeedback.ai_tags = aiData.tags;
    savedFeedback.ai_processed = true;

    await savedFeedback.save();
  }
} catch (aiError) {
  console.error("Gemini failed:", aiError);
}
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


export const getAllFeedback = async (req: Request, res: Response) => {
  try {
    const { category, status, page = 1, limit = 10 } = req.query;

    const filter: any = {};
    if (category && category !== 'All') filter.category = category;
    if (status && status !== 'All') filter.status = status;

    const skip = (Number(page) - 1) * Number(limit);

    const feedbacks = await Feedback.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Feedback.countDocuments(filter);

    return res.status(200).json({
      success: true,
      data: feedbacks,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Error fetching feedback',
      error: error.message
    });
  }
};

// Admin Status Update
 
export const updateFeedbackStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Valid Enum values
    const allowedStatuses = ['New', 'In Review', 'Resolved'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be New, In Review, or Resolved.'
      });
    }

    const updatedFeedback = await Feedback.findByIdAndUpdate(
      id,
      { status },
      { returnDocument: 'after', runValidators: true }
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

// Get Single Item
export const getFeedbackById = async (req: Request, res: Response) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) return res.status(404).json({ success: false, message: 'Not found' });
    return res.status(200).json({ success: true, data: feedback });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// Delete Item
export const deleteFeedback = async (req: Request, res: Response) => {
  try {
    const feedback = await Feedback.findByIdAndDelete(req.params.id);
    if (!feedback) return res.status(404).json({ success: false, message: 'Not found' });
    return res.status(200).json({ success: true, message: 'Feedback deleted successfully' });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const getAISummary = async (req: Request, res: Response) => {
  try {
    const latestFeedback = await Feedback.find().sort({ createdAt: -1 }).limit(10);

    if (latestFeedback.length === 0) {
      return res.status(200).json({
        success: true,
        data: { summary: "Not enough feedback yet to generate a summary." }
      });
    }

    const summary = await generateTrendSummary(latestFeedback);

    return res.status(200).json({
      success: true,
      data: { summary }
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Error generating summary',
      error: error.message
    });
  }
};

export const reanalyzeFeedback = async (req: Request, res: Response) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) return res.status(404).json({ success: false, message: 'Not found' });

    // Re-trigger AI analysis 
    const aiData = await analyzeFeedback(feedback.title, feedback.description);

    if (aiData) {
      feedback.ai_category = aiData.category;
      feedback.ai_sentiment = aiData.sentiment;
      feedback.ai_priority = aiData.priority_score;
      feedback.ai_summary = aiData.summary;
      feedback.ai_tags = aiData.tags;
      feedback.ai_processed = true;
      await feedback.save();
    }

    return res.status(200).json({ 
      success: true, 
      data: feedback, 
      message: 'AI Analysis re-triggered successfully' 
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
};