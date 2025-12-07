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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <Navbar />
          <main className="flex-1 pb-20 md:pb-0">{children}</main>
        </Providers>
      </body>
    </html>
  )
}

