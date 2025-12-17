"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowRight, CheckCircle } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export default function CTASection() {
    const { t } = useLanguage()

    return (
        <section className="container mx-auto px-6 py-20 bg-background">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative overflow-hidden bg-gradient-to-br from-pastel-blue/20 via-pastel-purple/10 to-background rounded-3xl p-12 md:p-16 text-center border border-border shadow-soft"
            >
                <div className="absolute inset-0 bg-grid-white/5 [mask-image:radial-gradient(white,transparent_85%)]" />
                <div className="relative z-10">
                    <Badge className="mb-6" variant="secondary">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        {t("landing.cta.noCredit")}
                    </Badge>
                    <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                        {t("landing.cta.title")}
                    </h2>
                    <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
                        {t("landing.cta.subtitle")}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button asChild size="lg" className="text-lg px-8 rounded-full shadow-lg hover:shadow-xl transition-all group">
                            <Link href="/login">
                                {t("landing.cta.getStarted")}
                                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </Button>
                        <Button
                            asChild
                            variant="outline"
                            size="lg"
                            className="text-lg px-8 rounded-full border-2"
                        >
                            <Link href="/services">{t("landing.cta.requestDemo")}</Link>
                        </Button>
                    </div>
                </div>
            </motion.div>
        </section>
    )
}
