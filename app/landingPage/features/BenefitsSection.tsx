"use client"

import { CheckCircle2 } from "lucide-react"

const benefits = [
    "Boost customer satisfaction scores by up to 40%",
    "Reduce response times with automated workflows",
    "Identify service bottlenecks before they become problems",
    "Empower your team with actionable performance data",
    "Seamlessly integrate with your existing tools",
    "Scale your operations without compromising quality",
]

export default function BenefitsSection() {
    return (
        <section id="benefits" className="py-20">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                                Why Choose ServiScore?
                            </h2>
                            <p className="text-muted-foreground md:text-xl/relaxed">
                                We help businesses transform their service delivery from good to exceptional. Here's how we make a difference:
                            </p>
                        </div>
                        <div className="grid gap-4">
                            {benefits.map((benefit, index) => (
                                <div key={index} className="flex items-center gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-pastel-green shrink-0" />
                                    <span className="text-lg">{benefit}</span>
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
                                    <div className="text-xl font-medium text-muted-foreground">Customer Satisfaction Rate</div>
                                    <p className="text-sm text-muted-foreground">Average score across all ServiScore partners</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
