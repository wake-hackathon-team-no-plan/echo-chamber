import { useState, useCallback } from "react"
import type { Card } from "@/types/swipe"

// レスポンスの型定義
export type SwipeAnswer = {
  viewpoint: string
  resonates: boolean
}

type UseCardSwipeProps = {
  cards: Card[]
  onComplete?: (answers: SwipeAnswer[]) => void
}

export function useCardSwipe({ cards, onComplete }: UseCardSwipeProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [swipeAnswers, setSwipeAnswers] = useState<SwipeAnswer[]>([])
  // スワイプ中かどうかのフラグ（連続スワイプ防止）
  const [isProcessingSwipe, setIsProcessingSwipe] = useState(false)

  const handleSwipe = useCallback((direction: "left" | "right") => {
    // すでに処理中なら何もしない
    if (isProcessingSwipe) return;
    // すべてのカードが終わっていたら何もしない
    if (currentIndex >= cards.length) return;

    // スワイプ処理中フラグを立てる
    setIsProcessingSwipe(true);

    // 現在のカード情報を取得
    const currentCard = cards[currentIndex];
    
    // 回答を記録し、カウントを増やす（すぐに実行）
    const newAnswer: SwipeAnswer = {
      viewpoint: currentCard.content,
      resonates: direction === "right"
    };
    setSwipeAnswers(prev => [...prev, newAnswer]);
    setCurrentIndex(prev => prev + 1);

    // 最後のカードの場合
    if (currentIndex + 1 >= cards.length) {
      // 最後の回答を含めた完全な回答リストを作成
      const finalAnswers = [...swipeAnswers, newAnswer];
      
      // アニメーション完了を待ってから号項徹底フラグを解除
      setTimeout(() => {
        onComplete?.(finalAnswers);
        setIsProcessingSwipe(false);
      }, 500); // 長めのアニメーションに合わせる
    } else {
      // 次のカードに進む前にアニメーションが完了するのを待つ
      setTimeout(() => {
        setIsProcessingSwipe(false);
      }, 500); // 長めのアニメーションに合わせる
    }
  }, [currentIndex, cards, swipeAnswers, onComplete, isProcessingSwipe]);

  return {
    currentIndex,
    handleSwipe,
    swipeAnswers,
    isProcessingSwipe
  }
} 