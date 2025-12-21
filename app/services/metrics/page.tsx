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
import { CheckCircle, Users, TrendingUp, Percent, Eye, Smartphone, MousePointer } from "lucide-react"
import { db, auth } from "@/lib/firebase"
import { collection, query, where, getDocs } from "firebase/firestore"
import { onAuthStateChanged } from "firebase/auth"
import { useRouter } from "next/navigation"

// Register Chart.js components
Chart.register(...registerables)

export default function ServiceMetricsPage() {
  const router = useRouter()
  const viewsChartRef = useRef<HTMLCanvasElement>(null)
  const deviceChartRef = useRef<HTMLCanvasElement>(null)
  const locationChartRef = useRef<HTMLCanvasElement>(null)

  const viewsChartInstance = useRef<Chart | null>(null)
  const deviceChartInstance = useRef<Chart | null>(null)
  const locationChartInstance = useRef<Chart | null>(null)

  const [isLoading, setIsLoading] = useState(true)
  const [metrics, setMetrics] = useState({
    totalViews: 0,
    totalInteractions: 0,
    topService: { name: "N/A", views: 0 },
    serviceViews: [] as { name: string, count: number }[],
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

      // 1. Fetch User's Services
      const servicesQuery = query(collection(db, "services"), where("user_id", "==", uid))
      const servicesSnap = await getDocs(servicesQuery)
      const services = servicesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() as any }))
      const serviceIds = services.map(s => s.id)
      const serviceNameMap = services.reduce((acc, s: any) => ({ ...acc, [s.id]: s.service_title }), {})

      if (serviceIds.length === 0) {
        setIsLoading(false)
        return
      }

      // 2. Fetch Logs (Limit 10 services for 'in' query constraint)
      const targetIds = serviceIds.slice(0, 10)
      const logsQuery = query(collection(db, "service_logs"), where("serviceId", "in", targetIds))
      const logsSnap = await getDocs(logsQuery)
      const logs = logsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() as any }))

      // 3. Process Data
      const views = logs.filter(l => l.action === 'View')

      // Metrics
      const totalViews = views.length
      const totalInteractions = logs.length

      // Per Service Views
      const viewsByService: Record<string, number> = {}
      views.forEach(v => {
        const name = serviceNameMap[v.serviceId] || "Unknown"
        viewsByService[name] = (viewsByService[name] || 0) + 1
      })
      const sortedServices = Object.entries(viewsByService)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)

      const topService = sortedServices[0] || { name: "N/A", views: 0 }

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
        .slice(0, 10)

      setMetrics({
        totalViews,
        totalInteractions,
        topService,
        serviceViews: sortedServices.slice(0, 5),
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

    // 1. Views by Service
    if (viewsChartRef.current) {
      const ctx = viewsChartRef.current.getContext('2d')
      if (ctx) {
        if (viewsChartInstance.current) viewsChartInstance.current.destroy()
        viewsChartInstance.current = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: metrics.serviceViews.map(s => s.name),
            datasets: [{
              label: 'Views',
              data: metrics.serviceViews.map(s => s.count),
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
              backgroundColor: ['#e11d48', '#2563eb']
            }]
          },
          options: { responsive: true, maintainAspectRatio: false }
        })
      }
    }

    // 3. Location Chart (Horizontal Bar)
    if (locationChartRef.current) {
      const ctx = locationChartRef.current.getContext('2d')
      if (ctx) {
        if (locationChartInstance.current) locationChartInstance.current.destroy()
        locationChartInstance.current = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: metrics.locations.map(l => l.name),
            datasets: [{
              label: 'Views by Location',
              data: metrics.locations.map(l => l.count),
              backgroundColor: 'rgba(168, 85, 247, 0.8)',
              borderRadius: 4
            }]
          },
          options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false
          }
        })
      }
    }

    return () => {
      viewsChartInstance.current?.destroy()
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
              <h1 className="text-3xl font-bold tracking-tight">Service Metrics</h1>
              <p className="text-muted-foreground">
                Real-time performance analytics for your services
              </p>
            </div>
            {/* removed time range selector for now as we show lifetime stats in this MVP */}
          </div>

          {/* Summary Stats */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                <Eye className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.totalViews.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Lifetime views
                </p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Interactions</CardTitle>
                <MousePointer className="h-4 w-4 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.totalInteractions.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Total activity events
                </p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Top Service</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold truncate" title={metrics.topService.name}>
                  {metrics.topService.name}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {metrics.topService.views} views
                </p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Mobile Traffic</CardTitle>
                <Smartphone className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {metrics.totalViews > 0
                    ? Math.round((metrics.devices.mobile / metrics.totalViews) * 100)
                    : 0}%
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Percent of mobile users
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts Grid */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Views by Service */}
            <Card>
              <CardHeader>
                <CardTitle>Views by Service</CardTitle>
                <CardDescription>
                  Top 5 services by traffic
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <canvas ref={viewsChartRef}></canvas>
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
