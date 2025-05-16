"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { TopicCard } from "@/components/feature/select/topic-card"
import { useRandomTopics } from "@/components/feature/select/topics"

export default function SelectPage() {
  const router = useRouter()
  const [selectedTopic, setSelectedTopic] = useState<number | null>(null)
  const displayTopics = useRandomTopics(8) // 8つのトピックをランダムに取得

  const selectTopic = (id: number) => {
    if (selectedTopic === id) {
      setSelectedTopic(null)
    } else {
      setSelectedTopic(id)
    }
  }

  const handleNext = () => {
    if (selectedTopic !== null) {
      // Store selected topic in localStorage for later use
      localStorage.setItem("selectedTopics", JSON.stringify([selectedTopic]))
      router.push("/swipe")
    }
  }

  return (
    <div className="h-full bg-gray-100 overflow-y-auto">
      <section className="h-full py-4">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-6 px-4 max-w-2xl mx-auto"
            data-testid="header-section"
          >
            <h1 className="text-2xl md:text-4xl font-bold mb-3 leading-tight">
              <span className="inline-block">興味のある</span>{" "}
              <span className="inline-block">テーマを選択</span>
            </h1>
            <p className="text-sm md:text-lg text-gray-600">
              <span className="inline-block">あなたが知りたい・</span>{" "}
              <span className="inline-block">可視化したいテーマを</span>{" "}
              <span className="inline-block">選んでください</span>
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto mb-6" data-testid="topics-grid">
            {displayTopics.map((topic) => (
              <TopicCard
                key={topic.id}
                topic={topic}
                isSelected={selectedTopic === topic.id}
                onToggle={selectTopic}
              />
            ))}
          </div>

          <div className="text-center pb-4">
            <Button
              size="lg"
              onClick={handleNext}
              disabled={selectedTopic === null}
              className="rounded-full bg-[#3b7ff2] hover:bg-[#3b7ff2]/90 px-6 py-5 md:px-8 md:py-6 text-base md:text-lg font-bold"
              data-testid="next-button"
            >
              次へ進む
              <ArrowRight className="ml-2" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
