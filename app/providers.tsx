"use client"

import type React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { Provider } from "react-redux"
import { servicesStore } from "@/lib/store"
import { LanguageProvider } from "@/contexts/language-context"
import { ActiveThemeProvider } from "@/components/active-theme"
import { Toaster } from "@/components/ui/sonner"

export function Providers({ children, activeTheme }: { children: React.ReactNode; activeTheme?: string }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <ActiveThemeProvider initialTheme={activeTheme}>
        <Provider store={servicesStore}>
          <LanguageProvider>
            {children}
            <Toaster />
          </LanguageProvider>
        </Provider>
      </ActiveThemeProvider>
    </NextThemesProvider>
  )
}
