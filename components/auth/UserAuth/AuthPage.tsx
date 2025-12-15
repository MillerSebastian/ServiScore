"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { LoginForm } from "./LoginForm"
import { RegisterForm } from "./RegisterForm"
import Image from "next/image"
import { useLanguage } from "@/contexts/language-context"

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true)
    const [showConfirmation, setShowConfirmation] = useState(false)
    const { t } = useLanguage()

    const toggleAuth = () => {
        setIsLogin(!isLogin)
        setShowConfirmation(false) // Reset confirmation on toggle
    }

    const handleRegistrationSuccess = () => {
        setShowConfirmation(true)
        // Ensure we are showing the register side (which is where the overlay is NOT covering, wait, the overlay covers the side that is NOT active)
        // If isLogin is true, overlay is on the left (covering register).
        // If isLogin is false, overlay is on the right (covering login).
        // We want to show the message on the overlay.
        // When registering, isLogin is false. Overlay is on the right.
        // The user is filling the form on the left.
        // We want the overlay (on the right) to change its text.
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
            <div className="relative w-full max-w-[1000px] lg:h-[600px] bg-card rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row">

                {/* Register Form (Left Side) */}
                <div className={`w-full lg:w-1/2 min-h-[600px] lg:h-full flex items-center justify-center p-4 sm:p-6 lg:p-8 ${isLogin ? 'hidden lg:flex' : 'flex'}`}>
                    <RegisterForm onToggle={toggleAuth} onSuccess={handleRegistrationSuccess} />
                </div>

                {/* Login Form (Right Side) */}
                <div className={`w-full lg:w-1/2 min-h-[600px] lg:h-full flex items-center justify-center p-4 sm:p-6 lg:p-8 ${isLogin ? 'flex' : 'hidden lg:flex'}`}>
                    <LoginForm onToggle={toggleAuth} />
                </div>

                {/* Sliding Overlay (Image) - Hidden on mobile */}
                <motion.div
                    initial={false}
                    animate={{ x: isLogin ? "0%" : "100%" }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="hidden lg:block absolute top-0 left-0 w-1/2 h-full z-10"
                >
                    <div className="relative w-full h-full rounded-3xl overflow-hidden bg-card">
                        <AnimatePresence>
                            <motion.div
                                key={isLogin ? "login" : "register"}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.5 }}
                                className="absolute inset-0 bg-[#1f202e]"
                            >
                                <Image
                                    src={isLogin ? "/loginimg.jpg" : "/loginimg2.jpg"}
                                    alt="Auth Background"
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            </motion.div>
                        </AnimatePresence>

                        <div className="absolute inset-0 bg-black/40 flex flex-col justify-between p-6 lg:p-8 text-white">
                            <div className="flex justify-between items-center">
                                <span className="text-xl lg:text-2xl font-bold">ServiScore</span>
                                {!showConfirmation && (
                                    <button onClick={toggleAuth} className="text-xs lg:text-sm bg-white/20 backdrop-blur-md px-3 lg:px-4 py-1.5 lg:py-2 rounded-full hover:bg-white/30 transition flex items-center gap-1 lg:gap-2">
                                        {isLogin ? t("auth.createAccount") : t("auth.login")} &rarr;
                                    </button>
                                )}
                            </div>
                            <div>
                                {showConfirmation ? (
                                    <>
                                        <h2 className="text-2xl lg:text-3xl font-bold mb-2">Check your email!</h2>
                                        <p className="text-base lg:text-lg opacity-90">We've sent a confirmation link to your email address. Please verify your account to continue.</p>
                                    </>
                                ) : (
                                    <>
                                        <h2 className="text-2xl lg:text-3xl font-bold mb-2">{t("auth.overlay.title")}</h2>
                                        <p className="text-base lg:text-lg opacity-90">{t("auth.overlay.subtitle")}</p>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

