/**
 * IntentResolver Adapter Pattern
 * This allows the app to be model-agnostic. 
 * You can swap Gemini for any future LLM by creating a new adapter.
 */

import { processIntent as geminiResolver } from './geminiService';

/**
 * Supported AI Providers for the LifeBridge Hub.
 * @enum {string}
 */
export const PROVIDERS = {
  GEMINI: 'gemini'
};

/**
 * @param {string} text - Unstructured text input.
 * @param {string} imageBase64 - Optional image data.
 * @param {string} imageMimeType - Optional image mime type.
 */
export async function resolveIntent(provider, apiKey, text, imageBase64, imageMimeType) {
  switch (provider) {
    case PROVIDERS.GEMINI:
      return await geminiResolver(apiKey, text, imageBase64, imageMimeType);
    
    default:
      throw new Error(`Unsupported AI Provider: ${provider}`);
  }
}
