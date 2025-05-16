'use server'

import { geminiClient } from '../../lib/vertex-ai/gemini';
import * as fs from 'fs';
import * as path from 'path';

/**
 * 選択したテーマに基づいて価値観テキストを生成するServer Action
 * @param theme 選択されたテーマ (例: "教育", "家族", "旅行" など)
 * @returns 5つの価値観文を含む配列、またはエラー情報
 */
export async function generateValuesText(theme: string): Promise<{ text: string[] } | { error: string }> {
  try {
    // 入力の検証
    if (!theme || theme.trim().length === 0) {
      return { error: 'テーマを選択してください' };
    }

    console.log('Server Action: generateValuesText 開始');
    console.log('選択テーマ:', theme);
    
    // プロンプトの読み込み
    const promptPath = path.join(process.cwd(), 'app', 'actions', 'prompts', 'generate-values-text-prompt.txt');
    let promptTemplate = fs.readFileSync(promptPath, 'utf8');
    
    // プロンプト内のプレースホルダーを置換
    const prompt = promptTemplate.replace(/\{theme\}/g, theme);
    
    console.log('生成するプロンプト:', prompt);

    // Gemini APIを呼び出してテキスト生成
    const responseText = await geminiClient.generateText(prompt);
    console.log('生成テキスト取得:', responseText);

    let values: string[];

    try {
      // 応答テキストをJSONとしてパース
      values = JSON.parse(responseText) as string[];
      console.log('パース結果:', values);
    } catch (parseError) {
      console.error('JSONパースエラー:', parseError);
      return { error: '生成テキストの解析に失敗しました' };
    }

    // チェック処理
    if (!Array.isArray(values)) {
      console.error('不正な形式:', values);
      return { error: '価値観テキストの形式が不正です' };
    }
    if (values.length !== 5) {
      console.error('不正な価値観の数:', values);
      return { error: '適切な数の価値観を生成できませんでした' };
    }
    if (!values.every(value => typeof value === 'string')) {
      console.error('文字列以外の値が含まれています:', values);
      return { error: '生成テキストの形式が不正です' };
    }

    // すべての検証をパスした場合のみ成功レスポンスを返す
    return { text: values };


  } catch (error) {
    console.error('Error in generateValuesText:', error);
    const errorMessage = error instanceof Error 
      ? `テキスト生成中にエラーが発生しました: ${error.message}` 
      : 'テキスト生成中に不明なエラーが発生しました';
    return { error: errorMessage };
  }
}