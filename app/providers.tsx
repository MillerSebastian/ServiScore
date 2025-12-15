"use client"

import type React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { Provider } from "react-redux"
import { servicesStore } from "@/lib/store"
import { LanguageProvider } from "@/contexts/language-context"
import { Toaster } from "@/components/ui/sonner"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <Provider store={servicesStore}>
        <LanguageProvider>
          {children}
          <Toaster />
        </LanguageProvider>
      </Provider>
    </NextThemesProvider>
  )
}
