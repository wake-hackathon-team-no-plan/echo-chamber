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
import { generateMoviePrompt } from "@/app/actions/generate-movie-prompt-text";
import { generateMovie } from "../actions/generate-movie";

type GeneratePromptResponse = {
  prompt?: string;
  error?: string;
};

type GenerateMovieResponse = {
  videoUrl?: string;
  error?: string;
};

type GenerateKeywordsResponse = {
  keywords?: string[];
  perspective?: string;
  error?: string;
};

const generatePrompt = async (answers: SwipeAnswer[]) => {
  const selectedTheme = localStorage.getItem("selectedThemes");

  if (!selectedTheme) {
    throw new Error("テーマが選択されていません");
  }

  const result = await generateMoviePrompt(selectedTheme, answers);

  if ("error" in result) {
    throw new Error(result.error);
  }

  return result.movieGenerationPrompt;
};

const generateMovieContent = async (prompt: string): Promise<string> => {
  const result = await generateMovie(prompt);

  if ("error" in result) {
    throw new Error(result.error);
  }

  return result.videoPath;
};

const generateKeywords = async (answers: SwipeAnswer[]) => {
  const selectedTheme = localStorage.getItem("selectedThemes");

  if (!selectedTheme) {
    throw new Error("テーマが選択されていません");
  }

  const result = await generateResultsText(selectedTheme, answers);

  if ("error" in result) {
    throw new Error(result.error);
  }

  return { keywords: result.keywords, perspective: result.perspective };
};

export default function SwipePage() {
  const router = useRouter();
  const [showTutorial, setShowTutorial] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedAnswers, setSavedAnswers] = useState<SwipeAnswer[] | null>(null);

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
      setError(null);
      setSavedAnswers(answers);

      const oppositeAnswers = createOppositeAnswers(answers);

      const generateMovieProcess = async (answers: SwipeAnswer[]) => {
        const selectedTheme = localStorage.getItem("selectedThemes");

        if (!selectedTheme) {
          throw new Error("テーマが選択されていません");
        }

        const movieGenerationPrompt = await generatePrompt(answers);

        // 動画生成
        const videoPath = await generateMovieContent(movieGenerationPrompt);

        return videoPath;
      };

      const [
        userVideoURL,
        oppositeVideURL,
        userKeywordsResult,
        oppositeKeywordsResult,
      ] = await Promise.all([
        generateMovieProcess(answers),
        generateMovieProcess(oppositeAnswers),
        generateKeywords(answers),
        generateKeywords(oppositeAnswers),
      ]);

      // 結果を保存
      const results = {
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
      localStorage.setItem("results", JSON.stringify(results));

      router.push("/perspective");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "生成処理中にエラーが発生しました"
      );
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

      {/* エラーポップアップ */}
      {error && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          style={{ pointerEvents: "auto" }}
        >
          <div
            className="bg-white p-6 rounded shadow-md text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4">エラーが発生しました</h2>
            <p className="mb-4">{error}</p>
            <Button
              className="cursor-pointer"
              onClick={() => {
                console.log("リトライボタンがクリックされました");
                setError(null);
                // エラーステートをクリアしてから非同期で処理を開始
                setTimeout(() => {
                  if (savedAnswers) {
                    setIsGenerating(true);
                    handleComplete(savedAnswers);
                  }
                }, 100);
              }}
            >
              リトライ
            </Button>
          </div>
        </div>
      )}

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
