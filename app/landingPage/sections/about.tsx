"use client"

import { motion } from "framer-motion"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Target, Eye } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export default function About() {
    const { t } = useLanguage()
    
    return (
        <section id="about" className="container mx-auto px-6 py-20 bg-background">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center mb-16"
            >
                <h2 className="text-4xl md:text-5xl font-bold mb-4">{t("landing.about.title")}</h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">{t("landing.about.subtitle")}</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <Card className="h-full border-2">
                        <CardHeader>
                            <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4">
                                <Target className="h-6 w-6 text-blue-500" />
                            </div>
                            <CardTitle className="text-2xl">{t("landing.about.mission")}</CardTitle>
                            <CardDescription className="text-base pt-2">
                                {t("landing.about.missionDesc")}
                            </CardDescription>
                        </CardHeader>
                    </Card>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <Card className="h-full border-2">
                        <CardHeader>
                            <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center mb-4">
                                <Eye className="h-6 w-6 text-purple-500" />
                            </div>
                            <CardTitle className="text-2xl">{t("landing.about.vision")}</CardTitle>
                            <CardDescription className="text-base pt-2">
                                {t("landing.about.visionDesc")}
                            </CardDescription>
                        </CardHeader>
                    </Card>
                </motion.div>
            </div>
        </section>
    )
}