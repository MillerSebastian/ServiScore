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
import { CheckCircle, Users, TrendingUp, Percent } from "lucide-react"

// Register Chart.js components
Chart.register(...registerables)

export default function ServiceMetricsPage() {
  const completedChartRef = useRef<HTMLCanvasElement>(null)
  const usersChartRef = useRef<HTMLCanvasElement>(null)
  const completionRateChartRef = useRef<HTMLCanvasElement>(null)
  
  const completedChartInstance = useRef<Chart | null>(null)
  const usersChartInstance = useRef<Chart | null>(null)
  const completionRateChartInstance = useRef<Chart | null>(null)

  useEffect(() => {
    // Completed Services Bar Chart
    if (completedChartRef.current) {
      const ctx = completedChartRef.current.getContext('2d')
      if (ctx) {
        if (completedChartInstance.current) {
          completedChartInstance.current.destroy()
        }
        completedChartInstance.current = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: ['Web Development', 'Digital Marketing', 'Graphic Design', 'Consulting', 'Content Writing'],
            datasets: [{
              label: 'Completed Services',
              data: [45, 67, 89, 34, 112],
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
                    return `Completed: ${context.parsed.y || 0} services`
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

    // Users per Service Pie Chart
    if (usersChartRef.current) {
      const ctx = usersChartRef.current.getContext('2d')
      if (ctx) {
        if (usersChartInstance.current) {
          usersChartInstance.current.destroy()
        }
        usersChartInstance.current = new Chart(ctx, {
          type: 'pie',
          data: {
            labels: ['Technology', 'Marketing', 'Design', 'Consulting', 'Writing'],
            datasets: [{
              data: [156, 234, 189, 98, 267],
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
                    return `${label}: ${value.toLocaleString()} users (${percentage}%)`
                  }
                }
              }
            }
          }
        })
      }
    }

    // Completion Rate Line Chart
    if (completionRateChartRef.current) {
      const ctx = completionRateChartRef.current.getContext('2d')
      if (ctx) {
        if (completionRateChartInstance.current) {
          completionRateChartInstance.current.destroy()
        }
        completionRateChartInstance.current = new Chart(ctx, {
          type: 'line',
          data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [
              {
                label: 'Web Development',
                data: [92, 93, 94, 93, 95, 96, 97, 96, 98, 97, 98, 99],
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.4,
              },
              {
                label: 'Digital Marketing',
                data: [88, 89, 90, 91, 92, 93, 94, 93, 95, 94, 96, 97],
                borderColor: 'rgb(168, 85, 247)',
                backgroundColor: 'rgba(168, 85, 247, 0.1)',
                tension: 0.4,
              },
              {
                label: 'Graphic Design',
                data: [95, 96, 97, 96, 98, 97, 98, 99, 98, 99, 99, 100],
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
                    return `${context.dataset.label}: ${(context.parsed.y || 0).toFixed(1)}%`
                  }
                }
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                max: 100,
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
      if (completedChartInstance.current) completedChartInstance.current.destroy()
      if (usersChartInstance.current) usersChartInstance.current.destroy()
      if (completionRateChartInstance.current) completionRateChartInstance.current.destroy()
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
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Service Metrics</h1>
              <p className="text-muted-foreground">
                Analyze service performance with interactive charts and visualizations
              </p>
            </div>
            <div className="flex gap-2">
              <Select defaultValue="30">
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Time Range" />
                </SelectTrigger>
                <SelectContent>
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
                <CardTitle className="text-sm font-medium">Total Completed</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">347</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-green-500">+18.2%</span> from last month
                </p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">944</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Across all services
                </p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Completion</CardTitle>
                <Percent className="h-4 w-4 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">96.8%</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-green-500">+2.1%</span> from last month
                </p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Top Service</CardTitle>
                <TrendingUp className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Content Writing</div>
                <p className="text-xs text-muted-foreground mt-1">
                  112 completions
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts Grid */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Completed Services Bar Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Completed Services by Category</CardTitle>
                <CardDescription>
                  Total services completed within the period
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <canvas ref={completedChartRef}></canvas>
                </div>
                <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                  <Badge variant="outline" className="gap-1">
                    <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                    Technology
                  </Badge>
                  <Badge variant="outline" className="gap-1">
                    <span className="w-3 h-3 rounded-full bg-purple-500"></span>
                    Marketing
                  </Badge>
                  <Badge variant="outline" className="gap-1">
                    <span className="w-3 h-3 rounded-full bg-pink-500"></span>
                    Design
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Users per Service Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Users per Service Category</CardTitle>
                <CardDescription>
                  Distribution of users accessing each service type
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <canvas ref={usersChartRef}></canvas>
                </div>
                <div className="mt-4 text-center text-sm text-muted-foreground">
                  Total: 944 unique users
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Completion Rate Line Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Service Completion Rate Trends</CardTitle>
              <CardDescription>
                Monthly completion rate performance across top service categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <canvas ref={completionRateChartRef}></canvas>
              </div>
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <div className="flex items-center gap-3 p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20">
                  <div className="w-3 h-12 rounded bg-blue-500"></div>
                  <div>
                    <p className="text-sm font-medium">Web Development</p>
                    <p className="text-2xl font-bold">99%</p>
                    <p className="text-xs text-muted-foreground">Current rate</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-lg bg-purple-50 dark:bg-purple-950/20">
                  <div className="w-3 h-12 rounded bg-purple-500"></div>
                  <div>
                    <p className="text-sm font-medium">Digital Marketing</p>
                    <p className="text-2xl font-bold">97%</p>
                    <p className="text-xs text-muted-foreground">Current rate</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-lg bg-pink-50 dark:bg-pink-950/20">
                  <div className="w-3 h-12 rounded bg-pink-500"></div>
                  <div>
                    <p className="text-sm font-medium">Graphic Design</p>
                    <p className="text-2xl font-bold">100%</p>
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
