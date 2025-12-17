"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ShieldCheck, Zap, DollarSign, MapPin, Star, Headphones } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export default function FeaturesSection() {
    const { t } = useLanguage()

    const features = [
        {
            title: t("landing.features.verified"),
            description: t("landing.features.verifiedDesc"),
            icon: ShieldCheck,
            color: "text-blue-500",
        },
        {
            title: t("landing.features.instant"),
            description: t("landing.features.instantDesc"),
            icon: Zap,
            color: "text-yellow-500",
        },
        {
            title: t("landing.features.payment"),
            description: t("landing.features.paymentDesc"),
            icon: DollarSign,
            color: "text-green-500",
        },
        {
            title: t("landing.features.local"),
            description: t("landing.features.localDesc"),
            icon: MapPin,
            color: "text-purple-500",
        },
        {
            title: t("landing.features.ratings"),
            description: t("landing.features.ratingsDesc"),
            icon: Star,
            color: "text-orange-500",
        },
        {
            title: t("landing.features.support"),
            description: t("landing.features.supportDesc"),
            icon: Headphones,
            color: "text-pink-500",
        },
    ]

    return (
        <section id="features" className="container mx-auto px-6 py-20 bg-background">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center mb-16"
            >
                <h2 className="text-4xl md:text-5xl font-bold mb-4">{t("landing.features.title")}</h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{t("landing.features.subtitle")}</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {features.map((feature, index) => {
                    const Icon = feature.icon
                    return (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                        >
                            <Card className="border-2 hover:border-primary/50 transition-all h-full group hover:shadow-lg">
                                <CardHeader>
                                    <div className={`w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                        <Icon className={`h-6 w-6 ${feature.color}`} />
                                    </div>
                                    <CardTitle>{feature.title}</CardTitle>
                                    <CardDescription className="text-base">{feature.description}</CardDescription>
                                </CardHeader>
                            </Card>
                        </motion.div>
                    )
                })}
            </div>
        </section>
    )
}
