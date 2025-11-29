import { GoogleGenerativeAI } from '@google/generative-ai';
import { AI_PROMPTS } from '../constants';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'your_api_key_here';
const genAI = new GoogleGenerativeAI(API_KEY);

export interface ScamAnalysis {
  risk: 'low' | 'medium' | 'high';
  explanation: string;
  advice: string;
}

export interface SafetyTip {
  tip: string;
  category: string;
}

export interface VideoScript {
  title: string;
  script: string;
  duration: number;
}

export class GeminiService {
  private model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  async analyzeScam(imageData: string, text?: string): Promise<ScamAnalysis> {
    try {
      const prompt = `${AI_PROMPTS.scamAnalysis}\n\n${text ? `Text context: ${text}` : ''}`;

      const result = await this.model.generateContent([
        prompt,
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: imageData.split(',')[1] // Remove data:image/jpeg;base64, prefix
          }
        }
      ]);

      const response = result.response.text();

      // Parse the response (simplified parsing)
      const riskMatch = response.match(/risk level:?\s*(low|medium|high)/i);
      const risk = (riskMatch ? riskMatch[1].toLowerCase() : 'medium') as 'low' | 'medium' | 'high';

      return {
        risk,
        explanation: response.split('explanation:')[1]?.split('advice:')[0]?.trim() || response,
        advice: response.split('advice:')[1]?.trim() || 'Stay vigilant and report suspicious activity.'
      };
    } catch (error) {
      console.error('Gemini analysis failed:', error);
      return {
        risk: 'medium',
        explanation: 'Unable to analyze at this time.',
        advice: 'When in doubt, don\'t engage. Report to authorities if concerned.'
      };
    }
  }

  async generateSafetyTip(userProfile: { ageRange: string; interests: string[] }): Promise<SafetyTip> {
    try {
      const prompt = `${AI_PROMPTS.safetyTip}\n\nUser profile: Age ${userProfile.ageRange}, interests: ${userProfile.interests.join(', ')}`;

      const result = await this.model.generateContent(prompt);
      const response = result.response.text();

      return {
        tip: response,
        category: 'personalized'
      };
    } catch (error) {
      console.error('Safety tip generation failed:', error);
      return {
        tip: 'Always verify the identity of people you meet online before sharing personal information.',
        category: 'general'
      };
    }
  }

  async generateVideoScript(scenario: string): Promise<VideoScript> {
    try {
      const prompt = `${AI_PROMPTS.videoScenario}\n\nScenario: ${scenario}`;

      const result = await this.model.generateContent(prompt);
      const response = result.response.text();

      return {
        title: `Safety Scenario: ${scenario}`,
        script: response,
        duration: 45 // estimated
      };
    } catch (error) {
      console.error('Video script generation failed:', error);
      return {
        title: 'Safety Awareness Video',
        script: 'Video generation unavailable. Please try again later.',
        duration: 30
      };
    }
  }

  async generateThreatSummary(): Promise<string> {
    try {
      const result = await this.model.generateContent(AI_PROMPTS.threatSummary);
      return result.response.text();
    } catch (error) {
      console.error('Threat summary generation failed:', error);
      return 'Stay informed about current digital threats through reliable sources and local authorities.';
    }
  }
}

export const geminiService = new GeminiService();