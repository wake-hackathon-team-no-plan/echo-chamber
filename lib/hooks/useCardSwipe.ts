import { useState } from "react"
import type { Card } from "@/types/swipe"

// レスポンスの型定義
export type SwipeAnswer = {
  id: number
  content: string
  response: "like" | "dislike"
}

type UseCardSwipeProps = {
  cards: Card[]
  onComplete?: (answers: SwipeAnswer[]) => void
}

export function useCardSwipe({ cards, onComplete }: UseCardSwipeProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [swipeAnswers, setSwipeAnswers] = useState<SwipeAnswer[]>([])

  const handleSwipe = (direction: "left" | "right") => {
    if (currentIndex >= cards.length) return

    // 回答を記録
    const newAnswer: SwipeAnswer = {
      id: cards[currentIndex].id,
      content: cards[currentIndex].content,
      response: direction === "right" ? "like" : "dislike"
    }

    // 最後のカードの場合
    if (currentIndex + 1 >= cards.length) {
      // 最後の回答を含めた完全な回答リストを作成
      const finalAnswers = [...swipeAnswers, newAnswer]
      onComplete?.(finalAnswers)
    }

    setSwipeAnswers(prev => [...prev, newAnswer])
    setCurrentIndex(prev => prev + 1)
  }

  return {
    currentIndex,
    handleSwipe,
    swipeAnswers
  }
} 