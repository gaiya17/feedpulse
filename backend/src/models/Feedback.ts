import mongoose, { Schema, Document } from 'mongoose';

// 1. The Interface: This is for TypeScript. 
// It tells VS Code exactly what "properties" a Feedback object has.
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
}

// 2. The Schema: This is for MongoDB.
// It enforces rules (like max length or required fields).
const FeedbackSchema: Schema = new Schema({
  title: { type: String, required: true, maxlength: 120 }, // [cite: 101]
  description: { type: String, required: true, minlength: 20 }, // [cite: 102]
  category: { 
    type: String, 
    enum: ['Bug', 'Feature Request', 'Improvement', 'Other'], 
    required: true 
  }, // [cite: 103]
  status: { 
    type: String, 
    enum: ['New', 'In Progress', 'Resolved'], 
    default: 'New' 
  }, // [cite: 103]
  submitterName: { type: String }, // [cite: 104]
  submitterEmail: { type: String }, // [cite: 105]
  
  // AI fields that Gemini will fill later [cite: 106-112]
  ai_category: { type: String },
  ai_sentiment: { type: String, enum: ['Positive', 'Neutral', 'Negative'] },
  ai_priority: { type: Number, min: 1, max: 10 },
  ai_summary: { type: String },
  ai_tags: [{ type: String }],
  ai_processed: { type: Boolean, default: false }
}, { 
  timestamps: true // Auto-manages createdAt and updatedAt [cite: 113, 114]
});

// 3. Performance Trick: Indexing 
// This makes the Admin Dashboard super fast when filtering.
FeedbackSchema.index({ status: 1, category: 1, ai_priority: -1 });

export default mongoose.model<IFeedback>('Feedback', FeedbackSchema);

// Add these right before export default...
FeedbackSchema.index({ status: 1 });
FeedbackSchema.index({ category: 1 });
FeedbackSchema.index({ ai_priority: -1 }); // -1 for descending (highest priority first)
FeedbackSchema.index({ createdAt: -1 });