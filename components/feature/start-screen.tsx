"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import SekairoscopeLogo from "@/components/feature/sekairoscope-logo"

export default function StartScreen() {
  const router = useRouter()

  const handleStart = () => {
    router.push("/select")
  }

  const currentDate = new Date()
  const formattedDate = `${currentDate.getFullYear()}.${String(currentDate.getMonth() + 1).padStart(2, "0")}.${String(currentDate.getDate()).padStart(2, "0")}`
  const hours = String(currentDate.getHours()).padStart(2, "0")
  const minutes = String(currentDate.getMinutes()).padStart(2, "0")
  const formattedTime = `${hours}:${minutes}`

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-100">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="phone-frame theme-pink"
      >
        <div className="flex flex-col h-full">
          {/* 時間と日付 */}
          <div className="mb-6">
            <div className="display-time">{formattedTime}</div>
            <div className="display-date">DAY / {formattedDate}</div>
          </div>

          {/* イラストエリア */}
          <div className="illustration-area flex-grow flex items-center justify-center">
            <div className="text-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="mb-8"
              >
                <div className="hashtag mb-4">#MOMENT</div>
                <div className="flex justify-center mb-4">
                  <SekairoscopeLogo className="w-64" />
                </div>
                <p className="text-xl mb-8">
                  あなたの情報の偏り、
                  <br />
                  可視化してみませんか？
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="mt-4"
              >
                <Button
                  onClick={handleStart}
                  className="rounded-full bg-white text-black hover:bg-gray-100 px-8 py-6 text-lg font-bold"
                >
                  はじめる
                  <ArrowRight className="ml-2" />
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="scroll-prompt">
        SCROLL TO NEXT <ArrowRight size={16} />
      </div>
    </div>
  )
}
