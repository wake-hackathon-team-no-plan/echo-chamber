import { GeminiRequest, GeminiResponse } from '../../types/vertex-ai/gemini';
import path from 'path';
import { GoogleAuthProvider } from '../auth';

const PROJECT_ID = 'sekairoscope';
const LOCATION = 'us-central1';
const MODEL = 'gemini-1.5-flash-002';
const API_ENDPOINT = `https://${LOCATION}-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/${LOCATION}/publishers/google/models/${MODEL}:generateContent`;

/**
 * Gemini APIクライアント
 */
export class GeminiClient {
  constructor() {}

  /**
   * テキストを生成する
   */
  async generateText(prompt: string): Promise<string> {
    try {
      console.log('Authenticating with GCP...');
      const token = await GoogleAuthProvider.getAccessToken();
      console.log('Authentication successful');
      
      console.log('Calling Gemini API with endpoint:', API_ENDPOINT);
      const request: GeminiRequest = {
        contents: [{
          parts: [{ text: prompt }]
        }],
        generation_config: {
          temperature: 0.9,
          topP: 1,
          topK: 40,
          maxOutputTokens: 2048,
        }
      };

      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      const data: GeminiResponse = await response.json();
      return data.candidates[0].content.parts[0].text;

    } catch (error) {
      console.error('Error generating text:', error);
      throw new Error('テキスト生成に失敗しました');
    }
  }
}

// シングルトンインスタンスをエクスポート
export const geminiClient = new GeminiClient();