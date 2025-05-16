"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { ColorfulBlocks } from "@/components/feature/start/decorations"

export default function StartPage() {
  const router = useRouter()

  const handleStart = () => {
    router.push("/select")
  }

  return (
    <div className="min-h-screen bg-gray-100 py-20 flex items-center justify-center">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="relative max-w-md mx-auto"
        >
          <div className="w-full h-[400px] relative">
            <ColorfulBlocks />
            
            <div className="absolute inset-0 flex items-center justify-center">
              <Card className="bg-white p-6 rounded-3xl shadow-lg w-3/4 h-3/4 flex flex-col items-center justify-center">
                <p className="text-xl md:text-2xl font-bold text-center mb-8 px-2">
                  <span className="whitespace-nowrap">あなたの情報の偏り、</span>
                  <br />
                  <span className="whitespace-nowrap">可視化してみませんか？</span>
                </p>
                
                <Button
                  onClick={handleStart}
                  className="rounded-full bg-black text-white hover:bg-gray-800 px-5 py-2 text-base md:text-lg font-bold"
                  data-testid="start-button"
                >
                  はじめる
                  <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
                </Button>
              </Card>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
