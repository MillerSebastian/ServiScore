"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, Languages, Upload } from "lucide-react"
import { useState } from "react"
import { ModeToggle } from "@/components/mode-toggle"
import { useLanguage } from "@/contexts/language-context"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"

interface ShopRegisterFormProps {
    onToggle: () => void
}

export function ShopRegisterForm({ onToggle }: ShopRegisterFormProps) {
    const [showPassword, setShowPassword] = useState(false)
    const router = useRouter()
    const { t, language, setLanguage } = useLanguage()

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        router.push("/admin/dashboard")
    }

    return (
        <div className="w-full max-w-sm space-y-6 overflow-y-auto max-h-[550px] pr-2 no-scrollbar">
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-bold text-foreground">{t("auth.createAccount")}</h2>
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
                <p className="text-muted-foreground">{t("auth.register.subtitle")} <button onClick={onToggle} className="text-primary hover:text-primary/80">{t("auth.login")}</button></p>
            </div>
            <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-2">
                    <Label htmlFor="storeName">{t("auth.shop.storeName")}</Label>
                    <Input
                        id="storeName"
                        placeholder={t("auth.shop.storeName")}
                        className="bg-muted border-none text-foreground placeholder:text-muted-foreground h-12"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="category">{t("auth.shop.category")}</Label>
                        <Input
                            id="category"
                            placeholder={t("auth.shop.category")}
                            className="bg-muted border-none text-foreground placeholder:text-muted-foreground h-12"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="nit">{t("auth.shop.nit")}</Label>
                        <Input
                            id="nit"
                            placeholder="123456789"
                            className="bg-muted border-none text-foreground placeholder:text-muted-foreground h-12"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="address">{t("auth.shop.address")}</Label>
                    <Input
                        id="address"
                        placeholder={t("auth.shop.address")}
                        className="bg-muted border-none text-foreground placeholder:text-muted-foreground h-12"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="phone">{t("auth.shop.phone")}</Label>
                        <Input
                            id="phone"
                            placeholder="+1 234 567 890"
                            type="tel"
                            className="bg-muted border-none text-foreground placeholder:text-muted-foreground h-12"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">{t("auth.email")}</Label>
                        <Input
                            id="email"
                            placeholder={t("auth.email")}
                            type="email"
                            className="bg-muted border-none text-foreground placeholder:text-muted-foreground h-12"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="logo">{t("auth.shop.logo")}</Label>
                    <div className="flex items-center gap-4">
                        <div className="flex-1">
                            <Input
                                id="logo"
                                type="file"
                                className="bg-muted border-none text-foreground file:text-foreground file:bg-background/20 h-12 pt-2"
                            />
                        </div>
                    </div>
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

                <div className="flex items-center space-x-2">
                    <Checkbox id="terms" className="border-muted-foreground data-[state=checked]:bg-primary data-[state=checked]:border-primary" />
                    <label
                        htmlFor="terms"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-muted-foreground"
                    >
                        {t("auth.agree")} <a href="#" className="text-primary hover:text-primary/80">{t("auth.terms")}</a>
                    </label>
                </div>
                <Button className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-lg">
                    {t("auth.createAccount")}
                </Button>
            </form>
        </div>
    )
}
