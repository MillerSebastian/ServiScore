"use client"

import { motion } from "framer-motion"
import { Search, ArrowUp, User, Key, CreditCard, ArrowDown, Briefcase } from "lucide-react"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const topics = [
    {
        icon: ArrowUp,
        title: "Sending money",
        description: "Setting up, paying for, editing, and cancelling transfers."
    },
    {
        icon: User,
        title: "Managing your account",
        description: "Setting up your account and getting verified."
    },
    {
        icon: Key,
        title: "Holding money",
        description: "Holding balances, setting up Direct Debits, and using Interest & Stocks."
    },
    {
        icon: CreditCard,
        title: "Wise card",
        description: "Ordering, activating, spending, and troubleshooting."
    },
    {
        icon: ArrowDown,
        title: "Receiving money",
        description: "Using your account details to receive money."
    },
    {
        icon: Briefcase,
        title: "Wise Business",
        description: "Multi-user access, accounting and using our API."
    }
]

export default function SupportSection() {
    return (
        <section className="relative min-h-screen flex flex-col items-center justify-center py-20 overflow-hidden bg-[#0a0a0a] text-white">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-black/80 z-10" />
                <Image
                    src="/landindPictures/pexels-diimejii-2696299.jpg"
                    alt="Support Background"
                    fill
                    className="object-cover opacity-50"
                    priority
                />
            </div>

            <div className="container relative z-10 mx-auto px-4 flex flex-col items-center max-w-5xl">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12 w-full max-w-2xl"
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-8 tracking-tight">
                        Hi, how can we help?
                    </h2>

                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <Input
                            type="text"
                            placeholder="Search for articles"
                            className="w-full pl-12 py-6 rounded-full bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:bg-white/20 transition-all text-lg"
                        />
                    </div>
                </motion.div>

                {/* Topics Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="w-full"
                >
                    <h3 className="text-xl font-semibold mb-6 text-left w-full pl-2">Explore all topics</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {topics.map((topic, index) => (
                            <motion.div
                                key={index}
                                whileHover={{ scale: 1.02, backgroundColor: "rgba(255, 255, 255, 0.1)" }}
                                className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 flex flex-col items-center text-center border border-white/10 cursor-pointer transition-colors group"
                            >
                                <div className="bg-white/10 p-4 rounded-full mb-6 group-hover:bg-white/20 transition-colors">
                                    <topic.icon className="h-6 w-6 text-white" />
                                </div>
                                <h4 className="text-lg font-semibold mb-3">{topic.title}</h4>
                                <p className="text-sm text-gray-400 leading-relaxed">
                                    {topic.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Contact Footer */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="mt-16 flex flex-col sm:flex-row items-center gap-4"
                >
                    <span className="text-lg text-gray-300">Still need help?</span>
                    <Button
                        variant="outline"
                        size="lg"
                        className="rounded-full px-8 border-white/20 text-white hover:bg-white hover:text-black transition-all"
                    >
                        Contact us
                    </Button>
                </motion.div>
            </div>
        </section>
    )
}
