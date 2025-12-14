"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare, BarChart3, Layout, Zap, Shield, Users } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export default function FeaturesSection() {
    const { t } = useLanguage()
    
    const features = [
        {
            titleKey: "landing.features.chatbot",
            descKey: "landing.features.chatbotDesc",
            icon: MessageSquare,
            color: "text-pastel-blue",
        },
        {
            titleKey: "landing.features.analytics",
            descKey: "landing.features.analyticsDesc",
            icon: BarChart3,
            color: "text-pastel-purple",
        },
        {
            titleKey: "landing.features.ui",
            descKey: "landing.features.uiDesc",
            icon: Layout,
            color: "text-pastel-green",
        },
        {
            titleKey: "landing.features.feedback",
            descKey: "landing.features.feedbackDesc",
            icon: Zap,
            color: "text-pastel-yellow",
        },
        {
            titleKey: "landing.features.security",
            descKey: "landing.features.securityDesc",
            icon: Shield,
            color: "text-pastel-pink",
        },
        {
            titleKey: "landing.features.team",
            descKey: "landing.features.teamDesc",
            icon: Users,
            color: "text-blue-400",
        },
    ]
    return (
        <section id="features" className="py-20 bg-muted/50">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
                    <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">{t("landing.features.title")}</h2>
                    <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                        {t("landing.features.subtitle")}
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, index) => (
                        <Card key={index} className="border-none shadow-soft hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                            <CardHeader className="space-y-1">
                                <div className={`w-12 h-12 rounded-lg bg-background flex items-center justify-center mb-4 shadow-sm ${feature.color}`}>
                                    <feature.icon className="w-6 h-6" />
                                </div>
                                <CardTitle className="text-xl">{t(feature.titleKey)}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">{t(feature.descKey)}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}
