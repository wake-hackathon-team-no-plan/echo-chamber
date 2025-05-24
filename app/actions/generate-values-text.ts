'use server'

import { geminiClient } from '../../lib/vertex-ai/gemini';
import * as fs from 'fs';
import * as path from 'path';
import { AppConfig } from '../../lib/app-config';
import { generateValuesPrompt } from './prompts/generate-values-prompt';

/**
 * 選択したテーマに基づいて価値観テキストを生成するServer Action
 * @param theme [必須] 選択されたテーマ
 * @param customPrompt [任意] カスタムプロンプト
 * @param temperature [任意] テキスト生成の温度（0.0～2.0）、デフォルト: 1.0
 * @returns 価値観テキストのリスト
 */
export async function generateValuesText(
  theme: string,
  customPrompt?: string,
  temperature: number = 1.0
): Promise<{ text: string[] } | { error: string }> {
  try {
    // 入力の検証
    if (!theme || theme.trim().length === 0) {
      return { error: '【価値観生成】テーマを指定してください' };
    }

    console.log(`【価値観生成】INPUT: テーマ="${theme}" `);
    
    // プロンプトの読み込みと変数置換
    let prompt;
    if (customPrompt) {
      prompt = customPrompt.replace(/\{theme\}/g, theme);
    } else {
      const promptTemplate = generateValuesPrompt;
      prompt = promptTemplate.replace(/\{theme\}/g, theme);
    }
      console.log(`【価値観生成】プロンプト: ${prompt}`);

    let responseText;    
    if (AppConfig.AI_STUB_MODE.VALUES_TEXT) {
      console.log('【価値観生成】スタブモード: 固定レスポンスを使用');
      responseText = JSON.stringify([
        "家族のために時間を作ることを大切にする",
        "家族一人一人の個性を尊重し、互いを理解し合う",
        "家族との対話を通じて、絆を深める",
        "家族で共に成長し、支え合える関係を築く",
        "家族の幸せを第一に考え、行動する"
      ]);
    } else {
      // Gemini APIを呼び出してテキスト生成
      responseText = await geminiClient.generateText(prompt, temperature);
    }
    console.log(`【価値観生成】OUTPUT: 生成テキスト: ${responseText}`);

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
    console.log(`【価値観生成】${values.length}件の価値観を生成`);
    
    return { text: values };


  } catch (error) {
    console.error(`【価値観生成】エラー発生: ${error}`);
    const errorMessage = error instanceof Error 
      ? `テキスト生成中にエラーが発生しました: ${error.message}` 
      : 'テキスト生成中に不明なエラーが発生しました';
    return { error: errorMessage };
  }
}