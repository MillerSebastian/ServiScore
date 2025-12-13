import type React from "react"
import { cookies } from "next/headers"
import { ThemeProvider } from "@/components/providers/theme-provider"
import { ActiveThemeProvider } from "@/components/active-theme"
import { cn } from "@/lib/utils"

export default async function ShopsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const activeThemeValue = cookieStore.get("active-theme")?.value || "zinc"

  return (
    <div className={cn("flex h-full min-h-screen flex-col")}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        storageKey="theme"
        themes={["light", "dark"]}
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
