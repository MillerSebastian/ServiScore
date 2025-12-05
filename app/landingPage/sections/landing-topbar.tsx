"use client"

import Link from "next/link"
import { motion } from "framer-motion"

export default function LandingTopbar() {
    const navLinks = [
        { name: "Features", href: "#features" },
        { name: "Benefits", href: "#benefits" },
        { name: "About", href: "#about" },
        { name: "Testimonials", href: "#testimonials" },
        { name: "Support", href: "#support" },
    ]

    return (
        <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute top-0 left-0 right-0 z-50 w-full p-6"
        >
            <div className="container mx-auto flex items-center justify-between">
                <Link href="/landingPage" className="flex items-center gap-2">
                    <span className="text-2xl font-bold tracking-tight text-white">SS</span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-sm font-medium text-white/80 transition-colors hover:text-white"
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>
            </div>
        </motion.header>
    )
}
