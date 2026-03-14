import { GoogleGenAI } from "@google/genai";

export async function getChatbotResponse(message: string, history: { role: 'user' | 'model', parts: { text: string }[] }[]) {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
    const response = await ai.models.generateContent({ 
      model: "gemini-3-flash-preview",
      contents: [...history, { role: 'user', parts: [{ text: message }] }],
      config: {
        systemInstruction: "You are a Mental Health AI Chatbot for 'HealthCare Companion'. Provide supportive, empathetic, and helpful responses related to stress, anxiety, sleep, diet, exercise, and general wellness. Suggest breathing exercises, meditation, and healthy habits. If the user seems in crisis, suggest professional help. Keep responses concise and friendly."
      }
    });

    return response.text || "I'm here to listen. How can I help?";
  } catch (error) {
    console.error("Chatbot Error:", error);
    return "I'm sorry, I'm having trouble connecting right now. Please try again later.";
  }
}

export async function getDailyHealthTip() {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Provide a short, professional daily health tip for a mobile app. Categories: nutrition, fitness, mental health, or lifestyle. Format: { \"category\": \"...\", \"tip\": \"...\" }",
      config: {
        responseMimeType: "application/json"
      }
    });
    return JSON.parse(response.text || "{}");
  } catch (error) {
    return { category: "Lifestyle", tip: "Stay hydrated by drinking at least 8 glasses of water daily." };
  }
}
