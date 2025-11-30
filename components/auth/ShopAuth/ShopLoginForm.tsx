"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, Languages } from "lucide-react"
import { useState } from "react"
import { ModeToggle } from "@/components/mode-toggle"
import { useLanguage } from "@/contexts/language-context"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"

interface ShopLoginFormProps {
    onToggle: () => void
}

export function ShopLoginForm({ onToggle }: ShopLoginFormProps) {
    const [showPassword, setShowPassword] = useState(false)
    const router = useRouter()
    const { t, language, setLanguage } = useLanguage()

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Handle login logic here
        router.push("/admin/dashboard") // Redirect to admin dashboard
    }

    return (
        <div className="w-full max-w-sm space-y-6">
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-bold text-foreground">{t("auth.welcome")}</h2>
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
                <p className="text-muted-foreground">{t("auth.login.subtitle")}</p>
            </div>
            <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-2">
                    <Label htmlFor="email">{t("auth.email")}</Label>
                    <Input
                        id="email"
                        placeholder={t("auth.email")}
                        type="email"
                        className="bg-muted border-none text-foreground placeholder:text-muted-foreground h-12"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="password">{t("auth.password")}</Label>
                    <div className="relative">
                        <Input
                            id="password"
                            placeholder={t("auth.password")}
                            type={showPassword ? "text" : "password"}
                            className="bg-muted border-none text-foreground placeholder:text-muted-foreground h-12 pr-10"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <Checkbox id="remember" className="border-muted-foreground data-[state=checked]:bg-primary data-[state=checked]:border-primary" />
                        <label
                            htmlFor="remember"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-muted-foreground"
                        >
                            {t("auth.rememberMe")}
                        </label>
                    </div>
                    <a href="#" className="text-sm text-primary hover:text-primary/80">{t("auth.forgotPassword")}</a>
                </div>
                <Button className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-lg">
                    {t("auth.login")}
                </Button>
            </form>

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">{t("auth.orLogin")}</span>
                </div>
            </div>

            <p className="text-center text-sm text-muted-foreground">
                Don't have an account?{" "}
                <button onClick={onToggle} className="text-primary hover:text-primary/80 font-medium">
                    {t("auth.signup")}
                </button>
            </p>
        </div>
    )
}
