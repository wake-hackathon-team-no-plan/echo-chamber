"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, ArrowRight, X, Check, Heart } from "lucide-react"

// 選択したテーマに基づいた質問カード
const generateCards = (themes: number[]) => {
  // サンプルカードの定義（フォールバック用）
  const sampleCards = [
    {
      id: 1,
      content: "SNSで見かける情報は、自分の興味に合わせてカスタマイズされるべきだと思いますか？",
      category: 4, // テクノロジー
    },
    {
      id: 2,
      content: "環境問題より経済発展を優先すべき時代だと思いますか？",
      category: 3, // 環境問題
    },
    {
      id: 3,
      content: "政府は富の再分配のために高所得者への増税を強化すべきだと思いますか？",
      category: 1, // 政治
    },
    {
      id: 4,
      content: "AIによる創作物に著作権は必要だと思いますか？",
      category: 4, // テクノロジー
    },
    {
      id: 5,
      content: "教育は実用的なスキルよりも幅広い教養を重視すべきだと思いますか？",
      category: 5, // 教育
    },
    {
      id: 6,
      content: "プライバシーよりも便利さを優先するサービスを利用したいと思いますか？",
      category: 4, // テクノロジー
    },
    {
      id: 7,
      content: "国際問題では自国の利益を最優先すべきだと思いますか？",
      category: 1, // 政治
    },
    {
      id: 8,
      content: "仮想通貨は将来の主要な決済手段になると思いますか？",
      category: 2, // 経済
    },
    {
      id: 9,
      content: "オンライン教育は従来の対面教育と同等以上の効果があると思いますか？",
      category: 5, // 教育
    },
    {
      id: 10,
      content: "企業は利益よりも社会的責任を優先すべきだと思いますか？",
      category: 2, // 経済
    },
  ]

  // デフォルトのカードセット（最小限必要なカードを確保）
  const defaultCards = sampleCards.slice(0, 5);

  try {
    // localStorage から生成されたカードを取得
    const storedCards = localStorage.getItem("generatedCards")
    
    if (storedCards) {
      return JSON.parse(storedCards)
    }
    
    // 生成されたカードがない場合は、サンプルカードをフィルタリング
    // 選択されたテーマに関連するカードのみをフィルタリング
    const filteredCards = sampleCards.filter((card) => themes.includes(card.category))
    
    // 少なくとも5枚のカードを確保
    if (filteredCards.length < 5) {
      return sampleCards.slice(0, 10)
    }
    
    return filteredCards
  } catch (error) {
    console.error("カード生成エラー:", error)
    // エラー時はデフォルトのカードセットを返す
    return defaultCards
  }
}

