"use client"

import { CheckCircle2 } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export default function BenefitsSection() {
    const { t } = useLanguage()
    
    const benefitKeys = [
        "landing.benefits.satisfaction",
        "landing.benefits.response",
        "landing.benefits.bottlenecks",
        "landing.benefits.empower",
        "landing.benefits.integrate",
        "landing.benefits.scale",
    ]
    return (
        <section id="benefits" className="py-20">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                                {t("landing.benefits.title")}
                            </h2>
                            <p className="text-muted-foreground md:text-xl/relaxed">
                                {t("landing.benefits.subtitle")}
                            </p>
                        </div>
                        <div className="grid gap-4">
                            {benefitKeys.map((key, index) => (
                                <div key={index} className="flex items-center gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-pastel-green shrink-0" />
                                    <span className="text-lg">{t(key)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="relative lg:h-[500px] rounded-2xl overflow-hidden bg-gradient-to-br from-pastel-blue/20 to-pastel-purple/20 p-8 flex items-center justify-center">
                        {/* Abstract visual representation */}
                        <div className="relative w-full max-w-sm aspect-square">
                            <div className="absolute inset-0 bg-white/40 backdrop-blur-xl rounded-2xl shadow-2xl transform rotate-3 transition-transform hover:rotate-0 duration-500" />
                            <div className="absolute inset-0 bg-white/60 backdrop-blur-xl rounded-2xl shadow-xl transform -rotate-3 transition-transform hover:rotate-0 duration-500 flex items-center justify-center p-8">
                                <div className="text-center space-y-4">
                                    <div className="text-6xl font-bold text-primary">98%</div>
                                    <div className="text-xl font-medium text-muted-foreground">{t("landing.benefits.satisfactionRate")}</div>
                                    <p className="text-sm text-muted-foreground">{t("landing.benefits.averageScore")}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
