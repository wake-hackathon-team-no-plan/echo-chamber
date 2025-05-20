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
      </div>
    </header>
  )
}