export default function SwipePage() {
  const router = useRouter()
  const [cards, setCards] = useState<any[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState<string | null>(null)
  const [showTutorial, setShowTutorial] = useState(true)
  const [responses, setResponses] = useState<{ id: number; response: "like" | "dislike" }[]>([])

  const cardRef = useRef<HTMLDivElement>(null)
  const startX = useRef(0)
  const currentX = useRef(0)
  const isDragging = useRef(false)
  const [showLikeIndicator, setShowLikeIndicator] = useState(false)
  const [showDislikeIndicator, setShowDislikeIndicator] = useState(false)

  useEffect(() => {
    // ローカルストレージから選択されたテーマを取得
    const storedThemes = localStorage.getItem("selectedThemes")
    if (storedThemes) {
      const themes = JSON.parse(storedThemes)
      const generatedCards = generateCards(themes)
      setCards(generatedCards)
    } else {
      // テーマが選択されていない場合は選択画面に戻る
      router.push("/select")
    }
  }, [router])

  const handleSwipe = (direction: "left" | "right") => {
    if (currentIndex >= cards.length) return

    setDirection(direction)

    // 回答を記録
    setResponses([
      ...responses,
      {
        id: cards[currentIndex].id,
        response: direction === "right" ? "like" : "dislike",
      },
    ])

    // アニメーション後に次のカードへ
    setTimeout(() => {
      setDirection(null)
      setCurrentIndex(currentIndex + 1)

      // すべてのカードが終わったら視点選択画面へ
      if (currentIndex === cards.length - 1) {
        // 回答をローカルストレージに保存
        localStorage.setItem(
          "responses",
          JSON.stringify([
            ...responses,
            {
              id: cards[currentIndex].id,
              response: direction === "right" ? "like" : "dislike",
            },
          ]),
        )
        router.push("/perspective")
      }
    }, 300)
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (currentIndex >= cards.length) return
    isDragging.current = true
    startX.current = e.clientX
    if (cardRef.current) {
      cardRef.current.style.transition = "none"
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return
    currentX.current = e.clientX
    const deltaX = currentX.current - startX.current

    if (cardRef.current) {
      // マッチングアプリ風のスワイプ効果
      const rotate = deltaX * 0.1
      const translateX = deltaX
      cardRef.current.style.transform = `translateX(${translateX}px) rotate(${rotate}deg)`

      // スワイプ方向に応じたインジケーター表示
      if (deltaX > 80) {
        setShowLikeIndicator(true)
        setShowDislikeIndicator(false)
      } else if (deltaX < -80) {
        setShowLikeIndicator(false)
        setShowDislikeIndicator(true)
      } else {
        setShowLikeIndicator(false)
        setShowDislikeIndicator(false)
      }
    }
  }

  const handleMouseUp = () => {
    if (!isDragging.current) return
    isDragging.current = false
    setShowLikeIndicator(false)
    setShowDislikeIndicator(false)

    const deltaX = currentX.current - startX.current

    if (deltaX > 100) {
      handleSwipe("right")
    } else if (deltaX < -100) {
      handleSwipe("left")
    } else if (cardRef.current) {
      // スワイプしきれなかった場合は元の位置に戻す
      cardRef.current.style.transition = "transform 0.3s ease"
      cardRef.current.style.transform = "translateX(0) rotate(0deg)"
    }
  }

  const handleSkip = () => {
    if (currentIndex < cards.length) {
      router.push("/perspective")
    }
  }

  if (cards.length === 0) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <p className="text-xl">カードを読み込み中...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24">
      {/* 操作説明（初回のみ） */}
      {showTutorial && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
          onClick={() => setShowTutorial(false)}
        >
          <div className="bg-white p-8 rounded-xl max-w-md text-center" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-bold mb-4">スワイプの使い方</h2>
            <div className="flex justify-around mb-6">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-2">
                  <ArrowLeft className="text-red-500" size={32} />
                </div>
                <p>
                  左にスワイプ
                  <br />
                  「興味なし」
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-2">
                  <ArrowRight className="text-green-500" size={32} />
                </div>
                <p>
                  右にスワイプ
                  <br />
                  「共感・興味あり」
                </p>
              </div>
            </div>
            <Button onClick={() => setShowTutorial(false)} className="rounded-full font-bold">
              始める
            </Button>
          </div>
        </motion.div>
      )}

      {/* ハッシュタグパターン背景 */}
      <div className="bg-gray-100 py-4 overflow-hidden">
        <div className="hashtag-pattern flex">
          <span className="hashtag-colored hashtag-orange">#SWIPE</span>
          <span>#CARD</span>
          <span className="hashtag-colored hashtag-green">#SWIPE</span>
          <span>#CARD</span>
          <span className="hashtag-colored hashtag-pink">#SWIPE</span>
          <span>#CARD</span>
          <span className="hashtag-colored hashtag-blue">#SWIPE</span>
        </div>
      </div>

      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
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
            <Progress value={(currentIndex / cards.length) * 100} className="h-2 mb-2" />
            <p className="text-right text-sm text-gray-500">
              {currentIndex}/{cards.length}
            </p>
          </div>

          {/* カード表示エリア */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="relative w-full h-[400px]">
              {/* スタックされたカードの効果 - 複数カードが重なっているイメージ */}
              {currentIndex < cards.length - 1 && (
                <div
                  className="absolute top-2 left-0 right-0 w-full h-[400px] bg-white rounded-2xl shadow-md"
                  style={{ transform: "scale(0.98) translateY(5px)", zIndex: 1, opacity: 0.7 }}
                ></div>
              )}
              {currentIndex < cards.length - 2 && (
                <div
                  className="absolute top-4 left-0 right-0 w-full h-[400px] bg-white rounded-2xl shadow-md"
                  style={{ transform: "scale(0.96) translateY(10px)", zIndex: 0, opacity: 0.4 }}
                ></div>
              )}
              {currentIndex < cards.length - 3 && (
                <div
                  className="absolute top-6 left-0 right-0 w-full h-[400px] bg-white rounded-2xl shadow-md"
                  style={{ transform: "scale(0.94) translateY(15px)", zIndex: 0, opacity: 0.2 }}
                ></div>
              )}

              {/* メインのスワイプカード */}
              <AnimatePresence>
                {currentIndex < cards.length && (
                  <motion.div
                    key={currentIndex}
                    ref={cardRef}
                    className="absolute top-0 left-0 right-0 w-full h-[400px] bg-white rounded-2xl shadow-lg flex items-center justify-center p-8 z-10"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{
                      x: direction === "left" ? -500 : direction === "right" ? 500 : 0,
                      opacity: 0,
                      rotate: direction === "left" ? -30 : direction === "right" ? 30 : 0,
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    style={{ touchAction: "none" }}
                  >
                    {/* スワイプ判定エリア - 左右のインジケーター */}
                    {showLikeIndicator && (
                      <div className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-full font-bold flex items-center">
                        <Heart className="mr-1" size={20} />
                        共感・興味あり
                      </div>
                    )}
                    {showDislikeIndicator && (
                      <div className="absolute top-4 left-4 bg-red-500 text-white px-4 py-2 rounded-full font-bold flex items-center">
                        <X className="mr-1" size={20} />
                        興味なし
                      </div>
                    )}

                    {/* カードの内容 */}
                    <p className="text-2xl text-center font-bold">{cards[currentIndex].content}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* すべてのカードが終わった場合 */}
              {currentIndex >= cards.length && (
                <div className="absolute top-0 left-0 right-0 w-full h-[400px] bg-white rounded-2xl shadow-lg flex items-center justify-center">
                  <p className="text-2xl font-bold">すべての質問が終わりました</p>
                </div>
              )}
            </div>
          </div>

          {/* スワイプボタン */}
          <div className="flex justify-center gap-8 mb-8">
            <Button
              variant="outline"
              size="lg"
              className="rounded-full w-16 h-16 p-0 border-2 border-[#ff6347] text-[#ff6347] hover:bg-[#ff6347]/10"
              onClick={() => handleSwipe("left")}
              disabled={currentIndex >= cards.length}
            >
              <X size={32} />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="rounded-full w-16 h-16 p-0 border-2 border-[#00c896] text-[#00c896] hover:bg-[#00c896]/10"
              onClick={() => handleSwipe("right")}
              disabled={currentIndex >= cards.length}
            >
              <Check size={32} />
            </Button>
          </div>

          {/* スキップボタン */}
          <div className="text-center">
            <Button variant="ghost" className="text-gray-500 hover:text-gray-700" onClick={handleSkip}>
              スキップして次へ進む
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
