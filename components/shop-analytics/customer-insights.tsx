"use client"

import * as React from "react"
import { Pie, PieChart, Cell, ResponsiveContainer } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Progress } from "@/components/ui/progress"

interface CustomerInsightsProps {
  dateRange: { from: Date; to: Date }
  location: string
  category: string
  data?: {
    views: any[],
    logs: any[]
  }
}

export function CustomerInsights({ dateRange, location, category, data }: CustomerInsightsProps) {
  const views = data?.views || []
  const logs = data?.logs || []

  // 1. Device Stats (Demographics replacement)
  const deviceCounts: Record<string, number> = { Mobile: 0, Desktop: 0 }
  views.forEach(v => {
    const dev = v.device || "Desktop"
    deviceCounts[dev] = (deviceCounts[dev] || 0) + 1
  })

  // Calculate percentages
  const totalViews = views.length || 1
  const mobilePct = Math.round((deviceCounts['Mobile'] / totalViews) * 100)
  const desktopPct = Math.round((deviceCounts['Desktop'] / totalViews) * 100)

  const demographicsData = [
    { name: "Mobile", value: mobilePct, color: "var(--chart-1)" },
    { name: "Desktop", value: desktopPct, color: "var(--chart-2)" },
  ]
  // Fallback if no views
  if (views.length === 0) {
    demographicsData[0].value = 50
    demographicsData[1].value = 50
  }


  // 2. Engagement (Purchase Behavior replacement)
  const totalFavorites = logs.filter(l => l.action === 'Favorite').length
  const totalReviews = logs.filter(l => l.action === 'Review').length

  // Calculate specific actions
  const engagementData = [
    { category: "Viewed Store", percentage: 100, count: totalViews },
    { category: "Favorited", percentage: Math.round((totalFavorites / totalViews) * 100) || 0, count: totalFavorites },
  ]

  // 3. Ratings (Feedback Analysis)
  // Mock distribution since we don't have individual rating values in logs easily without parsing 'value' field from 'Review' action
  // Logs for 'Review' type SHOULD have 'value' as rating.
  const ratingLogs = logs.filter(l => l.type === 'Rating' || l.action === 'Review')
  const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  let ratingSum = 0

  ratingLogs.forEach(l => {
    const r = l.value || 5
    if (r >= 1 && r <= 5) {
      ratingCounts[r as keyof typeof ratingCounts]++
      ratingSum += r
    }
  })

  const totalRated = ratingLogs.length
  const avgRating = totalRated > 0 ? (ratingSum / totalRated).toFixed(1) : "0.0"

  const feedbackData = [5, 4, 3, 2, 1].map(star => ({
    rating: `${star} Star${star > 1 ? 's' : ''}`,
    count: ratingCounts[star as keyof typeof ratingCounts],
    percentage: totalRated > 0 ? Math.round((ratingCounts[star as keyof typeof ratingCounts] / totalRated) * 100) : 0
  }))

  const chartConfig = {
    value: {
      label: "Usage",
    },
  } satisfies ChartConfig

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {/* Device Usage Chart */}
      <Card className="@container/card">
        <CardHeader>
          <CardTitle>Device Usage</CardTitle>
          <CardDescription>Mobile vs Desktop Breakdown</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={demographicsData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {demographicsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Engagement Funnel */}
      <Card className="@container/card">
        <CardHeader>
          <CardTitle>Engagement Funnel</CardTitle>
          <CardDescription>Views to Favorites conversion</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {engagementData.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{item.category}</span>
                  <span className="text-sm text-muted-foreground">
                    {item.count.toLocaleString()} ({item.percentage}%)
                  </span>
                </div>
                <Progress value={item.percentage} className="h-2" />
              </div>
            ))}
            <div className="pt-4 border-t">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Conversion Rate</span>
                <span className="text-lg font-bold">
                  {totalViews > 0 ? ((totalFavorites / totalViews) * 100).toFixed(1) : 0}%
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ratings Distribution */}
      <Card className="@container/card">
        <CardHeader>
          <CardTitle>Rating Distribution</CardTitle>
          <CardDescription>Based on recent reviews</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {feedbackData.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{item.rating}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {item.count.toLocaleString()}
                    </span>
                    <span className="text-sm font-medium">{item.percentage}%</span>
                  </div>
                </div>
                <Progress value={item.percentage} className="h-2" />
              </div>
            ))}
            <div className="pt-4 border-t">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Average Rating</span>
                <span className="text-lg font-bold">{avgRating} / 5.0</span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm font-medium">Total Reviews</span>
                <span className="text-lg font-bold">{totalRated}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
