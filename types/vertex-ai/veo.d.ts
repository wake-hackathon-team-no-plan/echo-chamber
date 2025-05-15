export interface VeoGenerationConfig {
  width?: number;
  height?: number;
  video_length?: number;
  seed?: number;
  guidance_scale?: number;
  motion_bucket?: number;
}

export interface VeoRequest {
  instances: [{
    prompt: string;
    negative_prompt?: string;
  }];
  parameters: {
    negativePrompt?: string;
    seed?: number;
    durationSeconds?: number;
    aspectRatio?: string;
    enhancePrompt?: boolean;
  };
}

export interface VeoResponse {
  name: string;  // 長時間実行オペレーション名
}

export interface VeoOperationResponse {
  done: boolean;
  response?: {
    videos?: {
      bytesBase64Encoded?: string;
    }[];
  };
  error?: {
    code?: number;
    message?: string;
  };
  metadata?: {
    progressPercentage?: number;
  };
}