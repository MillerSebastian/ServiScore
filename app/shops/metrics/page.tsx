"use client"

import { useEffect, useRef, useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Chart, registerables } from 'chart.js'
import { TrendingUp, Users, Target, BarChart3, Smartphone, MapPin } from "lucide-react"
import { db, auth } from "@/lib/firebase"
import { collection, query, where, getDocs } from "firebase/firestore"
import { onAuthStateChanged } from "firebase/auth"
import { useRouter } from "next/navigation"

// Register Chart.js components
Chart.register(...registerables)

export default function ShopMetricsPage() {
  const router = useRouter()
  const visitsChartRef = useRef<HTMLCanvasElement>(null)
  const deviceChartRef = useRef<HTMLCanvasElement>(null)
  const locationChartRef = useRef<HTMLCanvasElement>(null)

  const visitsChartInstance = useRef<Chart | null>(null)
  const deviceChartInstance = useRef<Chart | null>(null)
  const locationChartInstance = useRef<Chart | null>(null)

  const [isLoading, setIsLoading] = useState(true)
  const [metrics, setMetrics] = useState({
    totalVisits: 0,
    totalInteractions: 0,
    avgConversion: "0.0%",
    topPerformer: { name: "N/A", visits: 0 },
    storeVisits: [] as { name: string, count: number }[],
    devices: { mobile: 0, desktop: 0 },
    locations: [] as { name: string, count: number }[]
  })

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/login")
        return
      }
      fetchData(user.uid)
    })
    return () => unsubscribe()
  }, [])

  const fetchData = async (uid: string) => {
    try {
      setIsLoading(true)

      // 1. Fetch Stores
      const storesQuery = query(collection(db, "stores"), where("user_id", "==", uid))
      const storesSnap = await getDocs(storesQuery)
      const stores = storesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      const storeIds = stores.map(s => s.id)
      const storeNameMap = stores.reduce((acc, s: any) => ({ ...acc, [s.id]: s.store_name }), {})

      if (storeIds.length === 0) {
        setIsLoading(false)
        return
      }

      // 2. Fetch Logs (Limit to safe number or time range? fetching all for MVP request)
      // Optimally we'd use 'in' chunks, but assuming < 10 stores for now or simplified logic
      const targetIds = storeIds.slice(0, 10)
      const logsQuery = query(collection(db, "store_logs"), where("storeId", "in", targetIds))
      const logsSnap = await getDocs(logsQuery)

      const logs = logsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() as any }))

      // 3. Process Data
      const views = logs.filter(l => l.action === 'View')
      const favorites = logs.filter(l => l.action === 'Favorite')

      // Metrics
      const totalVisits = views.length
      const totalInteractions = logs.length
      const avgConversion = totalVisits > 0
        ? ((favorites.length / totalVisits) * 100).toFixed(1) + "%"
        : "0.0%"

      // Per Store Visits
      const visitsByStore: Record<string, number> = {}
      views.forEach(v => {
        const name = storeNameMap[v.storeId] || "Unknown"
        visitsByStore[name] = (visitsByStore[name] || 0) + 1
      })
      const sortedStores = Object.entries(visitsByStore)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)

      const topPerformer = sortedStores[0] || { name: "N/A", visits: 0 }

      // Devices
      let mobile = 0
      let desktop = 0
      views.forEach(v => {
        if (v.device === 'Mobile') mobile++
        else desktop++
      })

      // Locations
      const locationCounts: Record<string, number> = {}
      views.forEach(v => {
        const loc = v.location || "Unknown"
        locationCounts[loc] = (locationCounts[loc] || 0) + 1
      })
      const sortedLocations = Object.entries(locationCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10) // Top 10

      setMetrics({
        totalVisits,
        totalInteractions,
        avgConversion,
        topPerformer: { name: topPerformer.name, visits: topPerformer.count },
        storeVisits: sortedStores.slice(0, 5), // Top 5
        devices: { mobile, desktop },
        locations: sortedLocations
      })

    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }

  // Bind Data to Charts
  useEffect(() => {
    if (isLoading) return

    // 1. Shop Visits Chart
    if (visitsChartRef.current) {
      const ctx = visitsChartRef.current.getContext('2d')
      if (ctx) {
        if (visitsChartInstance.current) visitsChartInstance.current.destroy()

        visitsChartInstance.current = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: metrics.storeVisits.map(s => s.name),
            datasets: [{
              label: 'Visits',
              data: metrics.storeVisits.map(s => s.count),
              backgroundColor: 'rgba(59, 130, 246, 0.8)',
              borderRadius: 4
            }]
          },
          options: { responsive: true, maintainAspectRatio: false }
        })
      }
    }

    // 2. Device Chart (Pie)
    if (deviceChartRef.current) {
      const ctx = deviceChartRef.current.getContext('2d')
      if (ctx) {
        if (deviceChartInstance.current) deviceChartInstance.current.destroy()

        deviceChartInstance.current = new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: ['Mobile', 'Desktop'],
            datasets: [{
              data: [metrics.devices.mobile, metrics.devices.desktop],
              backgroundColor: ['#e11d48', '#2563eb'] // Rose & Blue
            }]
          },
          options: { responsive: true, maintainAspectRatio: false }
        })
      }
    }

    // 3. Location Chart (Bar or Horizontal Bar)
    if (locationChartRef.current) {
      const ctx = locationChartRef.current.getContext('2d')
      if (ctx) {
        if (locationChartInstance.current) locationChartInstance.current.destroy()

        locationChartInstance.current = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: metrics.locations.map(l => l.name),
            datasets: [{
              label: 'Views by City',
              data: metrics.locations.map(l => l.count),
              backgroundColor: 'rgba(168, 85, 247, 0.8)', // Purple
              borderRadius: 4
            }]
          },
          options: {
            indexAxis: 'y', // Horizontal bar for easier reading of city names
            responsive: true,
            maintainAspectRatio: false
          }
        })
      }
    }

    return () => {
      visitsChartInstance.current?.destroy()
      deviceChartInstance.current?.destroy()
      locationChartInstance.current?.destroy()
    }

  }, [metrics, isLoading])


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
      <SidebarInset className="overflow-x-hidden">
        <SiteHeader />
        <div className="flex flex-1 flex-col gap-4 p-4 md:p-6 overflow-x-hidden">
          {/* Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Shop Metrics</h1>
              <p className="text-muted-foreground">
                Real-time performance analytics
              </p>
            </div>

          </div>

          {/* Summary Stats */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Visits</CardTitle>
                <Users className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.totalVisits.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Lifetime views
                </p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Conversion</CardTitle>
                <Target className="h-4 w-4 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.avgConversion}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Favorites / Views
                </p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Interactions</CardTitle>
                <BarChart3 className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.totalInteractions.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Views, Favorites, Reviews
                </p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Top Performer</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold truncate" title={metrics.topPerformer.name}>
                  {metrics.topPerformer.name}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {metrics.topPerformer.visits} visits
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts Grid */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Shop Visits Bar Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Visits by Store</CardTitle>
                <CardDescription>
                  Top 5 stores by traffic
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <canvas ref={visitsChartRef}></canvas>
                </div>
              </CardContent>
            </Card>

            {/* Device Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Device Breakdown</CardTitle>
                <CardDescription>
                  Mobile vs Desktop Usage
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center">
                  <canvas ref={deviceChartRef}></canvas>
                </div>
                <div className="mt-4 flex justify-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4" /> Mobile: {metrics.devices.mobile}
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" /> Desktop: {metrics.devices.desktop}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Location Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Top Locations</CardTitle>
              <CardDescription>
                Where your visitors are coming from
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <canvas ref={locationChartRef}></canvas>
              </div>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
