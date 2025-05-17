'use server'

import { geminiClient } from '../../lib/vertex-ai/gemini';
import * as fs from 'fs';
import * as path from 'path';

/**
 * 選択したテーマに基づいて価値観テキストを生成するServer Action
 * @param theme [必須] 選択されたテーマ
 * @returns 価値観テキストの配列、またはエラー情報
 */
export async function generateValuesText(
  theme: string,
  customPrompt?: string,
  temperature: number = 1.0
): Promise<{ text: string[] } | { error: string }> {
  try {
    // 入力の検証
    if (!theme || theme.trim().length === 0) {
      return { error: 'テーマを選択してください' };
    }

    console.log(`【価値観生成】INPUT: テーマ="${theme}" `);
    
    // プロンプトの読み込み
    // プロンプトの処理
    let prompt;
    if (customPrompt) {
      prompt = customPrompt.replace(/\{theme\}/g, theme);
    } else {
      const promptPath = path.join(process.cwd(), 'app', 'actions', 'prompts', 'generate-values-text-prompt.txt');
      let promptTemplate = fs.readFileSync(promptPath, 'utf8');
      prompt = promptTemplate.replace(/\{theme\}/g, theme);
    }
    
    console.log(`【価値観生成】プロンプト: ${prompt}`);

    // スタブモードに切り替え
    geminiClient.setUseStub(true);

    // Gemini APIを呼び出してテキスト生成
    const responseText = await geminiClient.generateText(prompt, temperature);
    console.log(`【価値観生成】生成テキスト: ${responseText}`);

    let values: string[];

    try {
      // 応答テキストをJSONとしてパース
      values = JSON.parse(responseText) as string[];
    } catch (parseError) {
      console.error(`【価値観生成】JSONパースエラー: ${parseError}`);
      return { error: '生成テキストの解析に失敗しました' };
    }

    // チェック処理
    if (!Array.isArray(values)) {
      console.error(`【価値観生成】不正な形式: ${JSON.stringify(values)}`);
      return { error: '価値観テキストの形式が不正です' };
    }
    if (values.length < 1) {
      console.error(`【価値観生成】価値観が生成されていません: ${JSON.stringify(values)}`);
      return { error: '価値観を生成できませんでした' };
    }
    if (!values.every(value => typeof value === 'string')) {
      console.error(`【価値観生成】文字列以外の値が含まれています: ${JSON.stringify(values)}`);
      return { error: '生成テキストの形式が不正です' };
    }

    console.log(`【価値観生成】OUTPUT: ${values.length}件の価値観を生成`);
    
    // すべての検証をパスした場合のみ成功レスポンスを返す
    return { text: values };


  } catch (error) {
    console.error(`【価値観生成】エラー発生: ${error}`);
    const errorMessage = error instanceof Error 
      ? `テキスト生成中にエラーが発生しました: ${error.message}` 
      : 'テキスト生成中に不明なエラーが発生しました';
    return { error: errorMessage };
  }
}