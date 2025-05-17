'use server'

import { geminiClient } from '../../lib/vertex-ai/gemini';
import * as fs from 'fs';
import * as path from 'path';

/**
 * ユーザーの価値観の型定義
 */
export type Viewpoint = {
  viewpoint: string;
  resonates: boolean;
};

/**
 * テーマとユーザー価値観に基づいて3D動画生成用プロンプトを生成するServer Action
 * @param theme 選択されたテーマ (例: "教育", "家族", "旅行" など)
 * @param viewpoints ユーザーが共感するかしないかの価値観リスト
 * @returns 生成されたプロンプト、またはエラー情報
 */
export async function generateResultsText(
  theme: string,
  viewpoints: Viewpoint[],
  customPrompt?: string,
  temperature: number = 0.7
): Promise<{ prompt: string } | { error: string }> {
  try {
    // 入力の検証
    if (!theme || theme.trim().length === 0) {
      return { error: 'テーマを選択してください' };
    }

    if (!viewpoints || viewpoints.length === 0) {
      return { error: '価値観が選択されていません' };
    }

    console.log('Server Action: generateResultsText 開始');
    console.log('選択テーマ:', theme);
    console.log('価値観:', viewpoints);
    
    // プロンプトの読み込みと変数置換
    let prompt;
    if (customPrompt) {
      prompt = customPrompt
        .replace(/\{theme\}/g, theme)
        .replace(/\{viewpoints\}/g, JSON.stringify(viewpoints, null, 2));
    } else {
      const promptPath = path.join(process.cwd(), 'app', 'actions', 'prompts', 'generate-results-text-prompt.txt');
      let promptTemplate = fs.readFileSync(promptPath, 'utf8');
      prompt = promptTemplate
        .replace(/\{theme\}/g, theme)
        .replace(/\{viewpoints\}/g, JSON.stringify(viewpoints, null, 2));
    }
    
    console.log('生成するプロンプト:', prompt);

    // スタブモードに切り替え
    geminiClient.setUseStub(true);

    // Gemini APIを呼び出してプロンプト生成
    const responseText = await geminiClient.generateText(prompt, { temperature });
    console.log('生成テキスト取得:', responseText);

    let resultJson: { prompt: string };

    try {
      // 応答テキストをJSONとしてパース
      // プロンプトが "["で始まり"]"で終わる場合、JSONを抽出して処理
      let jsonText = responseText;
      if (responseText.trim().startsWith('[') && responseText.trim().endsWith(']')) {
        jsonText = responseText.trim();
      }
      
      resultJson = JSON.parse(jsonText) as { prompt: string };
      console.log('パース結果:', resultJson);
    } catch (parseError) {
      console.error('JSONパースエラー:', parseError);
      return { error: '生成テキストの解析に失敗しました' };
    }

    // チェック処理
    if (!resultJson.prompt || typeof resultJson.prompt !== 'string') {
      console.error('不正な形式:', resultJson);
      return { error: '生成プロンプトの形式が不正です' };
    }

    if (resultJson.prompt.trim().length === 0) {
      console.error('空のプロンプトが生成されました');
      return { error: 'プロンプトを生成できませんでした' };
    }

    // すべての検証をパスした場合のみ成功レスポンスを返す
    return { prompt: resultJson.prompt };

  } catch (error) {
    console.error('Error in generateResultsText:', error);
    const errorMessage = error instanceof Error 
      ? `プロンプト生成中にエラーが発生しました: ${error.message}` 
      : 'プロンプト生成中に不明なエラーが発生しました';
    return { error: errorMessage };
  }
}
