"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

export default function Hero() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0a0a0a] text-white">
            {/* Background Gradient/Image Overlay */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-black z-10" />
                <Image
                    src="/landindPictures/pexels-bohlemedia-1884581.jpg"
                    alt="Hero Background"
                    fill
                    className="object-cover opacity-30"
                    priority
                />
            </div>

            <div className="container relative z-10 mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center h-full pt-20">
                {/* Left Column: Big Title */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="flex justify-center md:justify-start"
                >
                    <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500 text-left leading-tight">
                        Servi<br />Score
                    </h1>
                </motion.div>

                {/* Right Column: Summary */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                    className="flex flex-col space-y-6"
                >
                    <h2 className="text-xl md:text-2xl font-light tracking-wide text-gray-300">
                        Welcome to the future of service
                    </h2>
                    <p className="text-lg md:text-xl text-gray-400 max-w-lg leading-relaxed">
                        Connect, collaborate, and grow with ServiScore. We provide the tools you need to elevate your business and reach your community effectively.
                    </p>
                    <div className="flex gap-4 pt-4">
                        <Button asChild size="lg" className="rounded-full text-lg px-8 bg-white text-black hover:bg-gray-200 transition-all">
                            <Link href="/login">Get Started</Link>
                        </Button>
                        <Button asChild variant="outline" size="lg" className="rounded-full text-lg px-8 border-white/20 text-white hover:bg-white/10 transition-all">
                            <Link href="/about">Learn More</Link>
                        </Button>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}