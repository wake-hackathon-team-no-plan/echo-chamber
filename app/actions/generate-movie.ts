'use server'

import { veoClient } from '../../lib/vertex-ai/veo';

/**
 * 動画を生成するServer Action
 * @param prompt [必須] 動画生成のプロンプト
 * @param durationSeconds [任意] 動画の長さ（秒、5～8秒）、デフォルト: 5秒
 * @param aspectRatio [任意] アスペクト比（16:9または9:16）、デフォルト: 16:9
 * @returns 動画のパスまたはエラー情報
 */
export async function generateMovie(
  prompt: string,
  durationSeconds: number = 5.0,
  aspectRatio: "16:9" | "9:16" = "16:9"
): Promise<{ videoPath: string } | { error: string }> {
  try {
    // プロンプトの検証
    if (!prompt || prompt.trim().length === 0) {
      return { error: 'プロンプトを入力してください' };
    }

    console.log(`【動画生成】INPUT: プロンプト="${prompt}"`);

    // スタブモードの切り替え
    veoClient.setUseStub(true);

    // Veo2 APIを呼び出し
    const videoPath = await veoClient.generateVideo(prompt, durationSeconds, aspectRatio);
    console.log(`【動画生成】OUTPUT: 動画生成完了 - ${videoPath}`);

    return { videoPath };

  } catch (error) {
    console.error(`【動画生成】ERROR: ${error instanceof Error ? error.message : '不明なエラー'}`);
    const errorMessage = error instanceof Error
      ? `動画生成中にエラーが発生しました: ${error.message}`
      : '動画生成中に不明なエラーが発生しました';
    return { error: errorMessage };
  }
}