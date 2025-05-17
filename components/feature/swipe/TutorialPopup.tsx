"use client"

import { motion } from "framer-motion"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

type TutorialPopupProps = {
  onClose: () => void
}

export function TutorialPopup({ onClose }: TutorialPopupProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
      onClick={onClose}
    >
      <div className="bg-white p-8 rounded-xl max-w-md text-center" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-2xl font-bold mb-4">スワイプの使い方</h2>
        <div className="flex justify-around mb-6">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-2">
              <ArrowLeft className="text-red-500" size={32} />
            </div>
            <p>
              左にスワイプ
              <br />
              「興味なし」
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-2">
              <ArrowRight className="text-green-500" size={32} />
            </div>
            <p>
              右にスワイプ
              <br />
              「共感・興味あり」
            </p>
          </div>
        </div>
        <Button onClick={onClose} className="rounded-full font-bold">
          始める
        </Button>
      </div>
    </motion.div>
  )
} 