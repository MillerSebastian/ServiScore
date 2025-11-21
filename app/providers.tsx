"use client"

import type React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { Provider } from "react-redux"
import { store } from "@/lib/store"
import { LanguageProvider } from "@/contexts/language-context"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <Provider store={store}>
        <LanguageProvider>{children}</LanguageProvider>
      </Provider>
    </NextThemesProvider>
  )
}
