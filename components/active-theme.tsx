"use client"

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from "react"

const DEFAULT_THEME = "default"

type ThemeContextType = {
  activeTheme: string
  setActiveTheme: (theme: string) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ActiveThemeProvider({
  children,
  initialTheme,
}: {
  children: ReactNode
  initialTheme?: string
}) {
  const [activeTheme, setActiveTheme] = useState<string>(
    () => initialTheme || DEFAULT_THEME
  )

  // Use useLayoutEffect to apply theme before paint (prevents flash)
  useLayoutEffect(() => {
    // Remove all existing theme classes
    Array.from(document.body.classList)
      .filter((className) => className.startsWith("theme-"))
      .forEach((className) => {
        document.body.classList.remove(className)
      })
    
    // Add new theme class
    document.body.classList.add(`theme-${activeTheme}`)
    
    // Add scaled class if needed
    if (activeTheme.endsWith("-scaled")) {
      document.body.classList.add("theme-scaled")
    } else {
      document.body.classList.remove("theme-scaled")
    }
  }, [activeTheme])

  // Save to cookies separately
  useEffect(() => {
    document.cookie = `active-theme=${activeTheme}; path=/; max-age=31536000; SameSite=Lax`
  }, [activeTheme])

  return (
    <ThemeContext.Provider value={{ activeTheme, setActiveTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useThemeConfig() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useThemeConfig must be used within an ActiveThemeProvider")
  }
  return context
}