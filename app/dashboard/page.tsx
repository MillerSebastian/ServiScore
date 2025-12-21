"use client"

import { db } from "@/lib/firebase"
import { collection, getDocs, query, where, orderBy, limit } from "firebase/firestore"
import { useState, useEffect } from "react"
import { useLanguage } from "@/contexts/language-context"
import { AppSidebar } from "@/components/app-sidebar"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
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
  Activity,
  Star,
  ShoppingBag
} from "lucide-react"

import Clock from "./common/Clock"
import { toast } from "sonner"
import { auth } from "@/lib/firebase"
import { onAuthStateChanged } from "firebase/auth"
import { authService } from "@/lib/services/auth.service"
import { useRouter } from "next/navigation"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, BadgeCheck } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

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
  const [recentActivity, setRecentActivity] = useState<any[]>([])
  const [topPerformers, setTopPerformers] = useState<any[]>([])
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
      fetchData(firebaseUser.uid)
    })

    return () => unsubscribe()
  }, [router])

  const fetchData = async (uid: string) => {
    try {
      setLoading(true)

      // 1. Fetch Stores (User's stores only)
      const storesQuery = query(collection(db, "stores"), where("user_id", "==", uid))
      const storesSnap = await getDocs(storesQuery)
      const stores = storesSnap.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .sort((a: any, b: any) => (b.createdAt && a.createdAt ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime() : 0)) as any[]
      const totalStores = stores.length

      // 2. Fetch Services (User's services only)
      const servicesQuery = query(collection(db, "services"), where("user_id", "==", uid))
      const servicesSnap = await getDocs(servicesQuery)
      const services = servicesSnap.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .sort((a: any, b: any) => (b.createdAt && a.createdAt ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime() : 0)) as any[]

      const totalServices = services.length
      const activeServices = services.filter(s => s.status_id === 1 || s.service_is_active).length

      // Calculate Revenue (Mock: Sum of service prices)
      const totalRevenue = services.reduce((acc, s) => acc + (Number(s.service_price) || 0), 0)

      // 3. Fetch Customers (Global - Platform Reach)
      const usersSnap = await getDocs(collection(db, "users"))
      const totalCustomers = usersSnap.size

      // 4. Fetch Categories (Global)
      const categoriesSnap = await getDocs(collection(db, "service_categories"))
      const totalCategories = categoriesSnap.size

      // 5. Recent Activity (Combine Stores and Services, sort by createdAt)
      const combinedActivity = [
        ...stores.map(s => ({
          type: 'store',
          name: s.store_name,
          date: s.createdAt ? new Date(s.createdAt) : new Date(),
          details: `New store registered in ${s.store_location || 'Unknown location'}`
        })),
        ...services.map(s => ({
          type: 'service',
          name: s.service_title,
          date: s.createdAt ? new Date(s.createdAt) : new Date(),
          details: `New service added: ${s.service_title} ($${s.service_price})`
        }))
      ].sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 5)

      setRecentActivity(combinedActivity)

      // 6. Top Performers (Stores with most favorites - My Stores)
      const topStores = [...stores]
        .sort((a, b) => (b.store_total_favourites || 0) - (a.store_total_favourites || 0))
        .slice(0, 3)

      setTopPerformers(topStores)

      setMetrics({
        totalStores,
        totalServices,
        activeServices,
        totalCustomers,
        totalRevenue,
        totalCategories
      })

    } catch (error) {
      console.error("Error fetching dashboard data:", error)
      toast.error("Failed to load dashboard data")
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
                      <Button className="gap-2" onClick={() => router.push('/shops/manage')}>
                        <Plus className="h-4 w-4" />
                        {t("dashboard.newStore")}
                      </Button>
                      <Button variant="outline" className="gap-2" onClick={() => router.push('/services/manage')}>
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
                          <span className="text-green-600 dark:text-green-400">Live</span> {t("dashboard.fromLastMonth")}
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
                          <span className="text-green-600 dark:text-green-400">Active</span> services
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
                          <span className="text-green-600 dark:text-green-400">Total Value</span>
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
                          <span className="text-green-600 dark:text-green-400">Registered</span> Users
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Recent Activity & Top Performers */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <Card className="h-full">
                      <CardHeader>
                        <CardTitle>{t("dashboard.recentActivity")}</CardTitle>
                        <CardDescription>Latest updates from stores and services</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {recentActivity.length > 0 ? (
                          recentActivity.map((activity, i) => (
                            <div key={i} className="flex items-start gap-3">
                              <div className={`w-2 h-2 rounded-full mt-2 ${activity.type === 'store' ? 'bg-blue-500' : 'bg-purple-500'}`}></div>
                              <div className="flex-1 space-y-1">
                                <p className="text-sm font-medium">{activity.type === 'store' ? 'New Store Registered' : 'New Service Added'}</p>
                                <p className="text-xs text-muted-foreground">
                                  {activity.details} • {activity.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center text-muted-foreground py-8">
                            No recent activity found
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    <Card className="h-full">
                      <CardHeader>
                        <CardTitle>{t("dashboard.topPerformers")}</CardTitle>
                        <CardDescription>Highest rated stores by favorites</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {topPerformers.length > 0 ? (
                          topPerformers.map((store, i) => (
                            <div key={store.id} className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${i === 0 ? 'bg-gradient-to-r from-yellow-400 to-orange-500' :
                                  i === 1 ? 'bg-gradient-to-r from-gray-300 to-gray-400' :
                                    'bg-gradient-to-r from-amber-600 to-amber-700'
                                  }`}>
                                  {i + 1}
                                </div>
                                <div>
                                  <p className="text-sm font-medium">{store.store_name}</p>
                                  <p className="text-xs text-muted-foreground">{store.store_category_id ? 'Store' : 'Venue'}</p>
                                </div>
                              </div>
                              <Badge className="bg-pink-500/10 text-pink-700 dark:text-pink-400 border-pink-500/20 gap-1">
                                <Star className="h-3 w-3 fill-pink-500" /> {store.store_total_favourites || 0}
                              </Badge>
                            </div>
                          ))
                        ) : (
                          <div className="text-center text-muted-foreground py-8">
                            No top performers yet
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>

                  <SectionCards />
                  <ChartAreaInteractive />

                  {/* Recent Registrations Table (Replacing Mock DataTable) */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Registrations</CardTitle>
                      <CardDescription>Newest stores joining the platform</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Activity</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Date</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {recentActivity.map((activity, i) => (
                            <TableRow key={i}>
                              <TableCell>
                                <div className="font-medium">{activity.name}</div>
                                <div className="text-xs text-muted-foreground truncate max-w-[200px]">{activity.details}</div>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className="capitalize">
                                  {activity.type}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-muted-foreground">
                                {activity.date.toLocaleDateString()}
                              </TableCell>
                            </TableRow>
                          ))}
                          {recentActivity.length === 0 && (
                            <TableRow>
                              <TableCell colSpan={3} className="text-center text-muted-foreground h-24">
                                No data available
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
