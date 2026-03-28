/**
 * IntentResolver Adapter Pattern
 * This allows the app to be model-agnostic. 
 * You can swap Gemini for any future LLM by creating a new adapter.
 */

import { processIntent as geminiProcess } from './geminiService';

export const PROVIDERS = {
  GEMINI: 'GEMINI',
  // Future providers can be added here (e.g., CLAUDE, OPENAI)
};

/**
 * Resolves messy intent using the selected AI provider.
 * @param {string} provider - The ID of the AI provider.
 * @param {string} apiKey - The user's API key.
 * @param {string} text - Unstructured text input.
 * @param {string} imageBase64 - Optional image data.
 * @param {string} imageMimeType - Optional image mime type.
 */
export async function resolveIntent(provider, apiKey, text, imageBase64, imageMimeType) {
  switch (provider) {
    case PROVIDERS.GEMINI:
      return await geminiProcess(apiKey, text, imageBase64, imageMimeType);
    
    default:
      throw new Error(`Unsupported AI Provider: ${provider}`);
  }
}
