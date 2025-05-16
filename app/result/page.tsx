"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"
import { Share2 } from "lucide-react"
import WordCloud from "@/components/feature/word-cloud"
import VideoPlayer from "@/components/feature/video-player"

// サンプルの分析結果データ - キーワード数を増やす
const sampleAnalysisData = {
  user: {
    keywords: [
      {
        text: "環境保護",
        value: 80,
        articles: [{ title: "環境保護団体の活動が活発化", url: "#", image: "/placeholder.svg?height=100&width=150" }],
      },
      {
        text: "技術革新",
        value: 65,
        articles: [{ title: "AIが医療分野で革新をもたらす", url: "#", image: "/placeholder.svg?height=100&width=150" }],
      },
      {
        text: "社会福祉",
        value: 55,
        articles: [{ title: "新しい社会保障制度の提案", url: "#", image: "/placeholder.svg?height=100&width=150" }],
      },
      {
        text: "教育改革",
        value: 50,
        articles: [{ title: "オンライン教育の可能性と課題", url: "#", image: "/placeholder.svg?height=100&width=150" }],
      },
      {
        text: "持続可能性",
        value: 45,
        articles: [{ title: "持続可能な都市開発の事例", url: "#", image: "/placeholder.svg?height=100&width=150" }],
      },
      {
        text: "多様性",
        value: 40,
        articles: [{ title: "職場における多様性の重要性", url: "#", image: "/placeholder.svg?height=100&width=150" }],
      },
      {
        text: "イノベーション",
        value: 35,
        articles: [
          { title: "スタートアップが生み出す新たな価値", url: "#", image: "/placeholder.svg?height=100&width=150" },
        ],
      },
      {
        text: "デジタル化",
        value: 75,
        articles: [
          { title: "デジタルトランスフォーメーションの進展", url: "#", image: "/placeholder.svg?height=100&width=150" },
        ],
      },
      {
        text: "プライバシー",
        value: 60,
        articles: [{ title: "個人情報保護の重要性", url: "#", image: "/placeholder.svg?height=100&width=150" }],
      },
      {
        text: "公平性",
        value: 70,
        articles: [{ title: "社会的公平性を目指す取り組み", url: "#", image: "/placeholder.svg?height=100&width=150" }],
      },
      {
        text: "グローバル化",
        value: 55,
        articles: [{ title: "グローバル社会における課題", url: "#", image: "/placeholder.svg?height=100&width=150" }],
      },
      {
        text: "地域活性",
        value: 45,
        articles: [{ title: "地方創生の成功事例", url: "#", image: "/placeholder.svg?height=100&width=150" }],
      },
      {
        text: "ワークライフ",
        value: 65,
        articles: [{ title: "新しい働き方の模索", url: "#", image: "/placeholder.svg?height=100&width=150" }],
      },
      {
        text: "SDGs",
        value: 50,
        articles: [
          { title: "持続可能な開発目標への取り組み", url: "#", image: "/placeholder.svg?height=100&width=150" },
        ],
      },
    ],
    videoUrl: "https://example.com/your_perspective.mp4",
  },
  opposite: {
    keywords: [
      {
        text: "伝統的価値観",
        value: 75,
        articles: [{ title: "伝統文化の保存活動", url: "#", image: "/placeholder.svg?height=100&width=150" }],
      },
      {
        text: "経済成長優先",
        value: 70,
        articles: [{ title: "GDPを重視した政策の効果", url: "#", image: "/placeholder.svg?height=100&width=150" }],
      },
      {
        text: "国家安全保障",
        value: 60,
        articles: [{ title: "安全保障政策の見直し", url: "#", image: "/placeholder.svg?height=100&width=150" }],
      },
      {
        text: "規制緩和",
        value: 50,
        articles: [{ title: "規制緩和がもたらす経済効果", url: "#", image: "/placeholder.svg?height=100&width=150" }],
      },
      {
        text: "個人の自由",
        value: 45,
        articles: [{ title: "表現の自由をめぐる議論", url: "#", image: "/placeholder.svg?height=100&width=150" }],
      },
      {
        text: "市場原理",
        value: 40,
        articles: [{ title: "自由市場経済の利点と課題", url: "#", image: "/placeholder.svg?height=100&width=150" }],
      },
      {
        text: "自己責任",
        value: 65,
        articles: [{ title: "自己責任論の是非", url: "#", image: "/placeholder.svg?height=100&width=150" }],
      },
      {
        text: "効率化",
        value: 70,
        articles: [{ title: "ビジネスプロセスの効率化", url: "#", image: "/placeholder.svg?height=100&width=150" }],
      },
      {
        text: "競争原理",
        value: 55,
        articles: [{ title: "競争がもたらすイノベーション", url: "#", image: "/placeholder.svg?height=100&width=150" }],
      },
      {
        text: "実用主義",
        value: 60,
        articles: [{ title: "実用的なスキル教育の重要性", url: "#", image: "/placeholder.svg?height=100&width=150" }],
      },
      {
        text: "国益優先",
        value: 75,
        articles: [{ title: "自国第一主義の台頭", url: "#", image: "/placeholder.svg?height=100&width=150" }],
      },
      {
        text: "専門性",
        value: 50,
        articles: [{ title: "専門知識の価値", url: "#", image: "/placeholder.svg?height=100&width=150" }],
      },
      {
        text: "階層社会",
        value: 45,
        articles: [{ title: "能力主義社会の形成", url: "#", image: "/placeholder.svg?height=100&width=150" }],
      },
      {
        text: "技術至上主義",
        value: 65,
        articles: [{ title: "テクノロジーによる社会変革", url: "#", image: "/placeholder.svg?height=100&width=150" }],
      },
    ],
    videoUrl: "https://example.com/opposite_perspective.mp4",
  },
}

