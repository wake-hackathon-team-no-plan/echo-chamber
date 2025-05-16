import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/feature/theme-provider"
import Navigation from "@/components/feature/navigation"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "セカイロスコープ | 思考バイアス可視化アプリ",
  description: "あなたの情報の偏り、可視化してみませんか？",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <Navigation />
          <main>{children}</main>
        </ThemeProvider>
      </body>
    </html>
  )
}
