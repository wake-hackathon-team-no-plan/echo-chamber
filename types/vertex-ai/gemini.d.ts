/**
 * Gemini APIのリクエスト・レスポンス型定義
 */

export interface GeminiRequest {
  /** リクエストの内容 */
  contents: {
    role?: string;
    parts: {
      text: string;
    }[];
  }[];
  /** テキスト生成の設定 */
  generation_config?: {
    /** 生成の多様性（0.0-2.0） */
    temperature?: number;
    /** レスポンスのMIMEタイプ */
    responseMimeType?: string;
  };
}

export interface GeminiResponse {
  /** 生成結果の候補 */
  candidates: {
    content: {
      parts: {
        text: string;
      }[];
    };
  }[];
}