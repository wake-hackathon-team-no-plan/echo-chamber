"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import SekairoscopeLogo from "@/components/feature/sekairoscope-logo"

export default function Home() {
  const router = useRouter()

  const handleStart = () => {
    router.push("/select")
  }

  return (
    <div className="min-h-screen">
      {/* ハッシュタグパターン背景 */}
      <div className="bg-gray-100 py-4 overflow-hidden">
        <div className="hashtag-pattern flex">
          <span className="hashtag-colored hashtag-pink">#MOMENT</span>
          <span>#ABOUT</span>
          <span className="hashtag-colored hashtag-blue">#ABOUT</span>
          <span>#MOMENT</span>
          <span className="hashtag-colored hashtag-orange">#ABOUT</span>
          <span>#MOMENT</span>
          <span className="hashtag-colored hashtag-yellow">#ABOUT</span>
        </div>
      </div>

      {/* ヒーローセクション */}
      <section className="bg-gray-100 py-20">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <div className="mb-6">
              <SekairoscopeLogo className="w-full max-w-[320px] mb-4" />
              <h1 className="text-5xl font-black">
                <span className="text-[#ff5c8d]">思考バイアス可視化</span>
              </h1>
            </div>
            <p className="text-xl mb-8 text-gray-700">
              新たなムーブメントが生まれる瞬間を捉える感性と、
              <br />
              時代の空気感をカタチにするクリエイティビティで、
              <br />
              いまを選ぶ価値観を可視化します。
            </p>
            <Button
              onClick={handleStart}
              className="rounded-full bg-black text-white hover:bg-gray-800 px-8 py-6 text-lg font-bold"
            >
              はじめる
              <ArrowRight className="ml-2" />
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="w-full h-[400px] relative">
              <div className="absolute top-0 right-0 w-3/4 h-3/4 bg-[#ff5c8d] rounded-3xl"></div>
              <div className="absolute bottom-0 left-0 w-3/4 h-3/4 bg-[#3b7ff2] rounded-3xl"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white p-4 rounded-3xl shadow-lg w-3/4 h-3/4 flex items-center justify-center">
                  <p className="text-2xl font-bold text-center">
                    あなたの情報の偏り、
                    <br />
                    可視化してみませんか？
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 特徴セクション */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="section-title">セカイロスコープの特徴</h2>
            <p className="section-subtitle">あなたの選択から見えてくる思考の傾向を可視化します</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="feature-card bg-gray-50 p-6"
            >
              <div className="text-4xl mb-4 text-[#ff5c8d]">01</div>
              <h3 className="text-xl font-bold mb-3">テーマ選択</h3>
              <p className="text-gray-600">
                興味のあるテーマを選んで、あなたの関心領域を教えてください。多様なトピックから選択できます。
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="feature-card bg-gray-50 p-6"
            >
              <div className="text-4xl mb-4 text-[#3b7ff2]">02</div>
              <h3 className="text-xl font-bold mb-3">カードスワイプ</h3>
              <p className="text-gray-600">
                様々な意見や情報に対する反応をスワイプで教えてください。直感的な操作で思考を記録します。
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="feature-card bg-gray-50 p-6"
            >
              <div className="text-4xl mb-4 text-[#00c896]">03</div>
              <h3 className="text-xl font-bold mb-3">結果可視化</h3>
              <p className="text-gray-600">
                あなたの思考傾向を可視化した結果をワードクラウドと映像で確認できます。新たな気づきが得られるでしょう。
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 価値観セクション */}
      <section className="py-20 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="section-title">私たちの価値観</h2>
            <p className="section-subtitle">セカイロスコープが大切にしている価値観</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <div className="text-center">
              <div className="value-circle bg-[#ffba08]">
                <div className="value-circle-content">好奇心</div>
              </div>
              <h3 className="font-bold mb-1">好奇心が大切</h3>
              <p className="text-sm text-gray-600">新しい視点への探求</p>
            </div>

            <div className="text-center">
              <div className="value-circle bg-[#3b7ff2]">
                <div className="value-circle-content">創造性</div>
              </div>
              <h3 className="font-bold mb-1">創造性にこだわる</h3>
              <p className="text-sm text-gray-600">独自の表現とアイデア</p>
            </div>

            <div className="text-center">
              <div className="value-circle bg-[#ff5c8d]">
                <div className="value-circle-content">共感</div>
              </div>
              <h3 className="font-bold mb-1">愛とフィット</h3>
              <p className="text-sm text-gray-600">人々の気持ちに寄り添う</p>
            </div>

            <div className="text-center">
              <div className="value-circle bg-[#00c896]">
                <div className="value-circle-content">成長</div>
              </div>
              <h3 className="font-bold mb-1">伝えよりも伝わる</h3>
              <p className="text-sm text-gray-600">効果的なコミュニケーション</p>
            </div>

            <div className="text-center">
              <div className="value-circle bg-[#ff6347]">
                <div className="value-circle-content">挑戦</div>
              </div>
              <h3 className="font-bold mb-1">つながりを広げる</h3>
              <p className="text-sm text-gray-600">新しい関係性の構築</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTAセクション */}
      <section className="py-20 bg-black text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-5xl font-black mb-6">SAY HELLO!</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            あなたの思考バイアスを可視化してみませんか？
            <br />
            今すぐ始めて、新しい自分を発見しましょう。
          </p>
          <Button
            onClick={handleStart}
            className="rounded-full bg-white text-black hover:bg-gray-200 px-8 py-6 text-lg font-bold"
          >
            はじめる
            <ArrowRight className="ml-2" />
          </Button>
        </div>
      </section>
    </div>
  )
}
