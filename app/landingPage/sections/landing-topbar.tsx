"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { useTheme } from "next-themes"
import { Moon, Sun, Languages } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useEffect, useState } from "react"
import { ThemeSelector } from "@/components/theme-selector"

export default function LandingTopbar() {
    const { theme, setTheme } = useTheme()
    const { language, setLanguage, t } = useLanguage()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const navLinks = [
        { name: "landing.nav.features", href: "#features" },
        { name: "landing.nav.benefits", href: "#benefits" },
        { name: "landing.nav.about", href: "#about" },
        { name: "landing.nav.testimonials", href: "#testimonials" },
    ]

    return (
        <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute top-0 left-0 right-0 z-50 w-full p-6"
        >
            <div className="container mx-auto flex items-center justify-between">
                <Link href="/landingPage" className="flex items-center gap-2">
                    <span className="text-2xl font-bold tracking-tight">ServiScore</span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
                        >
                            {t(link.name)}
                        </Link>
                    ))}
                    
                    {/* Language Toggle */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Languages className="h-5 w-5" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setLanguage("en")} className={language === "en" ? "bg-accent" : "hover:bg-accent/50 cursor-pointer"}>
                                English
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setLanguage("es")} className={language === "es" ? "bg-accent" : "hover:bg-accent/50 cursor-pointer"}>
                                Español
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Theme Selector */}
                    {mounted && <ThemeSelector />}

                    {/* Theme Toggle (Light/Dark) */}
                    {mounted && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                            className=""
                        >
                            {theme === "dark" ? (
                                <Sun className="h-5 w-5" />
                            ) : (
                                <Moon className="h-5 w-5" />
                            )}
                        </Button>
                    )}

                    {/* CTA Button */}
                    <Button asChild>
                        <Link href="/login">{t("landing.nav.getStarted")}</Link>
                    </Button>
                </div>
            </div>
        </motion.header>
    )
}
