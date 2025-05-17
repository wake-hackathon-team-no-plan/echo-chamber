"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { ArrowRight, Loader2 } from "lucide-react"
import { ThemeCard } from "@/components/feature/select/theme-card"
import { useRandomThemes, allThemes } from "@/components/feature/select/themes"
import { generateValuesText } from "@/app/actions/generate-values-text"

export default function SelectPage() {
  const router = useRouter()
  const [selectedTheme, setSelectedTheme] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const displayThemes = useRandomThemes(8) // 8つのテーマをランダムに取得

  const selectTheme = (id: number) => {
    if (selectedTheme === id) {
      setSelectedTheme(null)
    } else {
      setSelectedTheme(id)
    }
  }

  const handleNext = async () => {
    if (selectedTheme !== null) {
      try {
        setIsLoading(true)
        // 選択されたテーマIDから対応するテーマのタイトルを取得
        const selectedThemeTitle = allThemes.find(theme => theme.id === selectedTheme)?.title || "";
        
        // サーバーアクションを呼び出し、テーマをもとにワードを生成
        const result = await generateValuesText(selectedThemeTitle);
        
        if ('text' in result) {
          // 生成されたワードとテーマIDをlocalStorageに保存
          localStorage.setItem("selectedThemes", JSON.stringify([selectedThemeTitle]))
          localStorage.setItem("generatedCards", JSON.stringify(
            result.text.map((content, index) => ({
              id: index + 1,
              content,
              category: selectedTheme,
            }))
          ))
          
          router.push("/swipe")
        } else {
          // エラー処理
          console.error("ワード生成エラー:", result.error)
          alert(`ワードの生成中にエラーが発生しました: ${result.error}`)
        }
      } catch (error) {
        console.error("エラー:", error)
        alert("処理中にエラーが発生しました。もう一度お試しください。")
      } finally {
        setIsLoading(false)
      }
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

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto mb-6" data-testid="themes-grid">
            {displayThemes.map((theme) => (
              <ThemeCard
                key={theme.id}
                theme={theme}
                isSelected={selectedTheme === theme.id}
                onToggle={selectTheme}
              />
            ))}
          </div>

          <div className="text-center pb-4">
            <Button
              size="lg"
              onClick={handleNext}
              disabled={selectedTheme === null || isLoading}
              className="rounded-full bg-[#3b7ff2] hover:bg-[#3b7ff2]/90 px-6 py-5 md:px-8 md:py-6 text-base md:text-lg font-bold"
              data-testid="next-button"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  生成中...
                </>
              ) : (
                <>
                  次へ進む
                  <ArrowRight className="ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
