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

    console.log('Server Action: generateValuesText 開始');
    console.log('入力テキスト:', input);
    
    // Gemini APIを呼び出し
    const generatedText = await geminiClient.generateText(input);
    console.log('生成テキスト取得成功:', generatedText.substring(0, 50) + '...');
    return { text: generatedText };

  } catch (error) {
    console.error('Error in generateValuesText:', error);
    // エラーメッセージをより具体的に
    const errorMessage = error instanceof Error 
      ? `テキスト生成中にエラーが発生しました: ${error.message}` 
      : 'テキスト生成中に不明なエラーが発生しました';
    return { error: errorMessage };
  }
}