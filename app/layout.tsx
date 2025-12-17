import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { cookies } from "next/headers"
import "./globals.css"
import { Providers } from "./providers"
import { Navbar } from "@/components/navbar"
import { cn } from "@/lib/utils"
import { AuthGuard } from "@/components/auth/AuthGuard"
import { createMetadata } from "@/lib/seo"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = createMetadata({
  title: "Home",
  description: "Connect with local services and businesses. Find trusted service providers and rate your favorite stores in your community.",
})

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const cookieStore = await cookies()
  const activeThemeValue = cookieStore.get("active-theme")?.value
  
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(inter.className, "bg-background overscroll-none overflow-x-hidden font-sans antialiased")}>
        <Providers activeTheme={activeThemeValue}>
          <AuthGuard>
            <Navbar />
            <main className="flex-1 pb-20 md:pb-0">{children}</main>
          </AuthGuard>
        </Providers>
      </body>
    </html>
  )
}

