// app/actions/generate-perspective.ts
'use server'

import { generateMoviePrompt } from './generate-movie-prompt-text';
import { generateMovie } from './generate-movie';
import { generateResultsText } from './generate-results-text';
import type { SwipeAnswer } from '@/lib/hooks/useCardSwipe';

type GeneratePerspectiveResponse = {
  user: {
    keywords: string[];
    perspective: string;
    videoUrl: string;
  };
  opposite: {
    keywords: string[];
    perspective: string;
    videoUrl: string;
  };
};

export async function generatePerspective(
  theme: string,
  answers: SwipeAnswer[]
): Promise<GeneratePerspectiveResponse | { error: string }> {
  try {
    // 反対の回答を作成
    const oppositeAnswers = answers.map(a => ({ ...a, resonates: !a.resonates }));

    // 映画生成プロセスの定義
    const generateMovieProcess = async (answers: SwipeAnswer[]) => {
      // 映画生成のプロンプトを取得
      const promptResult = await generateMoviePrompt(theme, answers);
      
      if ('error' in promptResult) {
        throw new Error(promptResult.error);
      }
      
      // 動画生成
      const videoResult = await generateMovie(promptResult.movieGenerationPrompt);
      
      if ('error' in videoResult) {
        throw new Error(videoResult.error);
      }
      
      return videoResult.videoPath;
    };

    // すべての処理を並列化
    const [
      userVideoURL,
      oppositeVideURL,
      userKeywordsResult,
      oppositeKeywordsResult,
    ] = await Promise.all([
      generateMovieProcess(answers),
      generateMovieProcess(oppositeAnswers),
      generateResultsText(theme, answers),
      generateResultsText(theme, oppositeAnswers),
    ]);

    // エラーチェック（キーワード結果）
    if ('error' in userKeywordsResult) {
      throw new Error(userKeywordsResult.error);
    }
    if ('error' in oppositeKeywordsResult) {
      throw new Error(oppositeKeywordsResult.error);
    }

    // 結果を返す
    return {
      user: {
        keywords: userKeywordsResult.keywords,
        perspective: userKeywordsResult.perspective,
        videoUrl: userVideoURL
      },
      opposite: {
        keywords: oppositeKeywordsResult.keywords,
        perspective: oppositeKeywordsResult.perspective,
        videoUrl: oppositeVideURL
      }
    };
  } catch (error) {
    console.error(`【視点生成】エラー発生: ${error}`);
    return {
      error: error instanceof Error 
        ? `視点生成中にエラーが発生しました: ${error.message}` 
        : '視点生成中に不明なエラーが発生しました'
    };
  }
}