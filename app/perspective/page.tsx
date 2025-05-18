"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"

export default function PerspectivePage() {
  const router = useRouter()

  const handleSelectPerspective = () => {
    router.push("/result")

    // rm later　‼️
    // ✅ 一時的なデモ用のコードです。
  const results = {
    user: {
      keywords: ["ワクワク学習","内発的動機づけ","楽しい教育","学びの自走化","宿題は習慣","創造的思考","自由な学びの場","主体性","好奇心ドリブン","正解主義からの脱却",],
      perspective: "「学びって本来めっちゃ楽しいものじゃない？」って思ってる人。努力よりワクワクが大事で、「これが正解！」って押しつけられるのはちょっと違う。宿題とかはやるけど、やらされ感じゃなく、自分から学びたくなる環境をつくりたい派。",
      videoUrl: "/videos/sample.mp4"
    },
    opposite: {
      keywords: ["効率と成果", "結果重視", "努力と我慢", "教師主導", "宿題の廃止", "詰め込み型教育", "画一的カリキュラム", "ルール遵守", "学習管理", "学力テスト中心"],
      perspective: "「学びには厳しい努力が欠かせない」と信じる人。楽しさより規律と忍耐が重要で、明確な正解と基準があってこそ成長できる。宿題は当然のことで、多少やらされ感があっても、人生で成功するには時に自分の好きなことより必要なことを優先する姿勢が大切だと考える派。",
      videoUrl: "/videos/sampleOpposite.mp4"
    }
  }
  localStorage.setItem("results", JSON.stringify(results))

  }

  return (
    <div className="min-h-screen bg-gray-100">
      <section className="pt-6 bg-gray-100">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <h1 className="text-black text-3xl md:text-4xl font-bold">異なる視点の世界</h1>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 max-w-sm mx-auto">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} className="perspective-card">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all hover:shadow-xl">
                <div className="bg-[#00c896] h-4"></div>
                <div className="p-8">
                  <div className="w-20 h-20 rounded-full bg-[#00c896] flex items-center justify-center mx-auto mb-6">
                    <span className="text-6xl">🌍</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-center text-gray-600">新しい視点を探る</h3>
                  <p className="text-gray-600 mb-6 text-center">
                    あなたとは異なる考え方や価値観を通して世界を見てみましょう。<br/>思わぬ気づきや新たな発見が待っているかもしれません。
                  </p>
                  <Button
                    onClick={() => handleSelectPerspective()}
                    className="w-full rounded-full bg-[#00c896] hover:bg-[#00c896]/90 text-white font-bold text-lg"
                  >
                    次へ進む
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
