import { describe, it, expect, vi, beforeEach } from 'vitest';
import { processIntent } from '../services/geminiService';

vi.mock('@google/generative-ai', () => {
  return {
    GoogleGenerativeAI: class {
      getGenerativeModel() {
        return {
          generateContent: vi.fn().mockResolvedValue({
            response: {
              text: () => JSON.stringify({
                summary: "Test summary",
                emergencyLevel: "HIGH",
                urgent: true,
                classification: "MEDICAL",
                immediateActions: ["Call 911"],
                structuredData: { location: "Highway 1" }
              })
            }
          })
        };
      }
    }
  };
});

describe('Gemini Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should process input text and return structured JSON', async () => {
    // We mock the API key through process.env in setupTests if needed, 
    // but the file uses import.meta.env which Vite handles or Vitest polyfills.
    // For this test, our mock genAI handles the response.
    vi.stubEnv('VITE_GEMINI_API_KEY', 'test_key');

    const result = await processIntent('There is a crash on highway 1');

    expect(result).toBeDefined();
    expect(result.emergencyLevel).toBe('HIGH');
    expect(result.urgent).toBe(true);
    expect(result.immediateActions).toContain('Call 911');
    expect(result.structuredData.location).toBe('Highway 1');
  });

  it('should return error if no input provided', async () => {
    const result = await processIntent('');
    expect(result.error).toBe('No input provided.');
  });
});
