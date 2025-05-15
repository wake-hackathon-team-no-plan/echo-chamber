/**
 * Gemini APIのリクエスト・レスポンス型定義
 */

export interface GeminiRequestConfig {
  /** テキスト生成の設定 */
  generation_config?: {
    /** 生成の多様性（0.0-1.0） */
    temperature?: number;
    /** 上位確率でのサンプリング（0.0-1.0） */
    topP?: number;
    /** 上位k個の候補から選択 */
    topK?: number;
    /** 最大出力トークン数 */
    maxOutputTokens?: number;
  };
}

export interface GeminiRequest extends GeminiRequestConfig {
  /** リクエストの内容 */
  contents: {
    parts: {
      text: string;
    }[];
  }[];
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