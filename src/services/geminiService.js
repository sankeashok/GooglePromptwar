import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * @constant {string} systemInstruction
 * The core system prompt that transforms Gemini into the LifeBridge Intent Resolution Engine.
 */
const systemInstruction = `
You are 'LifeBridge', an advanced AI system acting as a universal bridge between messy human intent and complex response systems.
Your task is to take unstructured inputs and instantly convert them into structured, verified, and life-saving actions.

OUTPUT REQUIREMENTS:
You MUST return ONLY a valid JSON string.
The JSON must strictly conform to this schema:
{
  "summary": "A 1-2 sentence verified summary of the situation.",
  "emergencyLevel": "CRITICAL" | "HIGH" | "MEDIUM" | "LOW",
  "urgent": boolean,
  "classification": "MEDICAL" | "TRAFFIC" | "WEATHER" | "RESCUE" | "GENERAL",
  "immediateActions": [
    "Steps to take."
  ],
  "structuredData": {
    "location_name": "Name of the place if identified",
    "location_address": "Specific address if identified",
    "latitude": number | null,
    "longitude": number | null,
    "key": "value"
  }
}

GEOGRAPHICAL DATA:
If a location is identified, try to provide approximate latitude and longitude coordinates in the 'structuredData' field so we can trigger the tactical map. If unsure, set them to null.
`;


export async function processIntent(apiKey, text, imageBase64 = null, imageMimeType = null) {
  if (!apiKey) {
     throw new Error("API Key is missing. Please configure it in settings.");
  }

  if (!text && !imageBase64) {
      return { error: "No input provided." };
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    // Standardizing on 'gemini-1.5-flash' for maximum compatibility.
    // This model is widely available and provides excellent intent resolution.
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const parts = [
      { text: systemInstruction },
      { text: "USER INTENT:\n" + (text || "No text provided.") }
    ];

    if (imageBase64 && imageMimeType) {
       parts.push({
           inlineData: {
               data: imageBase64,
               mimeType: imageMimeType
           }
       });
    }
    
    const start = performance.now();
    const result = await model.generateContent(parts);
    const end = performance.now();
    console.log(`Gemini inference took ${(end - start).toFixed(2)}ms`);

    const response = await result.response;
    const jsonText = response.text();
    
    // Clean up markdown if AI includes it
    const cleanedJson = jsonText.replace(/```json|```/g, "").trim();
    return JSON.parse(cleanedJson);

  } catch (error) {
    const errorStr = String(error);
    const errorLower = errorStr.toLowerCase();
    console.error("Gemini Technical Error:", errorStr);
    
    // Handle Quota Exceeded (429)
    if (errorStr.includes("429") || errorLower.includes("quota")) {
      return { 
        error: "API QUOTA EXCEEDED: You have hit the Gemini free-tier rate limit (15 requests/min). Please wait 60 seconds and try again.",
        isQuotaError: true
      };
    }

    // Handle Leaked/Invalid/Blocked Key (403)
    if (errorLower.includes("leaked") || errorLower.includes("key") || errorStr.includes("403")) {
       return { 
         error: "CRITICAL: Current API key is invalid, leaked, or restricted. Please update VITE_GEMINI_API_KEY secret in GitHub.",
         isInvalidKey: true 
       };
    }
    
    // Handle Model Not Found (404)
    if (errorStr.includes("404") || errorLower.includes("not found")) {
      return { error: "CONFIGURATION ERROR: Model 'gemini-1.5-flash' not found. Please verify your project has access to this model." };
    }
    
    return { error: `AI Processing Failed: ${errorStr}` };
  }
}
