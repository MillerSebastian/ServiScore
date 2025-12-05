"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { LoginForm } from "./LoginForm"
import { RegisterForm } from "./RegisterForm"
import Image from "next/image"
import { useLanguage } from "@/contexts/language-context"

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true)
    const { t } = useLanguage()

    const toggleAuth = () => setIsLogin(!isLogin)

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
            <div className="relative w-full max-w-[1000px] h-[600px] bg-card rounded-3xl shadow-2xl overflow-hidden flex">

                {/* Register Form (Left Side) */}
                <div className="w-1/2 h-full flex items-center justify-center p-8">
                    <RegisterForm onToggle={toggleAuth} />
                </div>

                {/* Login Form (Right Side) */}
                <div className="w-1/2 h-full flex items-center justify-center p-8">
                    <LoginForm onToggle={toggleAuth} />
                </div>

                {/* Sliding Overlay (Image) */}
                <motion.div
                    initial={false}
                    animate={{ x: isLogin ? "0%" : "100%" }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="absolute top-0 left-0 w-1/2 h-full z-10"
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

                        <div className="absolute inset-0 bg-black/40 flex flex-col justify-between p-8 text-white">
                            <div className="flex justify-between items-center">
                                <span className="text-2xl font-bold">ServiScore</span>
                                <button onClick={toggleAuth} className="text-sm bg-white/20 backdrop-blur-md px-4 py-2 rounded-full hover:bg-white/30 transition flex items-center gap-2">
                                    {isLogin ? t("auth.createAccount") : t("auth.login")} &rarr;
                                </button>
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold mb-2">{t("auth.overlay.title")}</h2>
                                <p className="text-lg opacity-90">{t("auth.overlay.subtitle")}</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

