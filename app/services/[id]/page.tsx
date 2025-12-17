"use client"

import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Calendar, DollarSign, CheckCircle, User, ArrowLeft, Clock } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"
import { useState, useEffect } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { servicesService, Service } from "@/lib/services/services.service"
import { serviceCategoriesService, ServiceCategory } from "@/lib/services/service-categories.service"

export default function ServiceDetailPage() {
  const params = useParams()
  const { t } = useLanguage()
  const [service, setService] = useState<Service | null>(null)
  const [category, setCategory] = useState<ServiceCategory | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchServiceData = async () => {
      try {
        setIsLoading(true)
        const serviceData = await servicesService.getById(params.id as string)
        setService(serviceData)
        
        if (serviceData.service_category_id) {
          const categoryData = await serviceCategoriesService.getById(serviceData.service_category_id)
          setCategory(categoryData)
        }
      } catch (err) {
        console.error('Failed to fetch service:', err)
        setError('Failed to load service')
      } finally {
        setIsLoading(false)
      }
    }
    
    if (params.id) {
      fetchServiceData()
    }
  }, [params.id])

  if (!service && !isLoading) return <div className="p-8 text-center">{t("service.notFound")}</div>

  const currentUserId = typeof window !== 'undefined' ? localStorage.getItem('user_id') : null
  const isCreator = currentUserId && service ? Number(currentUserId) === service.user_id : false

  const handleApply = () => {
    // TODO: Implement apply functionality with backend
    console.log('Apply to service:', service?.id)
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center">
          <p className="text-destructive">{error}</p>
          <Link href="/services" className="text-primary hover:underline mt-4 inline-block">
            Back to services
          </Link>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl animate-pulse">
        <div className="mb-6">
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <Skeleton className="h-[400px] w-full rounded-3xl" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-[300px] w-full rounded-xl" />
          </div>
        </div>
      </div>
    )
  }

  if (!service) return null

  const formattedDate = service.service_datetime 
    ? new Date(service.service_datetime).toLocaleDateString()
    : 'N/A'
  const createdDate = service.createdAt
    ? new Date(service.createdAt).toLocaleDateString()
    : 'N/A'

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl animate-in fade-in duration-500">
      <div className="mb-6">
        <Link
          href="/services"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> {t("service.back")}
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-card text-card-foreground p-8 rounded-3xl shadow-soft border border-border/50">
            <div className="flex justify-between items-start mb-6">
              <Badge className="bg-pastel-purple/20 text-purple-800 dark:text-purple-300 hover:bg-pastel-purple/30 border-none px-3 py-1">
                {category?.name || 'Uncategorized'}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {t("service.posted")} {createdDate}
              </span>
            </div>

            <h1 className="text-3xl font-bold mb-4">{service.service_title}</h1>

            <div className="flex flex-wrap gap-4 mb-8">
              <div className="flex items-center gap-2 bg-pastel-green/20 px-3 py-2 rounded-lg text-sm font-medium">
                <DollarSign className="h-4 w-4 text-green-600 dark:text-green-400" />${service.service_price}
              </div>
              <div className="flex items-center gap-2 bg-pastel-blue/20 px-3 py-2 rounded-lg text-sm font-medium">
                <MapPin className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                {service.service_location}
              </div>
              <div className="flex items-center gap-2 bg-pastel-yellow/20 px-3 py-2 rounded-lg text-sm font-medium">
                <Calendar className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                {formattedDate}
              </div>
            </div>

            <div className="prose prose-sm max-w-none text-muted-foreground">
              <h3 className="text-foreground font-bold text-lg mb-2">{t("service.description")}</h3>
              <p>{service.service_description}</p>
            </div>
          </div>

          {/* Service Status */}
          <div className="bg-card text-card-foreground p-6 rounded-3xl shadow-soft border border-border/50">
            <h3 className="font-bold text-lg mb-4">Service Information</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge variant={service.service_is_active ? "default" : "secondary"}>
                  {service.service_is_active ? "Active" : "Inactive"}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Service ID</span>
                <span className="text-sm font-medium">#{service.id}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Provider ID</span>
                <span className="text-sm font-medium">#{service.user_id}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Service Provider Card */}
          <Card className="border-none shadow-soft overflow-hidden bg-card text-card-foreground">
            <div className="bg-pastel-blue/20 h-20"></div>
            <CardContent className="relative pt-0 pb-6 px-6 text-center">
              <div className="h-20 w-20 rounded-full border-4 border-background bg-background mx-auto -mt-10 mb-3 overflow-hidden shadow-sm flex items-center justify-center">
                <User className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="font-bold text-lg">Service Provider</h3>
              <p className="text-sm text-muted-foreground mb-4">User ID: {service.user_id}</p>
              <div className="flex justify-center gap-4 text-sm mb-6">
                <div className="text-center">
                  <span className="block font-bold">-</span>
                  <span className="text-xs text-muted-foreground">{t("service.rating")}</span>
                </div>
                <div className="text-center">
                  <span className="block font-bold">-</span>
                  <span className="text-xs text-muted-foreground">{t("service.jobs")}</span>
                </div>
              </div>
              <Button className="w-full bg-transparent" variant="outline">
                {t("service.viewProfile")}
              </Button>
            </CardContent>
          </Card>

          {/* Action Button */}
          {!isCreator && (
            <Card className="border-none shadow-soft bg-pastel-blue/10 dark:bg-pastel-blue/5">
              <CardContent className="p-6">
                <h3 className="font-bold mb-2">{t("service.interested")}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Contact the service provider to get started
                </p>
                <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90" onClick={handleApply}>
                  {t("service.apply")}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
