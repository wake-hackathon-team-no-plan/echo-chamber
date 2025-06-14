import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import type { SwipeAnswer } from "./useCardSwipe"

type ResultData = {
  keywords: string[]
  perspective: string
  videoUrl: string
  imageUrl: string
  voiceName: string
}

type Results = {
  user: ResultData | null
  opposite: ResultData | null
  swipeAnswers: SwipeAnswer[] | null
}

const fetchResults = async (): Promise<Results> => {
  try {
    const storedResults = localStorage.getItem("results")
    const storedAnswers = localStorage.getItem("swipeAnswers")

    if (storedResults) {
      const parsed = JSON.parse(storedResults)
      return {
        user: parsed.user || null,
        opposite: parsed.opposite || null,
        swipeAnswers: storedAnswers ? JSON.parse(storedAnswers) : null,
      }
    }
    return { user: null, opposite: null, swipeAnswers: storedAnswers ? JSON.parse(storedAnswers) : null }
  } catch (error) {
    console.error("結果データ取得エラー:", error)
    return { user: null, opposite: null, swipeAnswers: null }
  }
}

export function useResults() {
  const router = useRouter()
  const [data, setData] = useState<Results | null>(null)

  useEffect(() => {
    const load = async () => {
      const results = await fetchResults()
      setData(results)

      if (!results.user || !results.opposite) {
        router.push("/perspective")
      }
    }
    load()
  }, [router])

  return { data }
}
