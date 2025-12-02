import { describe, it, expect, vi, beforeEach } from 'vitest';
import { geminiService } from '../geminiService';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Mock the GoogleGenerativeAI module
vi.mock('@google/generative-ai');

describe('GeminiService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('analyzeScam', () => {
    it('should analyze image and return risk assessment', async () => {
      const mockModel = {
        generateContent: vi.fn().mockResolvedValue({
          response: {
            text: () => 'Risk level: high\nExplanation: This appears to be a scam.\nAdvice: Do not engage.'
          }
        })
      };

      // Mock the GoogleGenerativeAI instance
      (GoogleGenerativeAI as any).mockImplementation(() => ({
        getGenerativeModel: vi.fn().mockReturnValue(mockModel)
      }));

      const result = await geminiService.analyzeScam('data:image/jpeg;base64,test');

      expect(result).toEqual({
        risk: 'high',
        explanation: 'This appears to be a scam.',
        advice: 'Do not engage.'
      });
    });

    it('should handle analysis failure', async () => {
      const mockModel = {
        generateContent: vi.fn().mockRejectedValue(new Error('API Error'))
      };

      (GoogleGenerativeAI as any).mockImplementation(() => ({
        getGenerativeModel: vi.fn().mockReturnValue(mockModel)
      }));

      const result = await geminiService.analyzeScam('data:image/jpeg;base64,test');

      expect(result).toEqual({
        risk: 'medium',
        explanation: 'Unable to analyze at this time.',
        advice: 'When in doubt, don\'t engage. Report to authorities if concerned.'
      });
    });
  });

  describe('generateSafetyTip', () => {
    it('should generate personalized safety tip', async () => {
      const mockModel = {
        generateContent: vi.fn().mockResolvedValue({
          response: {
            text: () => 'Always verify online contacts.'
          }
        })
      };

      (GoogleGenerativeAI as any).mockImplementation(() => ({
        getGenerativeModel: vi.fn().mockReturnValue(mockModel)
      }));

      const result = await geminiService.generateSafetyTip({
        ageRange: '18-25',
        interests: ['social media']
      });

      expect(result).toEqual({
        tip: 'Always verify online contacts.',
        category: 'personalized'
      });
    });
  });

  describe('generateVideoScript', () => {
    it('should generate video script', async () => {
      const mockModel = {
        generateContent: vi.fn().mockResolvedValue({
          response: {
            text: () => 'Script content here.'
          }
        })
      };

      (GoogleGenerativeAI as any).mockImplementation(() => ({
        getGenerativeModel: vi.fn().mockReturnValue(mockModel)
      }));

      const result = await geminiService.generateVideoScript('Online Dating Safety');

      expect(result).toEqual({
        title: 'Safety Scenario: Online Dating Safety',
        script: 'Script content here.',
        duration: 45
      });
    });
  });
});