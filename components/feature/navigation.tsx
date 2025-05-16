"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import SekairoscopeLogo from "@/components/feature/sekairoscope-logo"

export default function Navigation() {
  const pathname = usePathname()

  return (
    <header
      className="sticky top-0 bg-white shadow-md py-3 z-50"
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="font-bold">
          <SekairoscopeLogo />
        </Link>

        <nav className="hidden md:flex space-x-8">
          <Link href="/" className={`nav-link ${pathname === "/" ? "active" : ""}`}>
            ホーム
          </Link>
          <Link href="/select" className={`nav-link ${pathname === "/select" ? "active" : ""}`}>
            テーマ選択
          </Link>
          <Link href="/swipe" className={`nav-link ${pathname === "/swipe" ? "active" : ""}`}>
            スワイプ
          </Link>
          <Link href="/perspective" className={`nav-link ${pathname === "/perspective" ? "active" : ""}`}>
            視点選択
          </Link>
          <Link href="/result" className={`nav-link ${pathname === "/result" ? "active" : ""}`}>
            結果
          </Link>
        </nav>
      </div>
    </header>
  )
}
