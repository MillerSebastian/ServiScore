"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

export default function LandingTopbar() {
    return (
        <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute top-0 left-0 right-0 z-50 w-full p-6"
        >
            <div className="container mx-auto flex items-center justify-between">
                <Link href="/landingPage" className="flex items-center gap-2">
                    <span className="text-2xl font-bold tracking-tight text-white">ServiScore</span>
                </Link>

                <Button asChild className="rounded-full bg-white text-black hover:bg-gray-200 transition-all font-medium px-6">
                    <Link href="/login">Get Started</Link>
                </Button>
            </div>
        </motion.header>
    )
}
