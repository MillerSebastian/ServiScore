"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare, BarChart3, Layout, Zap, Shield, Users } from "lucide-react"

const features = [
    {
        title: "Chatbot Integration",
        description: "Automate customer support with our intelligent AI chatbot that handles common queries 24/7.",
        icon: MessageSquare,
        color: "text-pastel-blue",
    },
    {
        title: "Analytics Dashboard",
        description: "Gain deep insights into your service performance with real-time metrics and visual reports.",
        icon: BarChart3,
        color: "text-pastel-purple",
    },
    {
        title: "User-Friendly Interface",
        description: "Intuitive design that requires no training. Get your team up and running in minutes.",
        icon: Layout,
        color: "text-pastel-green",
    },
    {
        title: "Instant Feedback",
        description: "Collect and analyze customer feedback immediately after service completion.",
        icon: Zap,
        color: "text-pastel-yellow",
    },
    {
        title: "Secure Data",
        description: "Enterprise-grade security to keep your customer and business data safe and compliant.",
        icon: Shield,
        color: "text-pastel-pink",
    },
    {
        title: "Team Management",
        description: "Easily manage roles, permissions, and performance tracking for your entire team.",
        icon: Users,
        color: "text-blue-400",
    },
]

export default function FeaturesSection() {
    return (
        <section id="features" className="py-20 bg-muted/50">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
                    <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Key Features</h2>
                    <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                        Everything you need to elevate your service quality and customer satisfaction.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, index) => (
                        <Card key={index} className="border-none shadow-soft hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                            <CardHeader className="space-y-1">
                                <div className={`w-12 h-12 rounded-lg bg-background flex items-center justify-center mb-4 shadow-sm ${feature.color}`}>
                                    <feature.icon className="w-6 h-6" />
                                </div>
                                <CardTitle className="text-xl">{feature.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">{feature.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}
