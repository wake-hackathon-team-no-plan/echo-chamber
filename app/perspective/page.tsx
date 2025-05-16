"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"

export default function PerspectivePage() {
  const router = useRouter()

  const handleSelectPerspective = (perspective: "user" | "opposite") => {
    // 選択した視点をローカルストレージに保存
    localStorage.setItem("selectedPerspective", perspective)
    router.push("/result")
  }

  return (
    <div className="min-h-screen pt-24">
      {/* ハッシュタグパターン背景 */}
      <div className="bg-gray-100 py-4 overflow-hidden">
        <div className="hashtag-pattern flex">
          <span className="hashtag-colored hashtag-pink">#PERSPECTIVE</span>
          <span>#VIEW</span>
          <span className="hashtag-colored hashtag-blue">#PERSPECTIVE</span>
          <span>#VIEW</span>
          <span className="hashtag-colored hashtag-yellow">#PERSPECTIVE</span>
          <span>#VIEW</span>
          <span className="hashtag-colored hashtag-green">#PERSPECTIVE</span>
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
            <h1 className="section-title">どちらの視点から見てみる？</h1>
            <p className="section-subtitle">あなたの思考傾向を異なる視点から分析しました</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} className="perspective-card">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all hover:shadow-xl">
                <div className="bg-[#ffba08] h-4"></div>
                <div className="p-8">
                  <div className="w-20 h-20 rounded-full bg-[#ffba08] flex items-center justify-center mx-auto mb-6">
                    <span className="text-3xl">👤</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-center">あなた自身の視点</h3>
                  <p className="text-gray-600 mb-6 text-center">
                    あなたの回答から見えてきた思考傾向と、それに関連する情報を見てみましょう。
                  </p>
                  <Button
                    onClick={() => handleSelectPerspective("user")}
                    className="w-full rounded-full bg-[#ffba08] hover:bg-[#ffba08]/90 text-white"
                  >
                    この視点で見る
                    <ArrowRight className="ml-2" size={16} />
                  </Button>
                </div>
              </div>
            </motion.div>

            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} className="perspective-card">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all hover:shadow-xl">
                <div className="bg-[#00c896] h-4"></div>
                <div className="p-8">
                  <div className="w-20 h-20 rounded-full bg-[#00c896] flex items-center justify-center mx-auto mb-6">
                    <span className="text-3xl">🌍</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-center">異なる視点の世界</h3>
                  <p className="text-gray-600 mb-6 text-center">
                    あなたとは異なる考え方や価値観から見た世界を覗いてみましょう。新たな発見があるかもしれません。
                  </p>
                  <Button
                    onClick={() => handleSelectPerspective("opposite")}
                    className="w-full rounded-full bg-[#00c896] hover:bg-[#00c896]/90 text-white"
                  >
                    この視点で見る
                    <ArrowRight className="ml-2" size={16} />
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}
