"use client"

import Link from "next/link"
import { useSelector } from "react-redux"
import type { RootState } from "@/lib/store"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin, ArrowRight, Plus } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { useState, useEffect } from "react"
import ChatbaseWidget from "@/components/ChatbaseWidget";
import { Skeleton } from "@/components/ui/skeleton"



export default function HomePage() {
  const services = useSelector((state: RootState) => state.services.items)
  const { t } = useLanguage()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="container mx-auto px-4 py-8 space-y-12 animate-in fade-in duration-700">
      {/* Hero Section */}
      <section className="text-center space-y-4 py-8">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">{t("home.hero.title")}</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t("home.hero.subtitle")}</p>
      </section>
      <>
        <ChatbaseWidget />
      </>

      {/* Recent Services */}

      {/* Recent Services */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">{t("home.services.title")}</h2>
          <Link href="/services" className="text-primary font-medium flex items-center hover:underline">
            {t("home.services.title")} <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {isLoading
            ? Array(4)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="h-[150px] w-full rounded-xl" />
                </div>
              ))
            : services.slice(0, 4).map((service) => (
              <Link key={service.id} href={`/services/${service.id}`}>
                <Card className="h-full hover:bg-muted/30 transition-colors border-none shadow-soft">
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-200">
                          <img
                            src={service.creatorAvatar || "/placeholder.svg"}
                            alt={service.creatorName}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{service.creatorName}</p>
                          <p className="text-xs text-muted-foreground">
                            {t("service.posted")} {service.date}
                          </p>
                        </div>
                      </div>
                      <Badge variant="pastel" className="text-primary-foreground bg-pastel-blue">
                        ${service.price}
                      </Badge>
                    </div>
                    <h3 className="font-bold text-lg mb-2">{service.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4 flex-1">{service.description}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-auto">
                      <MapPin className="h-3 w-3" />
                      {service.location}
                      <span className="mx-1">•</span>
                      <span className={service.status === "Open" ? "text-green-600 font-medium" : "text-gray-500"}>
                        {service.status}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
        </div>
      </section>
    </div>
  )
}
