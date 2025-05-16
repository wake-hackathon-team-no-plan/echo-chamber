"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"

const topics = [
  { id: 1, title: "政治", icon: "🏛️" },
  { id: 2, title: "経済", icon: "💹" },
  { id: 3, title: "環境問題", icon: "🌍" },
  { id: 4, title: "テクノロジー", icon: "💻" },
  { id: 5, title: "教育", icon: "🎓" },
  { id: 6, title: "健康", icon: "🏥" },
  { id: 7, title: "エンターテイメント", icon: "🎭" },
  { id: 8, title: "スポーツ", icon: "⚽" },
]

export default function SelectPage() {
  const router = useRouter()
  const [selectedTopics, setSelectedTopics] = useState<number[]>([])

  const toggleTopic = (id: number) => {
    if (selectedTopics.includes(id)) {
      setSelectedTopics(selectedTopics.filter((topicId) => topicId !== id))
    } else {
      setSelectedTopics([...selectedTopics, id])
    }
  }

  const handleNext = () => {
    if (selectedTopics.length > 0) {
      // Store selected topics in localStorage for later use
      localStorage.setItem("selectedTopics", JSON.stringify(selectedTopics))
      router.push("/swipe")
    }
  }

  return (
    <div className="min-h-screen pt-24">
      {/* ハッシュタグパターン背景 */}
      <div className="bg-gray-100 py-4 overflow-hidden">
        <div className="hashtag-pattern flex">
          <span className="hashtag-colored hashtag-blue">#SELECT</span>
          <span>#TOPIC</span>
          <span className="hashtag-colored hashtag-pink">#SELECT</span>
          <span>#TOPIC</span>
          <span className="hashtag-colored hashtag-green">#SELECT</span>
          <span>#TOPIC</span>
          <span className="hashtag-colored hashtag-orange">#SELECT</span>
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
            <h1 className="section-title">興味のあるテーマを選択</h1>
            <p className="section-subtitle">あなたが知りたい・可視化したいテーマを選んでください</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-12">
            {topics.map((topic) => (
              <motion.div key={topic.id} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Card
                  className={`cursor-pointer transition-all h-full ${
                    selectedTopics.includes(topic.id)
                      ? "border-4 border-[#3b7ff2] bg-[#3b7ff2]/10"
                      : "border border-gray-200 hover:border-[#3b7ff2]/50"
                  }`}
                  onClick={() => toggleTopic(topic.id)}
                >
                  <CardContent className="flex flex-col items-center justify-center p-6 h-full">
                    <span className="text-5xl mb-4">{topic.icon}</span>
                    <h3 className="text-xl font-bold">{topic.title}</h3>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Button
              size="lg"
              onClick={handleNext}
              disabled={selectedTopics.length === 0}
              className="rounded-full bg-[#3b7ff2] hover:bg-[#3b7ff2]/90 px-8 py-6 text-lg font-bold"
            >
              次へ進む ({selectedTopics.length} 選択中)
              <ArrowRight className="ml-2" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
