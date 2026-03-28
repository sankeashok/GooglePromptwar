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
    const result = await processIntent('dummy_key', 'There is a crash on highway 1');

    expect(result).toBeDefined();
    expect(result.emergencyLevel).toBe('HIGH');
    expect(result.urgent).toBe(true);
    expect(result.immediateActions).toContain('Call 911');
    expect(result.structuredData.location).toBe('Highway 1');
  });

  it('should return error if no input provided', async () => {
    const result = await processIntent('dummy_key', '');
    expect(result.error).toBe('No input provided.');
  });
});
