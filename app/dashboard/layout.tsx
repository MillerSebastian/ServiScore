import type React from "react"
import { ThemeProvider } from "@/components/providers/theme-provider"
import { ActiveThemeProvider } from "@/components/active-theme"

const META_THEME_COLORS = {
  light: "#ffffff",
  dark: "#000000",
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      enableColorScheme
    >
      <ActiveThemeProvider initialTheme={undefined}>
        {children}
      </ActiveThemeProvider>
    </ThemeProvider>
  )
}