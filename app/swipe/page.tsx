"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { X, Check } from "lucide-react";
import { useCardSwipe, type SwipeAnswer } from "@/lib/hooks/useCardSwipe";
import { useCards } from "@/lib/hooks/useCards";
import { CardStack } from "@/components/feature/swipe/CardStack";
import { TutorialPopup } from "@/components/feature/swipe/TutorialPopup";
import { LoadingOverlay } from "@/components/ui/loadingOverlay";
import { generateResultsText } from "@/app/actions/generate-results-text";

// TODO: Server Actionの型定義（仮）
type GeneratePromptResponse = {
  prompt?: string;
  error?: string;
};

type GenerateMovieResponse = {
  videoUrl: string;
  error?: string;
};

type GenerateKeywordsResponse = {
  keywords: string[];
  perspective: string;
  error?: string;
};

const generatePrompt = async (
  answers: SwipeAnswer[]
): Promise<GeneratePromptResponse> => {
  const selectedTheme = localStorage.getItem("selectedThemes");

  if (!selectedTheme) {
    return { error: "テーマが選択されていません" };
  }

  // TODO ここでプロンプト生成用のサーバーアクションを呼ぶ
  // try {
  //   const result = await generateResultsText(selectedTheme, answers);
  //   if ("error" in result) {
  //     return { error: result.error };
  //   }
  //   return { prompt: result.prompt };
  // } catch (error) {
  //   return {
  //     error:
  //       error instanceof Error ? error.message : "プロンプト生成に失敗しました",
  //   };
  // }

  // スタブ実装
  console.log("answers", answers)
  await new Promise(resolve => setTimeout(resolve, 1000))
  return {
    prompt: "サンプルプロンプト：あなたの興味は環境問題と技術革新に集中しています..."
  }

};

const generateMovie = async (
  prompt: string
): Promise<GenerateMovieResponse> => {
  // TODO ここで動画生成用のサーバーアクションを呼ぶ
  /*
  try {
    const result = await veoClient.generateVideo(prompt)
    return {
      videoUrl: result.videoPath
    }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : '動画生成に失敗しました'
    }
  }
  */

  // スタブ実装
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return {
    videoUrl: "/videos/sample.mp4",
  };
};

const generateKeywords = async (answers: SwipeAnswer[]): Promise<GenerateKeywordsResponse> => {
  const selectedTheme = localStorage.getItem("selectedThemes");

  if (!selectedTheme) {
    return { keywords: [], perspective: "", error: "テーマが選択されていません" };
  }

  // try {
  //   // TODO ここでキーワードと価値観生成用のサーバーアクションを呼ぶ
  //   const result = await generateResultsText(selectedTheme, answers);
  //   if ("error" in result) {
  //     return { keywords: [], perspective: "", error: result.error };
  //   }
  //   return { keywords: result.keywords, perspective: result.perspective };
  // } catch (error) {
  //   return {
  //     keywords: [],
  //     perspective: "",
  //     error: error instanceof Error ? error.message : "プロンプト生成に失敗しました",
  //   };
  // }

  // スタブ実装
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return { keywords: ["keyword1", "keyword2"], perspective: "somePerspective" };
}

