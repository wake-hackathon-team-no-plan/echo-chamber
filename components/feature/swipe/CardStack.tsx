"use client"

import type React from "react"
import { Card } from "./Card"
import type { Card as CardType } from "@/types/swipe"

type CardStackProps = {
  cards: CardType[]
  currentIndex: number
  onSwipe: (direction: "left" | "right") => void
}

export function CardStack({ cards, currentIndex, onSwipe }: CardStackProps) {
  // ドラッグ終了時の処理
  const handleDragEnd = (event: any, info: { offset: { x: number, y: number } }) => {
    const threshold = window.innerWidth * 0.3
    if (info.offset.x > threshold) {
      onSwipe("right")
    } else if (info.offset.x < -threshold) {
      onSwipe("left")
    }
  }

  return (
    <div className="relative w-full h-[300px] sm:h-[350px] md:h-[400px]">
      {cards.map((card, index) => (
        <div 
          key={card.id} 
          className={`z-${10 - Math.abs(index - currentIndex)}`}
        >
          <Card 
            content={card.content} 
            onDragEnd={handleDragEnd}
          />
        </div>
      ))}
    </div>
  )
} 