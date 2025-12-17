"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Users, Briefcase } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export default function BenefitsSection() {
    const { t } = useLanguage()

    const customerBenefits = [
        t("landing.benefits.save"),
        t("landing.benefits.fast"),
        t("landing.benefits.trust"),
    ]

    const providerBenefits = [
        t("landing.benefits.earn"),
        t("landing.benefits.grow"),
        t("landing.benefits.tools"),
    ]

    const stats = [
        { value: t("landing.benefits.stat1"), label: t("landing.benefits.stat1Label") },
        { value: t("landing.benefits.stat2"), label: t("landing.benefits.stat2Label") },
        { value: t("landing.benefits.stat3"), label: t("landing.benefits.stat3Label") },
    ]
    return (
        <section id="benefits" className="container mx-auto px-6 py-20 bg-muted/30">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center mb-16"
            >
                <h2 className="text-4xl md:text-5xl font-bold mb-4">{t("landing.benefits.title")}</h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">{t("landing.benefits.subtitle")}</p>
            </motion.div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                {stats.map((stat, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        className="text-center"
                    >
                        <div className="text-5xl md:text-6xl font-bold text-primary mb-2">{stat.value}</div>
                        <div className="text-muted-foreground">{stat.label}</div>
                    </motion.div>
                ))}
            </div>

            {/* Benefits Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <Card className="h-full">
                        <CardHeader>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 rounded-lg bg-blue-500/10">
                                    <Users className="h-6 w-6 text-blue-500" />
                                </div>
                                <CardTitle className="text-2xl">{t("landing.benefits.forCustomers")}</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {customerBenefits.map((benefit, index) => (
                                <div key={index} className="flex items-start gap-3">
                                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                                    <p className="text-muted-foreground">{benefit}</p>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <Card className="h-full">
                        <CardHeader>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 rounded-lg bg-purple-500/10">
                                    <Briefcase className="h-6 w-6 text-purple-500" />
                                </div>
                                <CardTitle className="text-2xl">{t("landing.benefits.forProviders")}</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {providerBenefits.map((benefit, index) => (
                                <div key={index} className="flex items-start gap-3">
                                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                                    <p className="text-muted-foreground">{benefit}</p>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </section>
    )
}
