"use client"

import { useState, useEffect } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { ShopMetricsCards } from "@/components/shop-analytics/shop-metrics-cards"
import { PerformanceTrends } from "@/components/shop-analytics/performance-trends"
import { GeographicalMap } from "@/components/shop-analytics/geographical-map"
import { CustomerInsights } from "@/components/shop-analytics/customer-insights"
import { AnalyticsFilters } from "@/components/shop-analytics/analytics-filters"
import { db, auth } from "@/lib/firebase"
import { collection, query, where, getDocs, orderBy, limit } from "firebase/firestore"
import { onAuthStateChanged } from "firebase/auth"
import { useRouter } from "next/navigation"

export default function ShopAnalyticsPage() {
  const router = useRouter()
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date(),
  })
  const [selectedLocation, setSelectedLocation] = useState<string>("all")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [isLoading, setIsLoading] = useState(true)
  const [analyticsData, setAnalyticsData] = useState<{
    views: any[],
    sales: any[], // Mocked for now
    logs: any[],
    stores: any[]
  }>({ views: [], sales: [], logs: [], stores: [] })

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/login")
        return
      }
      fetchAnalytics(user.uid)
    })
    return () => unsubscribe()
  }, [dateRange]) // Re-fetch when date changes

  const fetchAnalytics = async (uid: string) => {
    try {
      setIsLoading(true)

      // 1. Get User Stores
      const storesQuery = query(collection(db, "stores"), where("user_id", "==", uid))
      const storesSnap = await getDocs(storesQuery)
      const stores = storesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      const storeIds = stores.map(s => s.id)

      if (storeIds.length === 0) {
        setIsLoading(false)
        return
      }

      // 2. Fetch Logs for these stores within date range
      // Firestore 'in' limit is 10. If > 10, we might need multiple queries or just fetch global logs and filter (filtered by owner indirectly).
      // For MVP, if > 10 stores, just take first 10 for analytics or fetch all logs (expensive).
      // Let's try fetching logs by timestamp and filter in memory if storeIds.length > 10.
      // ACTUALLY, `store_logs` doesn't have `user_id`.
      // If user has many stores, filtering by `storeId` 'in' is best.

      let logs: any[] = []
      // Slicing to 10 for safety in 'in' query
      const targetIds = storeIds.slice(0, 10)

      const logsQuery = query(
        collection(db, "store_logs"),
        where("storeId", "in", targetIds),
        where("timestamp", ">=", dateRange.from.toISOString()),
        where("timestamp", "<=", dateRange.to.toISOString())
      )

      const logsSnap = await getDocs(logsQuery)
      logs = logsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))

      // Separate views
      const views = logs.filter(l => l.action === 'View')

      setAnalyticsData({
        views,
        logs,
        stores,
        sales: []
      })

    } catch (error) {
      console.error("Error fetching analytics", error)
    } finally {
      setIsLoading(false)
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
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="px-4 lg:px-6">
                <div className="mb-6">
                  <h1 className="text-3xl font-bold tracking-tight">Shop Analytics Dashboard</h1>
                  <p className="text-muted-foreground mt-2">
                    Comprehensive insights for shop accounts and performance metrics
                  </p>
                </div>

                <AnalyticsFilters
                  dateRange={dateRange}
                  onDateRangeChange={setDateRange}
                  selectedLocation={selectedLocation}
                  onLocationChange={setSelectedLocation}
                  selectedCategory={selectedCategory}
                  onCategoryChange={setSelectedCategory}
                />
              </div>

              <ShopMetricsCards
                dateRange={dateRange}
                location={selectedLocation}
                category={selectedCategory}
                data={analyticsData} // Pass real data
              />

              <div className="px-4 lg:px-6">
                <PerformanceTrends
                  dateRange={dateRange}
                  location={selectedLocation}
                  category={selectedCategory}
                  data={analyticsData}
                />
              </div>

              <div className="px-4 lg:px-6">
                <GeographicalMap
                  dateRange={dateRange}
                  category={selectedCategory}
                  data={analyticsData}
                />
              </div>

              <div className="px-4 lg:px-6">
                <CustomerInsights
                  dateRange={dateRange}
                  location={selectedLocation}
                  category={selectedCategory}
                  data={analyticsData}
                />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