export default function SwipePage() {
  const router = useRouter();
  const [showTutorial, setShowTutorial] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  // カードの取得
  const { cards } = useCards();

  const createOppositeAnswers = (answers: SwipeAnswer[]): SwipeAnswer[] => {
    return answers.map((answer) => ({
      ...answer,
      resonates: !answer.resonates,
    }));
  };

  const handleComplete = async (answers: SwipeAnswer[]) => {
    try {
      setIsGenerating(true);
      const oppositeAnswers = createOppositeAnswers(answers);

      const generateVideoProcess = async (
        answers: SwipeAnswer[]
      ) => {

        // プロンプト生成
        const promptResult = await generatePrompt(answers);
        if (promptResult.error || !promptResult.prompt)
          throw new Error(
            promptResult.error || "プロンプトの生成に失敗しました"
          );

        // 動画生成
        const movieResult = await generateMovie(promptResult.prompt);
        if (movieResult.error) throw new Error(movieResult.error);

        return movieResult.videoUrl;
      };

      const [userVideoURL, oppositeVideURL, userKeywordsResult, oppositeKeywordsResult] = await Promise.all([
        generateVideoProcess(answers),
        generateVideoProcess(oppositeAnswers),
        generateKeywords(answers),
        generateKeywords(oppositeAnswers)
      ]);

      // 自分の価値観
      // localStorage.setItem("userVideoPath", userVideoURL);
      // TODO テストようなので後で消す
      localStorage.setItem("userVideoPath", "/videos/sample.mp4")
      localStorage.setItem("userKeywords:", JSON.stringify(userKeywordsResult.keywords));
      localStorage.setItem("userPerspective:", userKeywordsResult.perspective);

      // 他人の価値観
      // localStorage.setItem("oppositeVideoPath", oppositeVideURL);
      // TODO テストようなので後で消す
      localStorage.setItem("oppositeVideoPath", "/videos/sampleOpposite.mp4")
      localStorage.setItem("oppositeKeywords:", JSON.stringify(oppositeKeywordsResult.keywords));
      localStorage.setItem("oppositePerspective:", oppositeKeywordsResult.perspective);

      router.push("/perspective");
      
    } catch (error) {
      console.error("生成処理中にエラーが発生しました:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  // スワイプの状態管理
  const { currentIndex, handleSwipe } = useCardSwipe({
    cards,
    onComplete: handleComplete,
  });

  // 進行状況の計算
  const progress = cards.length > 0 ? (currentIndex / cards.length) * 100 : 0;
  const isCompleted = currentIndex >= cards.length;

  return (
    <div className="h-full bg-gray-100 overflow-y-auto">
      {/* ローディングオーバーレイ */}
      {isGenerating && <LoadingOverlay message="AIが視点を生成中..." />}

      {/* 操作説明（初回のみ） */}
      {showTutorial && <TutorialPopup onClose={() => setShowTutorial(false)} />}

      <section className="h-full py-4">
        <div className="container mx-auto px-4 max-w-screen-lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="section-title">あなたの考えを教えてください</h1>
            <p className="section-subtitle">
              各質問に対して、直感的に「共感・興味あり」か「興味なし」でお答えください
            </p>
          </motion.div>

          {/* 進捗バーと残りカード数表示 */}
          <div className="max-w-2xl mx-auto mb-8">
            <Progress value={progress} className="h-2 mb-2" />
            <p className="text-right text-sm text-gray-500">
              {currentIndex}/{cards.length}
            </p>
          </div>

          {/* カード表示エリア */}
          <div className="w-full max-w-sm sm:max-w-md md:max-w-2xl mx-auto mb-6 sm:mb-8 md:mb-12 px-2 sm:px-4">
            <CardStack
              cards={cards}
              currentIndex={currentIndex}
              onSwipe={handleSwipe}
            />
          </div>

          {/* スワイプボタン */}
          <div className="flex justify-center gap-8 mb-8">
            <Button
              variant="outline"
              size="lg"
              className="rounded-full w-16 h-16 p-0 border-2 border-[#ff6347] text-[#ff6347] hover:bg-[#ff6347]/10"
              onClick={() => handleSwipe("left")}
              disabled={isCompleted || isGenerating}
            >
              <X size={32} />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="rounded-full w-16 h-16 p-0 border-2 border-[#00c896] text-[#00c896] hover:bg-[#00c896]/10"
              onClick={() => handleSwipe("right")}
              disabled={isCompleted || isGenerating}
            >
              <Check size={32} />
            </Button>
          </div>

          {/* スキップボタン */}
          <div className="text-center">
            <Button
              variant="ghost"
              className="text-gray-500 hover:text-gray-700"
              onClick={() => router.push("/perspective")}
              disabled={isGenerating}
            >
              スキップして次へ進む
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
