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
import { sampleAnalysisData } from "@/components/feature/result/sampleAnalysisData"


export default function ResultPage() {
  const router = useRouter()
  const [analysisData, setAnalysisData] = useState<any>(null)
  const [selectedKeyword, setSelectedKeyword] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("user")
  const [userVideoUrl, setUserVideoUrl] = useState("")
  const [oppositeVideoUrl, setOppositeVideoUrl] = useState("")

  useEffect(() => {
    // localStorage から選択された視点を取得
    const storedPerspective = localStorage.getItem("selectedPerspective")
    if (storedPerspective) {
      setActiveTab(storedPerspective)
    }

    // localStorage から動画URLを取得
    // ✅ TODO: key は仮で設定
    const userVideoFromStorage = localStorage.getItem("userVideoPath");
    const oppositeVideoFromStorage = localStorage.getItem("oppositeVideoPath");

    // 取得したパスがあれば状態にセット
    if (userVideoFromStorage && oppositeVideoFromStorage) {
    setUserVideoUrl(userVideoFromStorage);
    setOppositeVideoUrl(oppositeVideoFromStorage);

    // 分析データ取得（サンプルデータを使用）
    const fetchAnalysisOnly = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        setAnalysisData(sampleAnalysisData);
      } catch (error) {
        console.error("Failed to fetch analysis data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalysisOnly();
  } else {
    // 開発用: ローカルストレージに動画URLがない場合の処理
    // 本番環境では、ここでエラーを表示するか前のページにリダイレクト
    console.error("Video URLs not found in localStorage");
    setIsLoading(false);

    // サンプルデータを使用して表示（開発用）
    setAnalysisData(sampleAnalysisData);

    // 開発用メッセージ
    console.warn("開発用: 動画URLがローカルストレージにありません。本番環境ではエラーになります。");
  }

  }, [])

  console.log("userVideoUrl", userVideoUrl) // ✅ rm later　‼️
  console.log("oppositeVideoUrl", oppositeVideoUrl) // ✅ rm later　‼️

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
    localStorage.removeItem("selectedThemes")
    localStorage.removeItem("responses")
    localStorage.removeItem("selectedPerspective")
    localStorage.removeItem("generatedCards")
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
    <div className={`min-h-screen transition-colors duration-500 ${bgColor} ${textColor}`}>
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
                    <VideoPlayer videoUrl={userVideoUrl || analysisData?.user?.videoUrl} theme="light" />
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
                   <VideoPlayer videoUrl={oppositeVideoUrl || analysisData?.opposite?.videoUrl} theme="dark" />
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
