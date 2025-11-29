"use client"

import Link from "next/link"
import { useSelector } from "react-redux"
import type { RootState } from "@/lib/store"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin, ArrowRight, Plus } from "lucide-react"
import { AddStoreModal } from "@/components/add-store-modal"
import { useLanguage } from "@/contexts/language-context"
import { useState, useEffect } from "react"
import { Skeleton } from "@/components/ui/skeleton"

export default function HomePage() {
  const stores = useSelector((state: RootState) => state.stores.items)
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

      {/* Top Rated Stores */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">{t("home.stores.title")}</h2>
          <div className="flex items-center gap-4">
            <AddStoreModal
              trigger={
                <Button size="sm" className="bg-pastel-blue text-blue-900 hover:bg-pastel-blue/80">
                  <Plus className="mr-2 h-4 w-4" /> {t("home.stores.upload")}
                </Button>
              }
            />
            <Link href="/stores" className="text-primary font-medium flex items-center hover:underline">
              {t("home.stores.viewAll")} <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading
            ? Array(3)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="h-[200px] w-full rounded-xl" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                </div>
              ))
            : stores.slice(0, 3).map((store) => (
              <Link key={store.id} href={`/stores/${store.id}`}>
                <Card className="h-full overflow-hidden hover:scale-[1.02] transition-transform duration-200 border-none shadow-soft">
                  <div className="aspect-video relative bg-muted">
                    <img
                      src={store.image || "/placeholder.svg"}
                      alt={store.name}
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1 text-xs font-bold shadow-sm text-black">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      {store.rating}
                    </div>
                  </div>
                  <CardContent className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-lg">{store.name}</h3>
                      <Badge variant="secondary" className="text-[10px]">
                        {store.category}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{store.description}</p>
                    <div className="text-xs text-muted-foreground">
                      {store.reviewCount} {t("home.reviews")}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
        </div>
      </section>

      {/* Recent Services */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">{t("home.services.title")}</h2>
          <Link href="/services" className="text-primary font-medium flex items-center hover:underline">
            {t("home.stores.viewAll")} <ArrowRight className="ml-1 h-4 w-4" />
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
