"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Play, Pause, Volume2, VolumeX } from "lucide-react"

interface VideoPlayerProps {
  videoUrl: string
  theme?: "light" | "dark"
}

export default function VideoPlayer({ videoUrl, theme = "light" }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [progress, setProgress] = useState(0)

  // 実際の実装ではvideoUrlを使用して動画を再生
  // このデモではプレースホルダー画像を表示
  useEffect(() => {
    // 動画読み込みをシミュレート
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  const togglePlay = () => {
    setIsPlaying(!isPlaying)

    // 実際の実装では動画の再生/一時停止を制御
    if (!isPlaying) {
      // 再生開始時にプログレスバーのアニメーションを開始
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            setIsPlaying(false)
            return 0
          }
          return prev + 1
        })
      }, 100)
    }
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
    // 実際の実装では動画のミュート/ミュート解除を制御
  }

  // テーマに応じたスタイル
  const bgGradient =
    theme === "light" ? "bg-gradient-to-br from-gray-800 to-gray-900" : "bg-gradient-to-br from-gray-900 to-black"

  const textColor = "text-white"
  const spinnerColor = theme === "light" ? "border-white" : "border-[#00c896]"

  return (
    <div className="relative w-full aspect-video bg-black">
      {isLoading ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`w-12 h-12 border-4 ${spinnerColor} border-t-transparent rounded-full animate-spin`}></div>
        </div>
      ) : (
        <>
          {/* プレースホルダー画像 - 実際の実装では動画要素を使用 */}
          <div className={`w-full h-full ${bgGradient} flex items-center justify-center`}>
            <div className={`${textColor} text-center p-4`}>
              <h3 className="text-2xl font-bold mb-2">
                {theme === "light" ? "あなたの思考傾向の映像化" : "異なる視点からの映像表現"}
              </h3>
              <p className="mb-4">
                {theme === "light" ? "あなたの選択から生成された視覚的表現" : "あなたとは異なる視点から見た世界の表現"}
              </p>
              {isPlaying && (
                <div className="flex items-center justify-center space-x-2">
                  <span className="animate-pulse">●</span>
                  <span className="animate-pulse delay-100">●</span>
                  <span className="animate-pulse delay-200">●</span>
                </div>
              )}
            </div>
          </div>

          {/* コントロール */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
            {/* プログレスバー */}
            <div className="w-full h-1 bg-white/30 rounded-full mb-4">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${progress}%`,
                  backgroundColor: theme === "light" ? "#ffba08" : "#00c896",
                }}
              ></div>
            </div>

            <div className="flex items-center justify-between">
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20" onClick={togglePlay}>
                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
              </Button>

              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20" onClick={toggleMute}>
                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
