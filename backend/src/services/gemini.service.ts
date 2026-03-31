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