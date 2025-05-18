import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Binoculars } from "lucide-react"

type Props = {
  selectedKeyword: any
  activeTab: string
  handleCloseArticle: () => void
}

export default function KeywordModal({ selectedKeyword, activeTab, handleCloseArticle }: Props) {
  if (!selectedKeyword) return null

  let theme = ""
  if (typeof window !== "undefined") {
    const selectedThemes = localStorage.getItem("selectedThemes")
    if (selectedThemes) {
      theme = JSON.parse(selectedThemes)
    }
  }

  return (
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
            {selectedKeyword}に関連する記事
          </h3>
          <div className="space-y-4">
            <a
              href={`https://www.google.com/search?q=${encodeURIComponent(`${theme}　${selectedKeyword}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-4 p-3 rounded-lg transition-colors ${
                activeTab === "user" ? "hover:bg-gray-100" : "hover:bg-gray-700"
              }`}
              onClick={handleCloseArticle}
            >
              <Binoculars size={48} className="text-[#3b7ff2]" />
              <div>
                <p className={`text-2xl ${activeTab === "user" ? "text-black" : "text-white"}`}>Googleで検索 →</p>
              </div>
            </a>
          </div>
          <div className="mt-6 text-center">
            <Button
              variant="outline"
              onClick={handleCloseArticle}
              className={`rounded-full ${
                activeTab === "user"
                  ? "border-black text-black hover:bg-black/10"
                  : "border-white text-black hover:bg-white/10"
              }`}
            >
              閉じる
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}