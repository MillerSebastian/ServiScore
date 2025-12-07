import type React from "react"
import { cookies } from "next/headers"
import { ThemeProvider } from "@/components/providers/theme-provider"
import { ActiveThemeProvider } from "@/components/active-theme"
import { cn } from "@/lib/utils"

const META_THEME_COLORS = {
  light: "#ffffff",
  dark: "#000000",
};

export default async function DashboardLayout({
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
      </body>
    </html>
  )
}