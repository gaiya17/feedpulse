import { GoogleGenerativeAI } from "@google/generative-ai";

export const analyzeFeedback = async (title: string, description: string) => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.error("❌ AI ERROR: GEMINI_API_KEY is missing.");
    return null;
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);

    /**
     * SENIOR FIX FOR PREVIEW MODELS:
     * 1. Use the exact technical ID: 'gemini-3-flash-preview'
     * 2. Force apiVersion to 'v1beta' because Preview models do not exist in 'v1'.
     */
    const model = genAI.getGenerativeModel(
      { model: "gemini-3-flash-preview" },
      { apiVersion: "v1beta" } // <--- CRITICAL CHANGE
    );

    const prompt = `
      Analyze this product feedback. 
      Return ONLY valid JSON with these fields: 
      "category" (Bug | Feature Request | Improvement | Other), 
      "sentiment" (Positive | Neutral | Negative), 
      "priority_score" (1-10), 
      "summary" (max 100 chars), 
      "tags" (array of strings).

      Feedback Title: ${title}
      Feedback Description: ${description}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const cleanJson = text.replace(/```json|```/g, "").trim();
    return JSON.parse(cleanJson);
    
  } catch (error: any) {
    console.error("❌ Gemini AI Processing Error:", error.message);
    return null;
  }
};

// Add this new function to gemini.service.ts
export const generateTrendSummary = async (feedbacks: any[]) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || feedbacks.length === 0) return "No feedback available to summarize.";

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel(
      { model: "gemini-3-flash-preview" },
      { apiVersion: "v1beta" }
    );

    // Format the feedback list into a readable string for the AI
    const feedbackText = feedbacks.map(f => `- [${f.category}] ${f.title}: ${f.description}`).join('\n');

    const prompt = `
      You are a Product Manager assistant. Analyze the following feedback entries from users. 
      Provide a concise 3-sentence summary highlighting the most common complaints, 
      recurring themes, and one suggested priority action for the team.

      User Feedback:
      ${feedbackText}
    `;

    const result = await model.generateContent(prompt);
    return result.response.text();
    
  } catch (error: any) {
    console.error("Summary Generation Error:", error.message);
    return "Could not generate AI summary at this time.";
  }
};