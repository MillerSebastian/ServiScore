import type React from "react"
import { cookies } from "next/headers"
import { ThemeProvider } from "@/components/providers/theme-provider"
import { ActiveThemeProvider } from "@/components/active-theme"
import "./dashboard-styles.css"

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const cookieStore = await cookies()
  const activeThemeValue = cookieStore.get("active-theme")?.value

  return (
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
  )
}