import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * @constant {string} systemInstruction
 * The core system prompt that transforms Gemini into the LifeBridge Intent Resolution Engine.
 * Forces zero-hallucination JSON extraction of life-saving data.
 */
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
    "key": "value (extract any relevant entities like location, patient info, hazards, etc. IMPORTANT: If a location is found, include 'latitude' and 'longitude' if you can estimate or resolve them accurately into decimals.)"
  }
}
`;

export async function processIntent(apiKey, text, imageBase64 = null, imageMimeType = null) {
  if (!apiKey) {
     throw new Error("API Key is missing. Please configure it in settings.");
  }

  const genAI = new GoogleGenerativeAI(apiKey);

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: systemInstruction,
      generationConfig: {
        responseMimeType: "application/json"
      }
    });

    const parts = [];
    if (text) {
      parts.push({ text: "USER INTENT:\n" + text });
    }

    if (imageBase64 && imageMimeType) {
       parts.push({
           inlineData: {
               data: imageBase64,
               mimeType: imageMimeType
           }
       });
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
    let jsonText = response.text();
    
    // Sometimes Gemini wraps JSON in backticks even with responseMimeType set
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
    // Return the specific api error if it exists
    throw new Error(error.message || "Connection to Gemini failed. Please verify your API Key and internet connection.");
  }
}
