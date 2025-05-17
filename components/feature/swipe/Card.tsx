"use client"

import type React from "react"
import { motion } from "framer-motion"

type CardProps = {
  content: string
  className?: string
  onDragEnd?: (event: any, info: { offset: { x: number, y: number } }) => void
}

export function Card({ content, className = "", onDragEnd }: CardProps) {
  return (
    <motion.div
      className={`absolute top-0 left-0 right-0 w-full h-[300px] sm:h-[350px] md:h-[400px] bg-white rounded-2xl shadow-lg flex items-center justify-center p-4 sm:p-6 md:p-8 ${className}`}
      drag="x"
      onDragEnd={onDragEnd}
    >
      <p className="text-lg sm:text-xl md:text-2xl text-center font-bold px-2">{content}</p>
    </motion.div>
  )
} 