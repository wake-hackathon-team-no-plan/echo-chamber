'use server'

import { veoClient } from '../../lib/vertex-ai/veo';
import { VeoGenerationConfig } from '../../types/vertex-ai/veo';

/**
 * 動画を生成するServer Action
 */
export async function generateMovie(formData: FormData): Promise<{ videoPath: string } | { error: string }> {
  try {
    // プロンプトの取得と検証
    const prompt = formData.get('prompt') as string;
    if (!prompt || prompt.trim().length === 0) {
      return { error: 'プロンプトを入力してください' };
    }

    // オプションパラメータの取得
    const config: VeoGenerationConfig = {
      width: parseInt(formData.get('width') as string) || 1024,
      height: parseInt(formData.get('height') as string) || 576,
      video_length: parseFloat(formData.get('videoLength') as string) || 4.0,
      seed: parseInt(formData.get('seed') as string) || undefined,
      guidance_scale: parseFloat(formData.get('guidanceScale') as string) || 5.0,
      motion_bucket: parseInt(formData.get('motionBucket') as string) || 127
    };

    // Veo2 APIを呼び出し
    const videoPath = await veoClient.generateVideo(prompt, config);
    return { videoPath };

  } catch (error) {
    console.error('Error in generateMovie:', error);
    return { error: '動画生成中にエラーが発生しました' };
  }
}