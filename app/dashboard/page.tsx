"use client"

import { db } from "@/lib/firebase"
import { collection, getDocs, query, where, orderBy, limit } from "firebase/firestore"
import { useState, useEffect } from "react"
import { useLanguage } from "@/contexts/language-context"
import { AppSidebar } from "@/components/app-sidebar"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  TrendingUp,
  Store,
  Briefcase,
  Users,
  DollarSign,
  Plus,
} from "lucide-react"

import data from "./data.json"
import Clock from "./common/Clock"
import { toast } from "sonner"
import { auth } from "@/lib/firebase"
import { onAuthStateChanged } from "firebase/auth"
import { authService } from "@/lib/services/auth.service"
import { useRouter } from "next/navigation"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, BadgeCheck } from "lucide-react"

export default function Page() {
  const { t } = useLanguage()
  const router = useRouter()
  const [metrics, setMetrics] = useState({
    totalStores: 0,
    totalServices: 0,
    activeServices: 0,
    totalCustomers: 0,
    totalRevenue: 0,
    totalCategories: 0
  })
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [isVerified, setIsVerified] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        router.push("/login")
        return
      }

      // Fetch user profile to check verification status
      const profile = await authService.getUserProfile(firebaseUser.uid)
      setUser(profile)
      setIsVerified(profile?.isVerified || false)

      if (!profile?.isVerified) {
        setLoading(false)
        return
      }

      // Only fetch metrics if verified
      fetchMetrics()
    })

    return () => unsubscribe()
  }, [router])

  const fetchMetrics = async () => {
    try {
      setLoading(true)

      // Fetch Stores
      const storesSnap = await getDocs(collection(db, "stores"))
      const totalStores = storesSnap.size

      // Fetch Services
      const servicesSnap = await getDocs(collection(db, "services"))
      const totalServices = servicesSnap.size
      const activeServices = servicesSnap.docs.filter(doc => doc.data().status_id === 1 || doc.data().service_is_active).length

      // Calculate Revenue (Mock calculation based on service prices for now, or fetch orders if they existed)
      const totalRevenue = servicesSnap.docs.reduce((acc, doc) => acc + (doc.data().service_price || 0), 0)

      // Fetch Customers (Users)
      const usersSnap = await getDocs(collection(db, "users"))
      const totalCustomers = usersSnap.size

      // Fetch Categories
      const categoriesSnap = await getDocs(collection(db, "service_categories"))
      const totalCategories = categoriesSnap.size

      setMetrics({
        totalStores,
        totalServices,
        activeServices,
        totalCustomers,
        totalRevenue,
        totalCategories
      })

    } catch (error) {
      console.error("Error fetching dashboard metrics:", error)
      toast.error("Failed to load dashboard metrics")
    } finally {
      setLoading(false)
    }
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset className="overflow-y-auto overflow-x-hidden">
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">

              {/* Unverified User Alert */}
              {!loading && !isVerified && (
                <Alert className="border-orange-500/50 bg-orange-50 dark:bg-orange-950/20">
                  <AlertCircle className="h-5 w-5 text-orange-600" />
                  <AlertTitle className="text-orange-800 dark:text-orange-400 font-semibold">
                    Verificación Requerida
                  </AlertTitle>
                  <AlertDescription className="text-orange-700 dark:text-orange-300">
                    Para acceder al Dashboard y crear tiendas o servicios, debes completar el proceso de verificación.
                    <Button
                      className="mt-3 gap-2 bg-orange-600 hover:bg-orange-700 text-white"
                      onClick={() => router.push("/profile")}
                    >
                      <BadgeCheck className="h-4 w-4" />
                      Ir a Verificación
                    </Button>
                  </AlertDescription>
                </Alert>
              )}

              {/* Only show dashboard content if verified */}
              {!loading && isVerified && (
                <>
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                      <h1 className="text-3xl font-bold tracking-tight">{t("dashboard.title")}</h1>
                      <p className="text-muted-foreground">{t("dashboard.welcome")}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button className="gap-2">
                        <Plus className="h-4 w-4" />
                        {t("dashboard.newStore")}
                      </Button>
                      <Button variant="outline" className="gap-2">
                        <Plus className="h-4 w-4" />
                        {t("dashboard.newService")}
                      </Button>
                    </div>
                  </div>

                  <Clock />

                  {/* Quick Stats */}
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="hover:shadow-lg transition-shadow">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{t("dashboard.totalStores")}</CardTitle>
                        <Store className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{loading ? "..." : metrics.totalStores}</div>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                          <TrendingUp className="h-3 w-3 text-green-600 dark:text-green-400" />
                          <span className="text-green-600 dark:text-green-400">+2</span> {t("dashboard.fromLastMonth")}
                        </p>
                      </CardContent>
                    </Card>
                    <Card className="hover:shadow-lg transition-shadow">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{t("dashboard.activeServices")}</CardTitle>
                        <Briefcase className="h-4 w-4 text-purple-500" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{loading ? "..." : metrics.activeServices}</div>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                          <TrendingUp className="h-3 w-3 text-green-600 dark:text-green-400" />
                          <span className="text-green-600 dark:text-green-400">+5</span> {t("dashboard.fromLastMonth")}
                        </p>
                      </CardContent>
                    </Card>
                    <Card className="hover:shadow-lg transition-shadow">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{t("dashboard.totalRevenue")}</CardTitle>
                        <DollarSign className="h-4 w-4 text-green-600 dark:text-green-400" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{loading ? "..." : `$${metrics.totalRevenue.toLocaleString()}`}</div>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                          <TrendingUp className="h-3 w-3 text-green-600 dark:text-green-400" />
                          <span className="text-green-600 dark:text-green-400">+24.5%</span> {t("dashboard.fromLastMonth")}
                        </p>
                      </CardContent>
                    </Card>
                    <Card className="hover:shadow-lg transition-shadow">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{t("dashboard.totalCustomers")}</CardTitle>
                        <Users className="h-4 w-4 text-orange-500" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{loading ? "..." : metrics.totalCustomers}</div>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                          <TrendingUp className="h-3 w-3 text-green-600 dark:text-green-400" />
                          <span className="text-green-600 dark:text-green-400">+12.3%</span> {t("dashboard.fromLastMonth")}
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Recent Activity & Top Performers */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                      <CardHeader>
                        <CardTitle>{t("dashboard.recentActivity")}</CardTitle>
                        <CardDescription>{t("dashboard.recentActivityDesc")}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 rounded-full bg-pastel-green mt-2"></div>
                          <div className="flex-1 space-y-1">
                            <p className="text-sm font-medium">{t("dashboard.newOrderReceived")}</p>
                            <p className="text-xs text-muted-foreground">Tech Haven - $2,450 • 2 hours ago</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 rounded-full bg-pastel-blue mt-2"></div>
                          <div className="flex-1 space-y-1">
                            <p className="text-sm font-medium">{t("dashboard.serviceCompleted")}</p>
                            <p className="text-xs text-muted-foreground">Web Development - Fashion Brand Ltd. • 4 hours ago</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 rounded-full bg-pastel-yellow mt-2"></div>
                          <div className="flex-1 space-y-1">
                            <p className="text-sm font-medium">{t("dashboard.newReviewPosted")}</p>
                            <p className="text-xs text-muted-foreground">Fashion Hub - 5 stars • 5 hours ago</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 rounded-full bg-purple-500 mt-2"></div>
                          <div className="flex-1 space-y-1">
                            <p className="text-sm font-medium">{t("dashboard.inventoryUpdated")}</p>
                            <p className="text-xs text-muted-foreground">Home Decor Plus - 120 items • 6 hours ago</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>{t("dashboard.topPerformers")}</CardTitle>
                        <CardDescription>{t("dashboard.topPerformersDesc")}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center text-white font-bold text-sm">
                              1
                            </div>
                            <div>
                              <p className="text-sm font-medium">Tech Haven</p>
                              <p className="text-xs text-muted-foreground">$45,230 {t("dashboard.revenue")}</p>
                            </div>
                          </div>
                          <Badge className="bg-pastel-green/20 text-green-700 dark:text-green-400 border-green-500/20">+18.5%</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-gray-300 to-gray-400 flex items-center justify-center text-white font-bold text-sm">
                              2
                            </div>
                            <div>
                              <p className="text-sm font-medium">Fashion Hub</p>
                              <p className="text-xs text-muted-foreground">$38,950 {t("dashboard.revenue")}</p>
                            </div>
                          </div>
                          <Badge className="bg-pastel-green/20 text-green-700 dark:text-green-400 border-green-500/20">+24.2%</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-amber-600 to-amber-700 flex items-center justify-center text-white font-bold text-sm">
                              3
                            </div>
                            <div>
                              <p className="text-sm font-medium">Sports World</p>
                              <p className="text-xs text-muted-foreground">$52,100 {t("dashboard.revenue")}</p>
                            </div>
                          </div>
                          <Badge className="bg-pastel-green/20 text-green-700 dark:text-green-400 border-green-500/20">+31.7%</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <SectionCards />
                  <ChartAreaInteractive />
                  <DataTable data={data} />
                </>
              )}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
