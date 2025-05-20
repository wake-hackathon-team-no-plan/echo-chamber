"use client"

import { useState, useEffect } from "react"
import type React from "react"
import { motion, useMotionValue, useTransform, useAnimation } from "framer-motion"

type CardProps = {
  content: string
  className?: string
  onDragEnd?: (event: any, info: { offset: { x: number, y: number } }) => void
}

export function Card({ content, className = "", onDragEnd }: CardProps) {
  // カードの状態を管理
  const [exiting, setExiting] = useState(false)
  
  // スワイプ時のインジケーターを追加
  const [direction, setDirection] = useState<"none" | "left" | "right">("none")
  
  // モーション値とアニメーションコントロール
  const x = useMotionValue(0)
  const controls = useAnimation()
  
  // xの値が変わったときにスワイプ方向を更新
  useEffect(() => {
    const unsubscribe = x.onChange((latest) => {
      if (latest > 20) {
        setDirection("right")
      } else if (latest < -20) {
        setDirection("left")
      } else {
        setDirection("none")
      }
    })
    return () => unsubscribe()
  }, [x])
  
  // スワイプに応じた回転効果
  const rotate = useTransform(x, [-300, 0, 300], [-10, 0, 10])
  
  // ドラッグ終了時の処理
  const handleDragEnd = async (event: any, info: { offset: { x: number, y: number } }) => {
    const threshold = Math.min(window.innerWidth * 0.2, 100) // 画面幅の20%か100pxの小さい方
    
    if (info.offset.x > threshold) {
      // 右スワイプが閾値を超えた場合
      if (onDragEnd) {
        // まず親コンポーネントに通知
        onDragEnd(event, info);
      }
      // スワイプ方向を設定
      setDirection("right")
      // その後アニメーションを実行
      await controls.start({ 
        x: window.innerWidth + 200, // 画面外右側まで移動
        rotate: 30, // 回転を強調
        transition: { duration: 0.5, ease: "easeOut" } // より長いアニメーション
      })
      setExiting(true);
    } else if (info.offset.x < -threshold) {
      // 左スワイプが閾値を超えた場合
      if (onDragEnd) {
        // まず親コンポーネントに通知
        onDragEnd(event, info);
      }
      // スワイプ方向を設定
      setDirection("left")
      // その後アニメーションを実行
      await controls.start({ 
        x: -window.innerWidth - 200, // 画面外左側まで移動
        rotate: -30, // 回転を強調
        transition: { duration: 0.5, ease: "easeOut" } // より長いアニメーション
      })
      setExiting(true);
    } else {
      // 閾値に達していない場合は元の位置に戻る
      controls.start({ x: 0, transition: { type: "spring", stiffness: 500, damping: 30 } })
    }
  }

  return (
    <motion.div
      className={`absolute top-0 left-0 right-0 w-full h-[300px] sm:h-[350px] md:h-[400px] bg-white rounded-2xl shadow-lg flex items-center justify-center p-4 sm:p-6 md:p-8 ${className}`}
      drag="x"
      dragConstraints={{ left: -500, right: 500 }}
      dragElastic={0.7}
      onDragEnd={handleDragEnd}
      animate={controls}
      style={{ x, rotate }}
      exit={exiting ? { opacity: 0 } : undefined}
    >
      <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
        {/* シンプルな背景色のオーバーレイ */}
        <div 
          className={`absolute inset-0 bg-red-200/40 transition-opacity duration-300 ${direction === "left" ? "opacity-100" : "opacity-0"}`}
        />
        <div 
          className={`absolute inset-0 bg-green-200/40 transition-opacity duration-300 ${direction === "right" ? "opacity-100" : "opacity-0"}`}
        />
      </div>
      {/* カードコンテンツ */}
      <p className="text-lg sm:text-xl md:text-2xl text-center font-bold px-2 z-20 relative max-w-[85%] mx-auto">{content}</p>
    </motion.div>
  )
}