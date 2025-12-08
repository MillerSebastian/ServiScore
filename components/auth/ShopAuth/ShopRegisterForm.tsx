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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")
        try {
            // Simulate API call for registration
            console.log({ storeName, category, nit, phone, address, email, password, logo })
            // In a real app, you'd send this data to your backend
            await new Promise(resolve => setTimeout(resolve, 1500)) // Simulate network delay
            router.push("/admin/dashboard")
        } catch (err: any) {
            setError(err.message || "Registration failed")
        } finally {
            setLoading(false)
        }
    }

    const handleGoogleLogin = async () => {
        setLoading(true)
        setError("")
        try {
            const token = await authService.loginWithGoogle()
            await authService.syncUser(token)
            router.push("/admin/dashboard")
        } catch (err: any) {
            setError(err.message || "Google login failed")
        } finally {
            setLoading(false)
        }
    }

    const handleAppleLogin = async () => {
        setLoading(true)
        setError("")
        try {
            const token = await authService.loginWithApple()
            await authService.syncUser(token)
            router.push("/admin/dashboard")
        } catch (err: any) {
            setError(err.message || "Apple login failed")
        } finally {
            setLoading(false)
        }
    }

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]
            setLogo(file)
            setLogoPreview(URL.createObjectURL(file))
        } else {
            setLogo(null)
            setLogoPreview(null)
        }
    }

    return (
        <div className="w-full max-w-sm space-y-6 overflow-y-auto max-h-[550px] pr-2 no-scrollbar">
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-bold text-foreground">{t("auth.createStore")}</h2>
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
                {error && <div className="text-red-500 text-sm">{error}</div>}
                <div className="space-y-2">
                    <Label htmlFor="storeName">{t("auth.shop.storeName")}</Label>
                    <Input
                        id="storeName"
                        placeholder={t("auth.shop.storeName")}
                        value={storeName}
                        onChange={(e) => setStoreName(e.target.value)}
                        required
                        className="bg-muted border-none text-foreground placeholder:text-muted-foreground h-12"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="category">{t("auth.shop.category")}</Label>
                    <Select value={category} onValueChange={setCategory} required>
                        <SelectTrigger className="bg-muted border-none text-foreground h-12">
                            <SelectValue placeholder={t("auth.shop.category")} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="retail">{t("auth.category.retail")}</SelectItem>
                            <SelectItem value="food">{t("auth.category.food")}</SelectItem>
                            <SelectItem value="services">{t("auth.category.services")}</SelectItem>
                            <SelectItem value="other">{t("auth.category.other")}</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="nit">{t("auth.shop.nit")}</Label>
                        <Input
                            id="nit"
                            placeholder="123456789"
                            value={nit}
                            onChange={(e) => setNit(e.target.value)}
                            required
                            className="bg-muted border-none text-foreground placeholder:text-muted-foreground h-12"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="phone">{t("auth.shop.phone")}</Label>
                        <Input
                            id="phone"
                            placeholder="+1 234 567 890"
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                            className="bg-muted border-none text-foreground placeholder:text-muted-foreground h-12"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="address">{t("auth.shop.address")}</Label>
                    <Input
                        id="address"
                        placeholder={t("auth.shop.address")}
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required
                        className="bg-muted border-none text-foreground placeholder:text-muted-foreground h-12"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="email">{t("auth.email")}</Label>
                    <Input
                        id="email"
                        placeholder={t("auth.email")}
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="bg-muted border-none text-foreground placeholder:text-muted-foreground h-12"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="logo">{t("auth.shop.logo")}</Label>
                    <div className="flex items-center gap-4">
                        <Input
                            id="logo"
                            type="file"
                            accept="image/*"
                            onChange={handleLogoChange}
                            className="bg-muted border-none text-foreground file:text-foreground file:bg-background file:border-none file:rounded-md h-12 pt-2"
                        />
                        {logoPreview && (
                            <div className="relative w-12 h-12 rounded-full overflow-hidden border border-border">
                                <Image src={logoPreview} alt="Logo preview" fill className="object-cover" />
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="password">{t("auth.password")}</Label>
                    <div className="relative">
                        <Input
                            id="password"
                            placeholder={t("auth.password")}
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
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
                    <Checkbox id="terms" className="border-muted-foreground data-[state=checked]:bg-primary data-[state=checked]:border-primary" required />
                    <label
                        htmlFor="terms"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-muted-foreground"
                    >
                        {t("auth.agree")} <a href="#" className="text-primary hover:text-primary/80">{t("auth.terms")}</a>
                    </label>
                </div>
                <Button disabled={loading} className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-lg">
                    {loading ? "Creating Store..." : t("auth.createAccount")}
                </Button>
            </form>

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">{t("auth.orRegister")}</span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" onClick={handleGoogleLogin} disabled={loading} className="bg-transparent border-border text-foreground hover:bg-muted hover:text-foreground h-12">
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                        <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            fill="#4285F4"
                        />
                        <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#34A853"
                        />
                        <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            fill="#FBBC05"
                        />
                        <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.62l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            fill="#EA4335"
                        />
                    </svg>
                    {t("auth.google")}
                </Button>
                <Button variant="outline" onClick={handleAppleLogin} disabled={loading} className="bg-transparent border-border text-foreground hover:bg-muted hover:text-foreground h-12">
                    <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.78 1.18-.19 2.31-.89 3.51-.84 1.54.06 2.74.56 3.69 1.62-3.3 1.97-2.71 5.73.26 6.98-.67 1.72-1.61 3.38-2.54 4.43zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                    </svg>
                    {t("auth.apple")}
                </Button>
            </div>
        </div>
    )
}
