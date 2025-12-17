"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin } from "lucide-react"
import Link from "next/link"
import { PostServiceModal } from "@/components/post-service-modal"
import { ServicesFilter, type FilterState } from "@/components/services-filter"
import { ServicesSearch } from "@/components/services-search"
import { motion } from "framer-motion"
import { ServiceCardSkeletonGrid } from "@/components/service-card-skeleton"
import { useLanguage } from "@/contexts/language-context"
import { servicesService, Service } from "@/lib/services/services.service"
import { serviceCategoriesService, ServiceCategory } from "@/lib/services/service-categories.service"

// Status mapping
const statusMap: Record<number, string> = {
  1: "Open",
  2: "Closed",
  3: "Pending",
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [categories, setCategories] = useState<ServiceCategory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState<FilterState>({
    category: "all",
    minPrice: 0,
    maxPrice: 1000000,
    location: "all",
    status: "all",
  })
  const { t } = useLanguage()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesData, categoriesData] = await Promise.all([
          servicesService.getAll(),
          serviceCategoriesService.getAll()
        ])
        setServices(servicesData)
        setCategories(categoriesData)
      } catch (error) {
        console.error('Failed to fetch data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const categoryMap = useMemo(() => {
    return categories.reduce((acc, cat) => {
      acc[cat.id] = cat.name
      return acc
    }, {} as Record<number, string>)
  }, [categories])

  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      const title = service.service_title || ""
      const description = service.service_description || ""
      const category = categoryMap[service.service_category_id] || ""
      const price = service.service_price || 0
      const status = statusMap[service.status_id] || ""

      const matchesSearch =
        title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        description.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesCategory = filters.category === "all" || category.toLowerCase() === filters.category.toLowerCase()

      const matchesPrice = price >= filters.minPrice && price <= filters.maxPrice

      const matchesStatus = filters.status === "all" || status === filters.status

      return matchesSearch && matchesCategory && matchesPrice && matchesStatus
    })
  }, [services, searchQuery, filters])

  const handleResetFilters = () => {
    setFilters({
      category: "all",
      minPrice: 0,
      maxPrice: 1000000,
      location: "all",
      status: "all",
    })
  }

  const handleServiceCreated = (newService: any) => {
    // Add the new service to the list dynamically
    setServices(prev => [newService, ...prev])
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
            <ServicesFilter filters={filters} onFilterChange={setFilters} onReset={handleResetFilters} categories={categories} />
            <PostServiceModal onServiceCreated={handleServiceCreated} />
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
            filteredServices.map((service) => {
              const category = categoryMap[service.service_category_id] || "Other"
              const status = statusMap[service.status_id] || "Unknown"
              const dateStr = service.createdAt 
                ? new Date(service.createdAt).toLocaleDateString() 
                : "-"
              
              return (
                <motion.div key={service.id} variants={item}>
                  <Link href={`/services/${service.id}`}>
                    <Card className="h-full hover:border-pastel-blue/50 transition-all duration-200 shadow-soft border border-transparent bg-card">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded-full overflow-hidden bg-muted border-2 border-white shadow-sm flex items-center justify-center">
                              <span className="text-lg font-bold text-muted-foreground">
                                {(service.service_title || "S")[0].toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <p className="font-bold text-foreground">Service #{service.id}</p>
                              <Badge
                                variant="secondary"
                                className="text-[10px] mt-1 bg-pastel-purple/20 text-purple-700 dark:text-purple-400 hover:bg-pastel-purple/30 border-purple-500/20"
                              >
                                {category}
                              </Badge>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="block text-2xl font-bold text-primary">
                              ${service.service_price || 0}
                            </span>
                            <span className="text-xs text-muted-foreground">{t("services.fixedPrice")}</span>
                          </div>
                        </div>

                        <h3 className="text-xl font-bold mb-3">{service.service_title || "Untitled"}</h3>
                        <p className="text-muted-foreground text-sm mb-6 line-clamp-2">{service.service_description || "No description"}</p>

                        <div className="flex items-center justify-between pt-4 border-t border-border/50">
                          <div className="flex gap-4 text-xs text-muted-foreground font-medium">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" /> {dateStr}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" /> {service.service_location || "Remote"}
                            </span>
                          </div>
                          <Badge
                            variant={status === "Open" ? "default" : "secondary"}
                            className={
                              status === "Open"
                                ? "bg-pastel-green/30 text-green-700 hover:bg-pastel-green/40 dark:text-green-400 border-green-500/20"
                                : "bg-muted/50 text-muted-foreground"
                            }
                          >
                            {status === "Open" ? t("services.status.open") : status}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              )
            })
          )}
        </motion.div>
      )}
    </div>
  )
}
