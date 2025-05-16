/**
 * トピックデータの定義
 */
"use client"  // クライアント側でランダム選択を行うために追加
import { useEffect, useState } from "react"

export type Topic = {
  id: number
  title: string
  iconName: string
}

// Material Icons風の名前を使用したトピック定義
export const allTopics: Topic[] = [
  { id: 1, title: "政治", iconName: "AccountBalance" },
  { id: 2, title: "経済", iconName: "TrendingUp" },
  { id: 3, title: "環境問題", iconName: "EcoOutlined" },
  { id: 4, title: "テクノロジー", iconName: "ComputerOutlined" },
  { id: 5, title: "教育", iconName: "School" },
  { id: 6, title: "健康", iconName: "FavoriteBorder" },
  { id: 7, title: "エンターテイメント", iconName: "MovieOutlined" },
  { id: 8, title: "スポーツ", iconName: "EmojiEvents" },
  { id: 9, title: "科学", iconName: "Science" },
  { id: 10, title: "芸術", iconName: "Palette" },
  { id: 11, title: "歴史", iconName: "History" },
  { id: 12, title: "文化", iconName: "Museum" },
  { id: 13, title: "旅行", iconName: "Flight" },
  { id: 14, title: "料理", iconName: "Restaurant" },
  { id: 15, title: "ファッション", iconName: "Checkroom" },
  { id: 16, title: "心理学", iconName: "Psychology" },
  { id: 17, title: "宇宙", iconName: "Rocket" },
  { id: 18, title: "建築", iconName: "Architecture" },
  { id: 19, title: "言語", iconName: "Translate" },
  { id: 20, title: "SNS", iconName: "ConnectWithoutContact" },
]

// 初期表示用に最初の8トピックを返す
// サーバーサイドレンダリングで使用される
export const topics = allTopics.slice(0, 8)

// ランダムにトピックを選択するカスタムフック
export function useRandomTopics(count: number = 8): Topic[] {
  const [randomTopics, setRandomTopics] = useState<Topic[]>(topics)

  useEffect(() => {
    // クライアントサイドでのみランダム選択を実行
    const shuffled = [...allTopics].sort(() => 0.5 - Math.random())
    setRandomTopics(shuffled.slice(0, count))
  }, [count])

  return randomTopics
}
