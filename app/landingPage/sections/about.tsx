"use client"

import { motion } from "framer-motion"
import { BarChart3, Globe, Palette, ShieldCheck, Users, Zap } from "lucide-react"
import Image from "next/image"
import { useLanguage } from "@/contexts/language-context"

const features = [
    {
        icon: Globe,
        titleKey: "about.globalReach",
        descKey: "about.globalReachDesc"
    },
    {
        icon: BarChart3,
        titleKey: "about.advancedAnalytics",
        descKey: "about.advancedAnalyticsDesc"
    },
    {
        icon: Palette,
        titleKey: "about.designIntelligence",
        descKey: "about.designIntelligenceDesc"
    },
    {
        icon: ShieldCheck,
        titleKey: "about.secureReliable",
        descKey: "about.secureReliableDesc"
    },
    {
        icon: Users,
        titleKey: "about.communityDriven",
        descKey: "about.communityDrivenDesc"
    },
    {
        icon: Zap,
        titleKey: "about.lightningFast",
        descKey: "about.lightningFastDesc"
    }
]

export default function About() {
    const { t } = useLanguage()
    
    return (
        <section id="about" className="py-24 bg-[#0a0a0a] text-white overflow-hidden">
            <div className="container mx-auto px-6">

                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-20"
                >
                    <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">
                        {t("about.title")} <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">{t("about.titleHighlight")}</span>
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                        {t("about.subtitle")}
                    </p>
                </motion.div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* Features List */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                            >
                                <feature.icon className="w-10 h-10 text-purple-400 mb-4" />
                                <h3 className="text-xl font-semibold mb-2">{t(feature.titleKey)}</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">{t(feature.descKey)}</p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Image Composition */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative h-[600px] hidden lg:block"
                    >
                        <div className="absolute top-0 right-0 w-3/4 h-3/4 rounded-3xl overflow-hidden border border-white/10 shadow-2xl z-10">
                            <Image
                                src="/landindPictures/pexels-fauxels-3184635.jpg"
                                alt="Team Collaboration"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="absolute bottom-0 left-0 w-2/3 h-2/3 rounded-3xl overflow-hidden border border-white/10 shadow-2xl z-20">
                            <Image
                                src="/landindPictures/pexels-reneterp-1581384.jpg"
                                alt="Digital Workspace"
                                fill
                                className="object-cover"
                            />
                        </div>
                        {/* Decorative Elements */}
                        <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-purple-600/30 rounded-full blur-3xl -z-10" />
                        <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-blue-600/30 rounded-full blur-3xl -z-10" />
                    </motion.div>
                </div>
            </div>
        </section>
    )
}