"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, ShoppingBag, User, Star, Languages, LayoutDashboard } from "lucide-react"
import { cn } from "@/lib/utils"
import { ModeToggle } from "@/components/mode-toggle"
import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useEffect, useState } from "react"

export function Navbar() {
  const pathname = usePathname()
  const { t, language, setLanguage } = useLanguage()
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    // Check if user is admin from localStorage
    const adminData = localStorage.getItem('admin')
    if (adminData) {
      try {
        const admin = JSON.parse(adminData)
        setIsAdmin(admin.role === 'admin')
      } catch (e) {
        setIsAdmin(false)
      }
    } else {
      setIsAdmin(false)
    }
  }, [pathname]) // Re-check when pathname changes

  const navItems = [
    { href: "/", label: t("nav.home"), icon: Home },
    { href: "/services", label: t("nav.services"), icon: ShoppingBag },
    { href: "/profile", label: t("nav.profile"), icon: User },
  ]

  if (
    pathname === "/login" ||
    pathname?.startsWith("/landingPage") ||
    pathname?.startsWith("/dashboard") ||
    pathname?.startsWith("/shop-analytics") ||
    pathname?.startsWith("/super-profile") ||
    pathname?.startsWith("/logs") ||
    pathname?.startsWith("/shops/manage") ||
    pathname?.startsWith("/shops/metrics") ||
    pathname?.startsWith("/services/manage") ||
    pathname?.startsWith("/services/metrics")
  )
    return null

  return (
    <>
      {/* Desktop Header */}
      <header className="hidden md:block sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight text-foreground">ServiScore</span>
          </Link>
          <div className="flex items-center gap-4">
            <nav className="flex items-center gap-6">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    item.href === "/login"
                      ? "text-muted-foreground" // Login nunca azul fijo
                      : pathname === item.href
                        ? "text-primary font-bold"
                        : "text-muted-foreground"
                  )}
                >
                  {item.label}
                </Link>
              ))}
              {isAdmin && (
                <Link
                  href="/dashboard"
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary flex items-center gap-1",
                    pathname?.startsWith("/dashboard")
                      ? "text-primary font-bold"
                      : "text-muted-foreground"
                  )}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>
              )}
            </nav>
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Languages className="h-[1.2rem] w-[1.2rem]" />
                    <span className="sr-only">Switch Language</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setLanguage("en")} className={language === "en" ? "bg-accent" : ""}>
                    English
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setLanguage("es")} className={language === "es" ? "bg-accent" : ""}>
                    Español
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <ModeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background border-t pb-safe">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full gap-1",
                pathname === item.href ? "text-primary" : "text-muted-foreground",
              )}
            >
              <item.icon className={cn("h-5 w-5", pathname === item.href && "fill-current")} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          ))}
          {isAdmin && (
            <Link
              href="/dashboard"
              className={cn(
                "flex flex-col items-center justify-center w-full h-full gap-1",
                pathname?.startsWith("/dashboard") ? "text-primary" : "text-muted-foreground",
              )}
            >
              <LayoutDashboard className={cn("h-5 w-5", pathname?.startsWith("/dashboard") && "fill-current")} />
              <span className="text-[10px] font-medium">Dashboard</span>
            </Link>
          )}
          <div
            className="flex flex-col items-center justify-center w-full h-full gap-1"
            onClick={() => setLanguage(language === "en" ? "es" : "en")}
          >
            <Languages className="h-5 w-5 text-muted-foreground" />
            <span className="text-[10px] font-medium text-muted-foreground">{language.toUpperCase()}</span>
          </div>
        </div>
      </nav>
    </>
  )
}