export default function ResultPage() {
  const router = useRouter()
  const [analysisData, setAnalysisData] = useState<any>(null)
  const [selectedKeyword, setSelectedKeyword] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("user")

  useEffect(() => {
    // ローカルストレージから選択された視点を取得
    const storedPerspective = localStorage.getItem("selectedPerspective")
    if (storedPerspective) {
      setActiveTab(storedPerspective)
    }

    // 実際の実装ではAPIから分析結果を取得する
    // ここではサンプルデータを使用
    const fetchAnalysisData = async () => {
      try {
        // APIリクエストをシミュレート
        await new Promise((resolve) => setTimeout(resolve, 1500))
        setAnalysisData(sampleAnalysisData)
      } catch (error) {
        console.error("Failed to fetch analysis data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAnalysisData()
  }, [])

  const handleKeywordClick = (keyword: any) => {
    setSelectedKeyword(keyword)
  }

  const handleCloseArticle = () => {
    setSelectedKeyword(null)
  }

  const handleShare = () => {
    // Twitterシェア機能
    const text = "私の思考バイアスを可視化してみました！"
    const url = window.location.href
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      "_blank",
    )
  }

  const handleRestart = () => {
    // ローカルストレージをクリアして最初から始める
    localStorage.removeItem("selectedTopics")
    localStorage.removeItem("responses")
    localStorage.removeItem("selectedPerspective")
    router.push("/")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">あなたの思考傾向を分析中...</h1>
          <div className="w-16 h-16 border-4 border-[#ffba08] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">少々お待ちください</p>
        </div>
      </div>
    )
  }

  if (!analysisData) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <p className="text-xl">データの読み込みに失敗しました。もう一度お試しください。</p>
      </div>
    )
  }

  // タブに応じたスタイルを設定
  const bgColor = activeTab === "user" ? "bg-gray-100" : "bg-gray-900"
  const textColor = activeTab === "user" ? "text-black" : "text-white"
  const accentColor = activeTab === "user" ? "#ffba08" : "#00c896"
  const secondaryBgColor = activeTab === "user" ? "bg-white" : "bg-gray-800"
  const secondaryTextColor = activeTab === "user" ? "text-gray-800" : "text-gray-200"
  const mutedTextColor = activeTab === "user" ? "text-gray-600" : "text-gray-400"

  return (
    <div className={`min-h-screen pt-24 transition-colors duration-500 ${bgColor} ${textColor}`}>
      {/* ハッシュタグパターン背景 */}
      <div className={`py-4 overflow-hidden ${activeTab === "user" ? "bg-gray-100" : "bg-gray-900"}`}>
        <div className="hashtag-pattern flex">
          <span className={`hashtag-colored ${activeTab === "user" ? "hashtag-yellow" : "hashtag-green"}`}>
            #RESULT
          </span>
          <span>#ANALYSIS</span>
          <span className={`hashtag-colored ${activeTab === "user" ? "hashtag-blue" : "hashtag-green"}`}>#RESULT</span>
          <span>#ANALYSIS</span>
          <span className={`hashtag-colored ${activeTab === "user" ? "hashtag-green" : "hashtag-blue"}`}>#RESULT</span>
          <span>#ANALYSIS</span>
          <span className={`hashtag-colored ${activeTab === "user" ? "hashtag-pink" : "hashtag-yellow"}`}>#RESULT</span>
        </div>
      </div>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="section-title">あなたの思考傾向</h1>
            <p className={`section-subtitle ${mutedTextColor}`}>あなたの選択から見えてきた思考の特徴を可視化しました</p>
          </motion.div>

          <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="max-w-6xl mx-auto">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger
                value="user"
                className="text-lg py-3 data-[state=active]:bg-[#ffba08] data-[state=active]:text-white"
              >
                あなたの視点
              </TabsTrigger>
              <TabsTrigger
                value="opposite"
                className="text-lg py-3 data-[state=active]:bg-[#00c896] data-[state=active]:text-white"
              >
                異なる視点
              </TabsTrigger>
            </TabsList>

            <TabsContent value="user" className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className={`overflow-hidden ${secondaryBgColor} border-0`}>
                  <CardContent className="p-0">
                    <VideoPlayer videoUrl={analysisData.user.videoUrl} theme="light" />
                  </CardContent>
                </Card>

                <Card className={`${secondaryBgColor} border-0`}>
                  <CardContent className="p-6">
                    <h3 className={`text-2xl font-bold mb-4 ${secondaryTextColor}`}>キーワード分析</h3>
                    <WordCloud
                      keywords={analysisData.user.keywords}
                      onKeywordClick={handleKeywordClick}
                      theme="light"
                    />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="opposite" className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className={`overflow-hidden ${secondaryBgColor} border-0`}>
                  <CardContent className="p-0">
                    <VideoPlayer videoUrl={analysisData.opposite.videoUrl} theme="dark" />
                  </CardContent>
                </Card>

                <Card className={`${secondaryBgColor} border-0`}>
                  <CardContent className="p-6">
                    <h3 className={`text-2xl font-bold mb-4 ${secondaryTextColor}`}>異なる視点のキーワード</h3>
                    <WordCloud
                      keywords={analysisData.opposite.keywords}
                      onKeywordClick={handleKeywordClick}
                      theme="dark"
                    />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex flex-wrap justify-center gap-4 mt-12">
            <Button
              onClick={handleShare}
              className={`flex items-center gap-2 rounded-full px-6 py-2 ${
                activeTab === "user" ? "bg-black text-white hover:bg-gray-800" : "bg-white text-black hover:bg-gray-200"
              }`}
            >
              <Share2 size={18} />
              結果をシェアする
            </Button>
            <Button
              variant="outline"
              onClick={handleRestart}
              className={`rounded-full border-2 px-6 py-2 ${
                activeTab === "user"
                  ? "border-black text-black hover:bg-black/10"
                  : "border-white text-white hover:bg-white/10"
              }`}
            >
              もう一度はじめから
            </Button>
          </div>
        </div>
      </section>

      {selectedKeyword && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={handleCloseArticle}
        >
          <Card
            className={`w-full max-w-2xl ${activeTab === "user" ? "bg-white" : "bg-gray-800"}`}
            onClick={(e) => e.stopPropagation()}
          >
            <CardContent className="p-6">
              <h3 className={`text-2xl font-bold mb-4 ${activeTab === "user" ? "text-black" : "text-white"}`}>
                {selectedKeyword.text}に関連する記事
              </h3>
              <div className="space-y-4">
                {selectedKeyword.articles.map((article: any, index: number) => (
                  <a
                    key={index}
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-4 p-3 rounded-lg transition-colors ${
                      activeTab === "user" ? "hover:bg-gray-100" : "hover:bg-gray-700"
                    }`}
                  >
                    <img
                      src={article.image || "/placeholder.svg"}
                      alt={article.title}
                      className="w-24 h-16 object-cover rounded"
                    />
                    <div>
                      <h4 className={`font-medium ${activeTab === "user" ? "text-black" : "text-white"}`}>
                        {article.title}
                      </h4>
                      <p className="text-sm text-blue-600">記事を読む →</p>
                    </div>
                  </a>
                ))}
              </div>
              <div className="mt-6 text-center">
                <Button
                  variant="outline"
                  onClick={handleCloseArticle}
                  className={`rounded-full ${
                    activeTab === "user"
                      ? "border-black text-black hover:bg-black/10"
                      : "border-white text-white hover:bg-white/10"
                  }`}
                >
                  閉じる
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
