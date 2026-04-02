import { GoogleGenerativeAI } from "@google/generative-ai";

export const analyzeFeedback = async (title: string, description: string) => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.error("❌ AI ERROR: GEMINI_API_KEY is missing.");
    return null;
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);


    const model = genAI.getGenerativeModel(
      { model: "gemini-3-flash-preview" },
      { apiVersion: "v1beta" } 
    );

const prompt = `
  Analyse this product feedback. 
  Return ONLY a valid JSON object with these EXACT fields:
  {
    "category": "Bug" | "Feature Request" | "Improvement" | "Other",
    "sentiment": "Positive" | "Neutral" | "Negative",
    "priority_score": number (1-10),
    "summary": "A one-sentence summary of the user's issue",
    "tags": ["tag1", "tag2"]
  }

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


export const generateTrendSummary = async (feedbacks: any[]) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || feedbacks.length === 0) return "No feedback available to summarize.";

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel(
      { model: "gemini-3-flash-preview" },
      { apiVersion: "v1beta" }
    );

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