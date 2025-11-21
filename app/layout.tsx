import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "./providers"
import { Navbar } from "@/components/navbar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ServiScore",
  description: "Community Marketplace & Store Ratings",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-background text-foreground min-h-screen flex flex-col`}>
        <Providers>
          <Navbar />
          <main className="flex-1 pb-20 md:pb-0">{children}</main>
        </Providers>
      </body>
    </html>
  )
}
