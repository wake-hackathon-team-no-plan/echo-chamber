"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { motion } from "framer-motion"
import { X, Check } from "lucide-react"
import { useCardSwipe, type SwipeAnswer } from "@/lib/hooks/useCardSwipe"
import { useCards } from "@/lib/hooks/useCards"
import { CardStack } from "@/components/feature/swipe/CardStack"
import { TutorialPopup } from "@/components/feature/swipe/TutorialPopup"
import { LoadingOverlay } from "@/components/ui/loadingOverlay"

// TODO: Server Actionの型定義（仮）
type GeneratePromptResponse = {
  prompt: string
  error?: string
}

type GenerateMovieResponse = {
  videoUrl: string
  error?: string
}


const generatePrompt = async (answers: SwipeAnswer[]): Promise<GeneratePromptResponse> => {
  // スタブ実装
  console.log("answers", answers)
  await new Promise(resolve => setTimeout(resolve, 1000))
  return {
    prompt: "サンプルプロンプト：あなたの興味は環境問題と技術革新に集中しています..."
  }
}

const generateMovie = async (prompt: string): Promise<GenerateMovieResponse> => {
  // TODO
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
  await new Promise(resolve => setTimeout(resolve, 2000))
  return {
    videoUrl: "/videos/sample.mp4"
  }
}

export default function SwipePage() {
  const router = useRouter()
  const [showTutorial, setShowTutorial] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)

  // カードの取得
  const { cards } = useCards()

  // 完了時の処理
  const handleComplete = async (answers: SwipeAnswer[]) => {
    try {
      setIsGenerating(true)

      // 1. プロンプト生成
      const promptResult = await generatePrompt(answers)
      if (promptResult.error) throw new Error(promptResult.error)

      // 2. 動画生成
      const movieResult = await generateMovie(promptResult.prompt)
      if (movieResult.error) throw new Error(movieResult.error)

      // 3. 動画URLをローカルストレージに保存
      localStorage.setItem("generatedVideo", movieResult.videoUrl)

      // 4. 次の画面に遷移
      router.push("/perspective")
    } catch (error) {
      console.error("生成処理中にエラーが発生しました:", error)
    } finally {
      setIsGenerating(false)
    }
  }
  
  // スワイプの状態管理
  const { currentIndex, handleSwipe, swipeAnswers } = useCardSwipe({
    cards,
    onComplete: handleComplete
  })

  // 進行状況の計算
  const progress = cards.length > 0 ? (currentIndex / cards.length) * 100 : 0
  const isCompleted = currentIndex >= cards.length

  return (
    <div className="h-full bg-gray-100 overflow-y-auto">
      {/* ローディングオーバーレイ */}
      {isGenerating && (
        <LoadingOverlay message="AIが視点を生成中..." />
      )}

      {/* 操作説明（初回のみ） */}
      {showTutorial && (
        <TutorialPopup onClose={() => setShowTutorial(false)} />
      )}

      <section className="h-full py-4">
        <div className="container mx-auto px-4 max-w-screen-lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="section-title">あなたの考えを教えてください</h1>
            <p className="section-subtitle">各質問に対して、直感的に「共感・興味あり」か「興味なし」でお答えください</p>
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
  )
}
