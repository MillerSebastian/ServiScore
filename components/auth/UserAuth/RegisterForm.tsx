import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, Languages, ArrowLeft, Loader2, AlertCircle, CheckCircle2, XCircle } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { ModeToggle } from "@/components/mode-toggle"
import { useLanguage } from "@/contexts/language-context"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { authService } from "@/lib/services/auth.service"

interface RegisterFormProps {
    onToggle: () => void
    onSuccess?: () => void
}

export function RegisterForm({ onToggle, onSuccess }: RegisterFormProps) {
    const [showPassword, setShowPassword] = useState(false)
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const firstNameRef = useRef<HTMLInputElement>(null)
    const router = useRouter()
    const { t, language, setLanguage } = useLanguage()

    useEffect(() => {
        firstNameRef.current?.focus()
    }, [])

    // Password strength validation
    const getPasswordStrength = (pwd: string) => {
        let strength = 0
        if (pwd.length >= 8) strength += 25
        if (pwd.length >= 12) strength += 25
        if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength += 25
        if (/\d/.test(pwd)) strength += 15
        if (/[^a-zA-Z0-9]/.test(pwd)) strength += 10
        return Math.min(strength, 100)
    }

    const passwordStrength = getPasswordStrength(password)
    const getStrengthColor = (strength: number) => {
        if (strength < 40) return "bg-red-500"
        if (strength < 70) return "bg-yellow-500"
        return "bg-green-500"
    }

    const getStrengthText = (strength: number) => {
        if (strength < 40) return "Weak"
        if (strength < 70) return "Medium"
        return "Strong"
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")
        try {
            await authService.registerUser({
                email,
                password,
                fullName: `${firstName} ${lastName}`.trim()
            })

            // Send verification email
            await authService.sendVerificationEmail(email, password)

            if (onSuccess) {
                onSuccess()
            } else {
                onToggle()
            }
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
            // If registration via social login is successful, we can redirect or show success.
            // Since social login automatically verifies email (usually), we might just redirect.
            // But let's stick to the flow: if it's a new user, maybe we want to show success?
            // Actually, social login usually logs you in directly.
            // So we can redirect to home.
            if (onSuccess) {
                onSuccess() // This shows the "Check email" overlay, which might be confusing for social login if they are already verified.
                // But for now, let's just redirect to home or dashboard, assuming social login is verified.
                router.push("/")
            } else {
                router.push("/")
            }
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
            router.push("/")
        } catch (err: any) {
            setError(err.message || "Apple login failed")
        } finally {
            setLoading(false)
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-sm space-y-4 sm:space-y-6"
        >
            <Link href="/landingPage" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-4">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Home
            </Link>
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl sm:text-3xl font-bold text-foreground">{t("auth.createAccount")}</h2>
                    <div className="flex items-center gap-1 sm:gap-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-10 sm:w-10">
                                    <Languages className="h-4 w-4 sm:h-5 sm:w-5" />
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
                <p className="text-muted-foreground">{t("auth.register.subtitle")} <button onClick={onToggle} className="text-primary hover:text-primary/80 underline font-medium">{t("auth.login")}</button></p>
            </div>
            <form className="space-y-3 sm:space-y-4" onSubmit={handleSubmit}>
                {error && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="firstName">{t("auth.firstName")}</Label>
                        <Input
                            ref={firstNameRef}
                            id="firstName"
                            placeholder={t("auth.firstName")}
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                            disabled={loading}
                            className="bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground h-10 sm:h-12 focus:bg-muted focus:border-primary transition-colors"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="lastName">{t("auth.lastName")}</Label>
                        <Input
                            id="lastName"
                            placeholder={t("auth.lastName")}
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                            disabled={loading}
                            className="bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground h-10 sm:h-12 focus:bg-muted focus:border-primary transition-colors"
                        />
                    </div>
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
                        disabled={loading}
                        className="bg-muted border-none text-foreground placeholder:text-muted-foreground h-10 sm:h-12"
                    />
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
                            disabled={loading}
                            className="bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground h-10 sm:h-12 pr-10 focus:bg-muted focus:border-primary transition-colors"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                    {password && (
                        <div className="space-y-2 mt-2">
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-muted-foreground">Password strength:</span>
                                <span className={`font-medium ${
                                    passwordStrength < 40 ? "text-red-500" :
                                    passwordStrength < 70 ? "text-yellow-500" :
                                    "text-green-500"
                                }`}>
                                    {getStrengthText(passwordStrength)}
                                </span>
                            </div>
                            <Progress value={passwordStrength} className={`h-1.5 ${getStrengthColor(passwordStrength)}`} />
                            <div className="space-y-1 text-xs text-muted-foreground">
                                <div className="flex items-center gap-1">
                                    {password.length >= 8 ? <CheckCircle2 className="h-3 w-3 text-green-500" /> : <XCircle className="h-3 w-3 text-muted-foreground" />}
                                    <span>At least 8 characters</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    {/[A-Z]/.test(password) && /[a-z]/.test(password) ? <CheckCircle2 className="h-3 w-3 text-green-500" /> : <XCircle className="h-3 w-3 text-muted-foreground" />}
                                    <span>Upper & lowercase letters</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    {/\d/.test(password) ? <CheckCircle2 className="h-3 w-3 text-green-500" /> : <XCircle className="h-3 w-3 text-muted-foreground" />}
                                    <span>Contains number</span>
                                </div>
                            </div>
                        </div>
                    )}
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
                <Button disabled={loading} className="w-full h-10 sm:h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-base sm:text-lg shadow-sm">
                    {loading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating Account...
                        </>
                    ) : (
                        t("auth.createAccount")
                    )}
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

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <Button variant="outline" onClick={handleGoogleLogin} disabled={loading} className="bg-transparent border-border text-foreground hover:bg-muted hover:text-foreground h-10 sm:h-12 text-xs sm:text-sm">
                    <svg className="mr-1 sm:mr-2 h-4 w-4" viewBox="0 0 24 24">
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
                <Button variant="outline" onClick={handleAppleLogin} disabled={loading} className="bg-transparent border-border text-foreground hover:bg-muted hover:text-foreground h-10 sm:h-12 text-xs sm:text-sm">
                    <svg className="mr-1 sm:mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.78 1.18-.19 2.31-.89 3.51-.84 1.54.06 2.74.56 3.69 1.62-3.3 1.97-2.71 5.73.26 6.98-.67 1.72-1.61 3.38-2.54 4.43zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                    </svg>
                    {t("auth.apple")}
                </Button>
            </div>
        </motion.div>
    )
}
