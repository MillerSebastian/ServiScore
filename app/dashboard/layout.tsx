"use client"

import type React from "react"
import { ThemeProvider } from "@/components/providers/theme-provider"
import { ActiveThemeProvider } from "@/components/active-theme"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"

const META_THEME_COLORS = {
  light: "#ffffff",
  dark: "#000000",
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [activeThemeValue, setActiveThemeValue] = useState<string | undefined>(undefined)
  const [isScaled, setIsScaled] = useState(false)

  useEffect(() => {
    const theme = document.cookie
      .split("; ")
      .find((row) => row.startsWith("active-theme="))
      ?.split("=")[1]
    setActiveThemeValue(theme)
    setIsScaled(theme?.endsWith("-scaled") || false)
  }, [])

  return (
    <div className={cn("bg-background overscroll-none font-sans antialiased", activeThemeValue ? `theme-${activeThemeValue}` : "", isScaled ? "theme-scaled" : "")}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
        enableColorScheme
      >
        <ActiveThemeProvider initialTheme={activeThemeValue}>
          <main className="flex-1 pb-20 md:pb-0">{children}</main>
        </ActiveThemeProvider>
      </ThemeProvider>
    </div>
  )
}