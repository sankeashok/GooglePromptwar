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

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    // Using verified gemini-2.0-flash model confirmed via probe
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

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
    let jsonText = response.text();
    
    // Clean up markdown if AI includes it
    jsonText = jsonText.replace(/^```json\s*/, '').replace(/```$/, '').trim();

    try {
      return JSON.parse(jsonText);
    } catch (parseErr) {
      console.warn("Failed to parse Gemini JSON output:", jsonText);
      return { 
        error: "Our AI systems could not confidently structure your intent. Please try adding more detail." 
      };
    }
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error(error.message || "Connection to Gemini failed.");
  }
}
