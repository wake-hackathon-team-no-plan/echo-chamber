"use client"

import type React from "react"
import { Card } from "./Card"
import type { Card as CardType } from "@/types/swipe"
import { AnimatePresence } from "framer-motion"

type CardStackProps = {
  cards: CardType[]
  currentIndex: number
  onSwipe: (direction: "left" | "right") => void
  isProcessingSwipe?: boolean
}

export function CardStack({ cards, currentIndex, onSwipe, isProcessingSwipe = false }: CardStackProps) {
  // デバッグ用ログ
  // console.log(`CardStack render: currentIndex=${currentIndex}, cards.length=${cards.length}`);
  
  // 表示するカード - 現在のインデックスから最後まで全て
  const remainingCards = cards.slice(currentIndex);
  
  // ドラッグ終了時の処理
  const handleDragEnd = (event: any, info: { offset: { x: number, y: number } }) => {
    // 処理中なら何もしない
    if (isProcessingSwipe) return
    
    // 閾値は画面幅の20%か100pxの小さい方
    const threshold = Math.min(window.innerWidth * 0.2, 100)
    console.log(`ドラッグ終了: offset.x = ${info.offset.x}, threshold = ${threshold}`);
    
    if (info.offset.x > threshold) {
      console.log('右スワイプ検出')
      onSwipe("right")
    } else if (info.offset.x < -threshold) {
      console.log('左スワイプ検出')
      onSwipe("left")
    }
  }

  // カードがない場合の表示
  if (remainingCards.length === 0) {
    return (
      <div className="w-full h-[300px] sm:h-[350px] md:h-[400px] flex items-center justify-center">
        {/* 空の表示コンテナ - メッセージなし */}
      </div>
    )
  }

  return (
    <div className="relative w-full h-[300px] sm:h-[350px] md:h-[400px]">
      <AnimatePresence>
        {remainingCards.map((card, index) => {
          // カードの空間的配置とスケールを調整
          const zIndex = 30 - index;
          const scale = Math.max(1 - index * 0.05, 0.8); // 各カードのスケールを少しずつ小さく
          const top = index * 5; // 上から少しずつズラす
          
          return (
            <div 
              key={card.id} 
              className={`absolute w-full transform-gpu`}
              style={{
                zIndex,
                transform: `translateY(${top}px) scale(${scale})`,
                opacity: Math.max(1 - index * 0.2, 0.5) // 後ろのカードほど透明に
              }}
            >
              <Card 
                content={card.content} 
                onDragEnd={index === 0 ? handleDragEnd : undefined}
              />
            </div>
          )
        })}
      </AnimatePresence>
    </div>
  )
} 