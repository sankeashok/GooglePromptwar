import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  console.warn("VITE_GEMINI_API_KEY is missing. Please set it in your .env file.");
}

const genAI = new GoogleGenerativeAI(API_KEY || "dummy_key");

const systemInstruction = `
You are 'LifeBridge', an advanced AI system acting as a universal bridge between messy human intent and complex response systems.
Your task is to take unstructured inputs (like voice transcripts, weather records, news, medical history, or accident scene descriptions) and instantly convert them into structured, verified, and life-saving actions.

OUTPUT REQUIREMENTS:
You MUST return ONLY a valid JSON string without any markdown formatting, backticks, or extra text.
The JSON must strictly conform to this schema:
{
  "summary": "A 1-2 sentence verified summary of the situation.",
  "emergencyLevel": "CRITICAL" | "HIGH" | "MEDIUM" | "LOW",
  "urgent": boolean (true if immediate life-saving action is required),
  "classification": "MEDICAL" | "TRAFFIC" | "WEATHER" | "RESCUE" | "GENERAL" | etc,
  "immediateActions": [
    "Array of clear, life-saving or urgent steps to take immediately."
  ],
  "structuredData": {
    "key": "value (extract any relevant entities like location, patient info, hazards, etc.)"
  }
}
`;

export async function processIntent(text, imageBase64 = null, imageMimeType = null) {
  if (!API_KEY) {
     throw new Error("Gemini API Key is missing. Please add VITE_GEMINI_API_KEY to your .env file.");
  }

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: systemInstruction,
      generationConfig: {
        responseMimeType: "application/json",
      }
    });

    const parts = [];
    if (text) {
      parts.push({ text });
    }

    if (imageBase64 && imageMimeType) {
       parts.push({
           inlineData: {
               data: imageBase64,
               mimeType: imageMimeType
           }
       })
    }
    
    // Fallback if empty
    if (parts.length === 0) {
      return { error: "No input provided." };
    }

    const start = performance.now();
    const result = await model.generateContent(parts);
    const end = performance.now();
    console.log(`Gemini inference took ${(end - start).toFixed(2)}ms`);

    const response = await result.response;
    const jsonText = response.text();
    
    return JSON.parse(jsonText);
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw error;
  }
}
