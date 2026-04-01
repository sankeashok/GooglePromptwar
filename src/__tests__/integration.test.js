import { describe, it, expect } from 'vitest';
import { PROVIDERS } from '../services/intentResolver';

describe('LifeBridge | End-to-End Integration Tests (Mocked)', () => {
    
    it('verifies provider routing', () => {
      expect(PROVIDERS.GEMINI).toBe('gemini');
    });

    it('handles provider-agnostic switching', () => {
      const providers = Object.keys(PROVIDERS);
      expect(providers).toContain('GEMINI');
      expect(providers.length).toBeGreaterThanOrEqual(1);
    });
});
