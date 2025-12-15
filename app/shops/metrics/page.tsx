"use client"

import { useEffect, useRef } from "react"
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
import { TrendingUp, Users, Target, BarChart3 } from "lucide-react"

// Register Chart.js components
Chart.register(...registerables)

export default function ShopMetricsPage() {
  const visitsChartRef = useRef<HTMLCanvasElement>(null)
  const interactionsChartRef = useRef<HTMLCanvasElement>(null)
  const conversionChartRef = useRef<HTMLCanvasElement>(null)
  
  const visitsChartInstance = useRef<Chart | null>(null)
  const interactionsChartInstance = useRef<Chart | null>(null)
  const conversionChartInstance = useRef<Chart | null>(null)

  useEffect(() => {
    // Shop Visits Bar Chart
    if (visitsChartRef.current) {
      const ctx = visitsChartRef.current.getContext('2d')
      if (ctx) {
        if (visitsChartInstance.current) {
          visitsChartInstance.current.destroy()
        }
        visitsChartInstance.current = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: ['Tech Haven', 'Fashion Hub', 'Home Decor Plus', 'Sports World', 'Book Nook'],
            datasets: [{
              label: 'Shop Visits',
              data: [2450, 3120, 1780, 2890, 1640],
              backgroundColor: [
                'rgba(59, 130, 246, 0.8)',
                'rgba(168, 85, 247, 0.8)',
                'rgba(236, 72, 153, 0.8)',
                'rgba(251, 146, 60, 0.8)',
                'rgba(34, 197, 94, 0.8)',
              ],
              borderColor: [
                'rgb(59, 130, 246)',
                'rgb(168, 85, 247)',
                'rgb(236, 72, 153)',
                'rgb(251, 146, 60)',
                'rgb(34, 197, 94)',
              ],
              borderWidth: 2,
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false,
              },
              title: {
                display: false,
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    return `Visits: ${context.parsed.y.toLocaleString()}`
                  }
                }
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  callback: function(value) {
                    return value.toLocaleString()
                  }
                }
              }
            }
          }
        })
      }
    }

    // Shop Data Interactions Pie Chart
    if (interactionsChartRef.current) {
      const ctx = interactionsChartRef.current.getContext('2d')
      if (ctx) {
        if (interactionsChartInstance.current) {
          interactionsChartInstance.current.destroy()
        }
        interactionsChartInstance.current = new Chart(ctx, {
          type: 'pie',
          data: {
            labels: ['Business Hours', 'Location/Map', 'Contact Info', 'Product Catalog', 'Reviews'],
            datasets: [{
              data: [1850, 2340, 1620, 3120, 2890],
              backgroundColor: [
                'rgba(59, 130, 246, 0.8)',
                'rgba(168, 85, 247, 0.8)',
                'rgba(236, 72, 153, 0.8)',
                'rgba(251, 146, 60, 0.8)',
                'rgba(34, 197, 94, 0.8)',
              ],
              borderColor: [
                'rgb(59, 130, 246)',
                'rgb(168, 85, 247)',
                'rgb(236, 72, 153)',
                'rgb(251, 146, 60)',
                'rgb(34, 197, 94)',
              ],
              borderWidth: 2,
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'bottom',
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    const label = context.label || ''
                    const value = context.parsed
                    const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0)
                    const percentage = ((value / total) * 100).toFixed(1)
                    return `${label}: ${value.toLocaleString()} (${percentage}%)`
                  }
                }
              }
            }
          }
        })
      }
    }

    // Conversion Rate Line Chart
    if (conversionChartRef.current) {
      const ctx = conversionChartRef.current.getContext('2d')
      if (ctx) {
        if (conversionChartInstance.current) {
          conversionChartInstance.current.destroy()
        }
        conversionChartInstance.current = new Chart(ctx, {
          type: 'line',
          data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [
              {
                label: 'Tech Haven',
                data: [12.5, 13.2, 14.1, 13.8, 15.2, 16.5, 17.1, 16.8, 18.2, 19.5, 20.1, 21.3],
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.4,
              },
              {
                label: 'Fashion Hub',
                data: [10.2, 11.5, 12.8, 13.2, 14.5, 15.1, 16.2, 15.8, 17.1, 18.5, 19.2, 20.5],
                borderColor: 'rgb(168, 85, 247)',
                backgroundColor: 'rgba(168, 85, 247, 0.1)',
                tension: 0.4,
              },
              {
                label: 'Home Decor Plus',
                data: [8.5, 9.2, 10.1, 9.8, 11.2, 12.1, 11.8, 13.2, 14.1, 15.5, 16.2, 17.8],
                borderColor: 'rgb(236, 72, 153)',
                backgroundColor: 'rgba(236, 72, 153, 0.1)',
                tension: 0.4,
              },
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'bottom',
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    return `${context.dataset.label}: ${context.parsed.y.toFixed(1)}%`
                  }
                }
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  callback: function(value) {
                    return value + '%'
                  }
                }
              }
            }
          }
        })
      }
    }

    return () => {
      if (visitsChartInstance.current) visitsChartInstance.current.destroy()
      if (interactionsChartInstance.current) interactionsChartInstance.current.destroy()
      if (conversionChartInstance.current) conversionChartInstance.current.destroy()
    }
  }, [])

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
                Analyze shop performance with interactive charts and visualizations
              </p>
            </div>
            <div className="flex gap-2">
              <Select defaultValue="30">
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Time Range" />
                </SelectTrigger>
                <SelectContent align="end" sideOffset={4}>
                  <SelectItem value="7">Last 7 days</SelectItem>
                  <SelectItem value="30">Last 30 days</SelectItem>
                  <SelectItem value="90">Last 90 days</SelectItem>
                  <SelectItem value="365">Last year</SelectItem>
                </SelectContent>
              </Select>
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
                <div className="text-2xl font-bold">11,880</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-green-500">+12.5%</span> from last month
                </p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Conversion</CardTitle>
                <Target className="h-4 w-4 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">17.9%</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-green-500">+3.2%</span> from last month
                </p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Interactions</CardTitle>
                <BarChart3 className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">11,820</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Across all data points
                </p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Top Performer</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Fashion Hub</div>
                <p className="text-xs text-muted-foreground mt-1">
                  3,120 visits this period
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts Grid */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Shop Visits Bar Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Shop Visits Comparison</CardTitle>
                <CardDescription>
                  Total number of visitors per shop
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <canvas ref={visitsChartRef}></canvas>
                </div>
                <div className="mt-4 flex items-center justify-center gap-2">
                  <Badge variant="outline" className="gap-1">
                    <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                    Tech Haven
                  </Badge>
                  <Badge variant="outline" className="gap-1">
                    <span className="w-3 h-3 rounded-full bg-purple-500"></span>
                    Fashion Hub
                  </Badge>
                  <Badge variant="outline" className="gap-1">
                    <span className="w-3 h-3 rounded-full bg-pink-500"></span>
                    Home Decor
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Shop Data Interactions Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Data Interaction Distribution</CardTitle>
                <CardDescription>
                  User interactions with shop information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <canvas ref={interactionsChartRef}></canvas>
                </div>
                <div className="mt-4 text-center text-sm text-muted-foreground">
                  Total: 11,820 interactions
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Conversion Rate Line Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Conversion Rate Trends</CardTitle>
              <CardDescription>
                Monthly conversion rate performance across top shops
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <canvas ref={conversionChartRef}></canvas>
              </div>
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <div className="flex items-center gap-3 p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20">
                  <div className="w-3 h-12 rounded bg-blue-500"></div>
                  <div>
                    <p className="text-sm font-medium">Tech Haven</p>
                    <p className="text-2xl font-bold">21.3%</p>
                    <p className="text-xs text-muted-foreground">Current rate</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-lg bg-purple-50 dark:bg-purple-950/20">
                  <div className="w-3 h-12 rounded bg-purple-500"></div>
                  <div>
                    <p className="text-sm font-medium">Fashion Hub</p>
                    <p className="text-2xl font-bold">20.5%</p>
                    <p className="text-xs text-muted-foreground">Current rate</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-lg bg-pink-50 dark:bg-pink-950/20">
                  <div className="w-3 h-12 rounded bg-pink-500"></div>
                  <div>
                    <p className="text-sm font-medium">Home Decor Plus</p>
                    <p className="text-2xl font-bold">17.8%</p>
                    <p className="text-xs text-muted-foreground">Current rate</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
