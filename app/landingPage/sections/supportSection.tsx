"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search, ArrowUp, User, Key, CreditCard, ArrowDown, Briefcase } from "lucide-react"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"

declare global {
    interface Window {
        chatbase?: any
    }
}

export default function SupportSection() {
    const { t } = useLanguage()
    const [searchQuery, setSearchQuery] = useState("")
    
    const handleContactClick = () => {
        if (typeof window !== 'undefined' && window.chatbase) {
            window.chatbase('open')
        }
    }
    
    const handleTopicClick = (topicTitle: string) => {
        if (typeof window !== 'undefined' && window.chatbase) {
            window.chatbase('open')
            setTimeout(() => {
                window.chatbase('sendMessage', `Necesito ayuda con: ${topicTitle}`)
            }, 500)
        }
    }
    
    const topics = [
        {
            icon: ArrowUp,
            titleKey: "support.sendingMoney",
            descKey: "support.sendingMoneyDesc"
        },
        {
            icon: User,
            titleKey: "support.managingAccount",
            descKey: "support.managingAccountDesc"
        },
        {
            icon: Key,
            titleKey: "support.holdingMoney",
            descKey: "support.holdingMoneyDesc"
        },
        {
            icon: CreditCard,
            titleKey: "support.wiseCard",
            descKey: "support.wiseCardDesc"
        },
        {
            icon: ArrowDown,
            titleKey: "support.receivingMoney",
            descKey: "support.receivingMoneyDesc"
        },
        {
            icon: Briefcase,
            titleKey: "support.wiseBusiness",
            descKey: "support.wiseBusinessDesc"
        }
    ]
    
    const filteredTopics = topics.filter(topic => {
        const title = t(topic.titleKey).toLowerCase()
        const desc = t(topic.descKey).toLowerCase()
        const query = searchQuery.toLowerCase()
        return title.includes(query) || desc.includes(query)
    })
    
    return (
        <section id="support" className="relative min-h-screen flex flex-col items-center justify-center py-20 overflow-hidden bg-background">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-background/80 z-10" />
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
                        {t("support.title")}
                    </h2>

                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                        <Input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder={t("support.searchPlaceholder")}
                            className="w-full pl-12 py-6 rounded-full bg-secondary/50 border-border placeholder:text-muted-foreground focus:bg-secondary transition-all text-lg"
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
                    <h3 className="text-xl font-semibold mb-6 text-left w-full pl-2">{t("support.exploreTopics")}</h3>
                    {filteredTopics.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredTopics.map((topic, index) => (
                                <motion.div
                                    key={index}
                                    whileHover={{ scale: 1.02 }}
                                    onClick={() => handleTopicClick(t(topic.titleKey))}
                                    className="bg-secondary/30 hover:bg-secondary/50 backdrop-blur-sm rounded-2xl p-8 flex flex-col items-center text-center border border-border cursor-pointer transition-colors group"
                                >
                                    <div className="bg-primary/10 p-4 rounded-full mb-6 group-hover:bg-primary/20 transition-colors">
                                        <topic.icon className="h-6 w-6 text-primary" />
                                    </div>
                                    <h4 className="text-lg font-semibold mb-3">{t(topic.titleKey)}</h4>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        {t(topic.descKey)}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground text-lg">
                                {t("support.noResults") || "No se encontraron resultados para tu búsqueda"}
                            </p>
                        </div>
                    )}
                </motion.div>

                {/* Contact Footer */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="mt-16 flex flex-col sm:flex-row items-center gap-4"
                >
                    <span className="text-lg">{t("support.stillNeedHelp")}</span>
                    <Button
                        variant="outline"
                        size="lg"
                        onClick={handleContactClick}
                        className="rounded-full px-8 transition-all"
                    >
                        {t("support.contactUs")}
                    </Button>
                </motion.div>
            </div>
        </section>
    )
}
