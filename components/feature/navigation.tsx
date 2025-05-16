"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import SekairoscopeLogo from "@/components/feature/sekairoscope-logo"

export default function Navigation() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white shadow-md py-3" : "bg-transparent py-5"
      }`}
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
