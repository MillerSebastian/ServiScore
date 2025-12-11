import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { cookies } from "next/headers"
import "./globals.css"
import { Providers } from "./providers"
import { Navbar } from "@/components/navbar"
import { cn } from "@/lib/utils"



import { AuthGuard } from "@/components/auth/AuthGuard"

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
  const cookieStore = await cookies()
  const activeThemeValue = cookieStore.get("active-theme")?.value
  const isScaled = activeThemeValue?.endsWith("-scaled")
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("bg-background overscroll-none font-sans antialiased", activeThemeValue ? `theme-${activeThemeValue}` : "", isScaled ? "theme-scaled" : "")}>
        <Providers>
          <AuthGuard>
            <Navbar />
            <main className="flex-1 pb-20 md:pb-0">{children}</main>
          </AuthGuard>
        </Providers>
      </body>
    </html>
  )
}

