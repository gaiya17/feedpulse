import mongoose, { Schema, Document } from 'mongoose';

// Requirement 5: MongoDB Schema & Data Design

export interface IFeedback extends Document {
  title: string;
  description: string;
  category: 'Bug' | 'Feature Request' | 'Improvement' | 'Other';
  status: 'New' | 'In Review' | 'Resolved'; 
  submitterName?: string;
  submitterEmail?: string;
  ai_category?: string;
  ai_sentiment?: 'Positive' | 'Neutral' | 'Negative';
  ai_priority?: number;
  ai_summary?: string;
  ai_tags?: string[];
  ai_processed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

//Defines the structure and validation rules for MongoDB.
const FeedbackSchema: Schema = new Schema({
  
  title: { 
    type: String, 
    required: true, 
    maxlength: 120,
    trim: true 
  },
  // Description (required, min 20 chars)
  description: { 
    type: String, 
    required: true, 
    minlength: 20 
  },

  category: { 
    type: String, 
    enum: ['Bug', 'Feature Request', 'Improvement', 'Other'], 
    required: true 
  },

  status: { 
    type: String, 
    enum: ['New', 'In Review', 'Resolved'], 
    default: 'New' 
  },

  submitterName: { type: String, trim: true },
  submitterEmail: { 
    type: String, 
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'] 
  },
  

  ai_category: { type: String },
  ai_sentiment: { 
    type: String, 
    enum: ['Positive', 'Neutral', 'Negative'] 
  },
  ai_priority: { 
    type: Number, 
    min: 1, 
    max: 10 
  },
  ai_summary: { type: String },
  ai_tags: [{ type: String }],
  ai_processed: { 
    type: Boolean, 
    default: false 
  }
}, { 

  timestamps: true 
});

// Performance Indexes

FeedbackSchema.index({ status: 1 });
FeedbackSchema.index({ category: 1 });
FeedbackSchema.index({ ai_priority: -1 }); // Highest priority first
FeedbackSchema.index({ createdAt: -1 });   // Newest reports first

export default mongoose.model<IFeedback>('Feedback', FeedbackSchema);