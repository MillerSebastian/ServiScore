"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export default function TextsSection() {
    return (
        <section className="relative py-20 md:py-32 overflow-hidden">
            <div className="container px-4 md:px-6 relative z-10">
                <div className="flex flex-col items-center text-center space-y-8 max-w-3xl mx-auto">
                    <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
                        New Feature: AI Analytics
                    </div>

                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent pb-2">
                        Revolutionize Your Service Scores with ServiScore
                    </h1>

                    <p className="text-xl text-muted-foreground max-w-[42rem] leading-normal sm:text-2xl sm:leading-8">
                        The all-in-one platform to manage, track, and improve your service quality with real-time analytics and customer feedback.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                        <Link href="/signup">
                            <Button size="lg" className="w-full sm:w-auto bg-pastel-blue text-blue-900 hover:bg-pastel-blue/80 text-lg px-8">
                                Get Started
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                        <Link href="#features">
                            <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg px-8">
                                Learn More
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Background decoration */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-pastel-blue/20 rounded-full blur-3xl -z-10 opacity-50 pointer-events-none" />
        </section>
    )
}
