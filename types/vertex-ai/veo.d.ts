export interface VeoRequest {
  instances: [{
    prompt: string;
  }];
  parameters: {
    durationSeconds: number;
    aspectRatio?: string;
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
}