"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { useLanguage } from "@/contexts/language-context"

export default function Hero() {
    const { t } = useLanguage()
    
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
            {/* Background Gradient/Image Overlay */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-background to-background z-10" />
                <Image
                    src="/landindPictures/pexels-bohlemedia-1884581.jpg"
                    alt="Hero Background"
                    fill
                    className="object-cover opacity-30"
                    priority
                />
            </div>

            <div className="container relative z-10 mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center h-full pt-20">
                {/* Left Column: Big Title */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="flex justify-center md:justify-start"
                >
                    <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500 text-left leading-tight">
                        Servi<br />Score
                    </h1>
                </motion.div>

                {/* Right Column: Summary */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                    className="flex flex-col space-y-6"
                >
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                        {t("landing.hero.subtitle")}
                    </h2>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-lg leading-relaxed">
                        {t("landing.hero.description")}
                    </p>
                    
                    {/* Social Proof Stats */}
                    <div className="grid grid-cols-3 gap-4 py-4">
                        <div>
                            <div className="text-3xl font-bold">5K+</div>
                            <div className="text-sm text-muted-foreground">{t("landing.hero.stats.users")}</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold">10K+</div>
                            <div className="text-sm text-muted-foreground">{t("landing.hero.stats.services")}</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold">4.8★</div>
                            <div className="text-sm text-muted-foreground">{t("landing.hero.stats.rating")}</div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 pt-2">
                        <Button asChild size="lg" className="rounded-full text-lg px-8 transition-all shadow-lg hover:shadow-xl">
                            <Link href="/login">{t("landing.hero.getStarted")}</Link>
                        </Button>
                        <Button asChild variant="outline" size="lg" className="rounded-full text-lg px-8 transition-all">
                            <Link href="#features">{t("landing.hero.learnMore")}</Link>
                        </Button>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}