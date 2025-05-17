import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

// カードの型定義
type Card = {
  id: number
  content: string
  category: number
}

// カードの取得
const fetchCards = async (): Promise<Card[]> => {
  try {
    const storedCards = localStorage.getItem("generatedCards")
    if (storedCards) {
      return JSON.parse(storedCards)
    }
    return []
  } catch (error) {
    console.error("カード取得エラー:", error)
    return []
  }
}

export function useCards() {
  const router = useRouter()
  const [cards, setCards] = useState<Card[]>([])

  useEffect(() => {
    const loadCards = async () => {
      try {
        const fetchedCards = await fetchCards()
        setCards(fetchedCards)
        
        if (fetchedCards.length === 0) {
          // カードが取得できない場合は選択画面に戻る
          router.push("/select")
        }
      } catch (error) {
        console.error("カードの読み込みに失敗しました:", error)
        router.push("/select")
      }
    }

    loadCards()
  }, [router])

  return {
    cards
  }
} 