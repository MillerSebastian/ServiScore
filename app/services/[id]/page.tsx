"use client"

import { useParams } from "next/navigation"
import { useSelector, useDispatch } from "react-redux"
import { type RootState, applyToService } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Calendar, DollarSign, CheckCircle, User, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"
import { useState, useEffect } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import ChatbaseWidget from "@/components/ChatbaseWidget"

export default function ServiceDetailPage() {
  const params = useParams()
  const dispatch = useDispatch()
  const { t } = useLanguage()
  const service = useSelector((state: RootState) => state.services.items.find((s) => s.id === params.id))
  const currentUser = useSelector((state: RootState) => state.auth.user)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  if (!service && !isLoading) return <div className="p-8 text-center">{t("service.notFound")}</div>

  const isCreator = currentUser?.id === service?.creatorId
  const hasApplied = currentUser && service?.applicants.includes(currentUser.id)

  const handleApply = () => {
    if (currentUser && service) {
      dispatch(applyToService({ serviceId: service.id, userId: currentUser.id }))
    }
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

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl animate-in fade-in duration-500">
      <>
        <ChatbaseWidget />
      </>
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
                {service.category}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {t("service.posted")} {service.date}
              </span>
            </div>

            <h1 className="text-3xl font-bold mb-4">{service.title}</h1>

            <div className="flex flex-wrap gap-4 mb-8">
              <div className="flex items-center gap-2 bg-muted/50 px-3 py-2 rounded-lg text-sm font-medium">
                <DollarSign className="h-4 w-4 text-green-600 dark:text-green-400" />${service.price}
              </div>
              <div className="flex items-center gap-2 bg-muted/50 px-3 py-2 rounded-lg text-sm font-medium">
                <MapPin className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                {service.location}
              </div>
              <div className="flex items-center gap-2 bg-muted/50 px-3 py-2 rounded-lg text-sm font-medium">
                <Calendar className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                {service.date}
              </div>
            </div>

            <div className="prose prose-sm max-w-none text-muted-foreground">
              <h3 className="text-foreground font-bold text-lg mb-2">{t("service.description")}</h3>
              <p>{service.description}</p>
            </div>
          </div>

          {/* Applicants Section (Only for Creator) */}
          {isCreator && (
            <div className="bg-card text-card-foreground p-6 rounded-3xl shadow-soft border border-border/50">
              <h3 className="font-bold text-lg mb-4">
                {t("service.applicants")} ({service.applicants.length})
              </h3>
              {service.applicants.length === 0 ? (
                <p className="text-muted-foreground text-sm">{t("service.noApplicants")}</p>
              ) : (
                <div className="space-y-4">
                  {service.applicants.map((applicantId) => (
                    <div key={applicantId} className="flex items-center justify-between p-3 bg-muted/30 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                          <User className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-bold text-sm">Applicant {applicantId}</p>
                          <p className="text-xs text-muted-foreground">
                            4.8 {t("service.rating")} • 12 {t("service.jobs")}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="h-8 bg-transparent">
                          {t("service.decline")}
                        </Button>
                        <Button size="sm" className="h-8 bg-pastel-green text-green-900 hover:bg-pastel-green/80">
                          {t("service.accept")}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Creator Card */}
          <Card className="border-none shadow-soft overflow-hidden bg-card text-card-foreground">
            <div className="bg-pastel-blue/20 h-20"></div>
            <CardContent className="relative pt-0 pb-6 px-6 text-center">
              <div className="h-20 w-20 rounded-full border-4 border-background bg-background mx-auto -mt-10 mb-3 overflow-hidden shadow-sm">
                <img
                  src={service.creatorAvatar || "/placeholder.svg"}
                  alt={service.creatorName}
                  className="h-full w-full object-cover"
                />
              </div>
              <h3 className="font-bold text-lg">{service.creatorName}</h3>
              <p className="text-sm text-muted-foreground mb-4">{t("service.memberSince")} 2023</p>
              <div className="flex justify-center gap-4 text-sm mb-6">
                <div className="text-center">
                  <span className="block font-bold">4.9</span>
                  <span className="text-xs text-muted-foreground">{t("service.rating")}</span>
                </div>
                <div className="text-center">
                  <span className="block font-bold">15</span>
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
                  {t("service.applyHelp", { name: service.creatorName })}
                </p>
                {hasApplied ? (
                  <Button className="w-full bg-green-500 hover:bg-green-600 text-white" disabled>
                    <CheckCircle className="mr-2 h-4 w-4" /> {t("service.applied")}
                  </Button>
                ) : (
                  <Button className="w-full bg-pastel-blue text-blue-900 hover:bg-pastel-blue/80" onClick={handleApply}>
                    {t("service.apply")}
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
