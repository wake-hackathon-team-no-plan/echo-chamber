'use server'

import { geminiClient } from '../../lib/vertex-ai/gemini';

/**
 * 価値観テキストを生成するServer Action
 * @param input ユーザーの入力テキスト
 */
export async function generateValuesText(input: string): Promise<{ text: string } | { error: string }> {
  try {
    // 入力の検証
    if (!input || input.trim().length === 0) {
      return { error: '入力テキストを入力してください' };
    }

    // Gemini APIを呼び出し
    const generatedText = await geminiClient.generateText(input);
    return { text: generatedText };

  } catch (error) {
    console.error('Error in generateValuesText:', error);
    return { error: 'テキスト生成中にエラーが発生しました' };
  }
}