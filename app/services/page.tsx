"use client"

import { useState, useEffect, useMemo } from "react"
import { useSelector } from "react-redux"
import type { RootState } from "@/lib/store"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Calendar } from "lucide-react"
import Link from "next/link"
import { PostServiceModal } from "@/components/post-service-modal"
import { ServicesFilter, type FilterState } from "@/components/services-filter"
import { ServicesSearch } from "@/components/services-search"
import { motion } from "framer-motion"
import { ServiceCardSkeletonGrid } from "@/components/service-card-skeleton"
import { useLanguage } from "@/contexts/language-context"

export default function ServicesPage() {
  const services = useSelector((state: RootState) => state.services.items)
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState<FilterState>({
    category: "all",
    minPrice: 0,
    maxPrice: 500,
    location: "all",
    status: "all",
  })
  const { t } = useLanguage()

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      const matchesSearch =
        service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.creatorName.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesCategory = filters.category === "all" || service.category.toLowerCase() === filters.category.toLowerCase()

      const matchesPrice = service.price >= filters.minPrice && service.price <= filters.maxPrice

      const matchesLocation = filters.location === "all" || service.location === filters.location

      const matchesStatus = filters.status === "all" || service.status === filters.status

      return matchesSearch && matchesCategory && matchesPrice && matchesLocation && matchesStatus
    })
  }, [services, searchQuery, filters])

  const handleResetFilters = () => {
    setFilters({
      category: "all",
      minPrice: 0,
      maxPrice: 500,
      location: "all",
      status: "all",
    })
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (

    
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-6 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">{t("services.title")}</h1>
            <p className="text-muted-foreground">{t("services.subtitle")}</p>
          </div>
          <div className="flex gap-2">
            <ServicesFilter filters={filters} onFilterChange={setFilters} onReset={handleResetFilters} />
            <PostServiceModal />
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <ServicesSearch value={searchQuery} onChange={setSearchQuery} />
          {filteredServices.length > 0 && (
            <p className="text-sm text-muted-foreground">
              {filteredServices.length} {filteredServices.length === 1 ? "service" : "services"} found
            </p>
          )}
        </div>
      </div>
      {isLoading ? (
        <ServiceCardSkeletonGrid count={4} />
      ) : (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {filteredServices.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground text-lg">No services found matching your criteria</p>
              <p className="text-sm text-muted-foreground mt-2">Try adjusting your filters or search terms</p>
            </div>
          ) : (
            filteredServices.map((service) => (
            <motion.div key={service.id} variants={item}>
              <Link href={`/services/${service.id}`}>
                <Card className="h-full hover:border-pastel-blue/50 transition-all duration-200 shadow-soft border border-transparent bg-card">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-full overflow-hidden bg-muted border-2 border-white shadow-sm">
                          <img
                            src={service.creatorAvatar || "/placeholder.svg"}
                            alt={service.creatorName}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-bold text-foreground">{service.creatorName}</p>
                          <Badge
                            variant="secondary"
                            className="text-[10px] mt-1 bg-pastel-purple/20 text-purple-700 dark:text-purple-400 hover:bg-pastel-purple/30 border-purple-500/20"
                          >
                            {service.category}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="block text-2xl font-bold text-primary">
                          ${service.price}
                        </span>
                        <span className="text-xs text-muted-foreground">{t("services.fixedPrice")}</span>
                      </div>
                    </div>

                    <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                    <p className="text-muted-foreground text-sm mb-6 line-clamp-2">{service.description}</p>

                    <div className="flex items-center justify-between pt-4 border-t border-border/50">
                      <div className="flex gap-4 text-xs text-muted-foreground font-medium">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> {service.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" /> {service.date}
                        </span>
                      </div>
                      <Badge
                        variant={service.status === "Open" ? "default" : "secondary"}
                        className={
                          service.status === "Open"
                            ? "bg-pastel-green/30 text-green-700 hover:bg-pastel-green/40 dark:text-green-400 border-green-500/20"
                            : "bg-muted/50 text-muted-foreground"
                        }
                      >
                        {service.status === "Open" ? t("services.status.open") : service.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))
          )}
        </motion.div>
      )}
    </div>
  )
}
