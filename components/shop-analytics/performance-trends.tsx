"use client"

import * as React from "react"
import { Bar, BarChart, Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  Card,
  CardAction,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"

interface PerformanceTrendsProps {
  dateRange: { from: Date; to: Date }
  location: string
  category: string
  data?: {
    views: any[],
    logs: any[]
  }
}

const chartConfig = {
  views: {
    label: "Views",
    color: "var(--chart-1)",
  },
  favorites: {
    label: "Favorites",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

export function PerformanceTrends({ dateRange, location, category, data }: PerformanceTrendsProps) {
  const [timeRange, setTimeRange] = React.useState("daily")
  const [chartType, setChartType] = React.useState("line")

  const views = data?.views || []
  const logs = data?.logs || []
  const favorites = logs.filter(l => l.action === 'Favorite')

  const getData = () => {
    // 1. Initialize buckets
    const bucketMap: Record<string, { date: string, views: number, favorites: number }> = {}

    // Helper to get key
    const getKey = (dateStr: string) => {
      const d = new Date(dateStr)
      if (timeRange === 'daily') {
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      } else if (timeRange === 'weekly') {
        // Simple week number approx
        const start = new Date(dateRange.from)
        const diff = d.getTime() - start.getTime()
        const weekNum = Math.floor(diff / (7 * 24 * 60 * 60 * 1000)) + 1
        return `Week ${weekNum}`
      } else {
        return d.toLocaleDateString('en-US', { month: 'short' })
      }
    }

    // 2. Fill buckets with 0s for the range (optional, for smoother chart)
    // Checking every day in range is expensive here? No, just 30 days default.
    // For MVP, just bucket existing data.

    // 3. Process Data
    const processItems = (items: any[], type: 'views' | 'favorites') => {
      items.forEach(item => {
        const key = getKey(item.timestamp)
        if (!bucketMap[key]) {
          bucketMap[key] = { date: key, views: 0, favorites: 0 }
        }
        bucketMap[key][type]++
      })
    }

    processItems(views, 'views')
    processItems(favorites, 'favorites')

    // 4. Convert to array
    let result = Object.values(bucketMap)

    // Sort by Date? Since keys are strings, sorting might be tricky without original timestamp.
    // Better to pre-generate keys for the range.
    // Quick fix: Just let them be in order of appearance (which is random in Obj) -> No, bad.
    // Correct approach: Generate all dates in range.

    const filledData: any[] = []
    let current = new Date(dateRange.from)
    const end = new Date(dateRange.to)

    while (current <= end) {
      const key = getKey(current.toISOString())
      // Check if already added to filledData (duplicates possible if multiple days map to same Week/Month)
      let existing = filledData.find(d => d.date === key)
      if (!existing) {
        existing = { date: key, views: 0, favorites: 0 }
        filledData.push(existing)
      }

      // Add counts from our raw bucketMap if any
      // Actually simpler: Just iterate logs and add to 'existing' if match.
      // But 'getKey' logic above is same.

      current.setDate(current.getDate() + 1)
    }

    // Now populate counts
    const populate = (items: any[], keyName: 'views' | 'favorites') => {
      items.forEach(item => {
        const key = getKey(item.timestamp)
        const entry = filledData.find(d => d.date === key)
        if (entry) entry[keyName]++
      })
    }
    populate(views, 'views')
    populate(favorites, 'favorites')

    return filledData
  }

  const chartData = getData()

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="@container/card md:col-span-2">
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Performance Trends</CardTitle>
              <CardDescription>
                Views and Favorites over time
              </CardDescription>
            </div>
            <div className="flex flex-col gap-2 md:flex-row md:items-center">
              <Select value={chartType} onValueChange={setChartType}>
                <SelectTrigger className="w-full md:w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="line">Line Chart</SelectItem>
                  <SelectItem value="bar">Bar Chart</SelectItem>
                </SelectContent>
              </Select>
              <ToggleGroup
                type="single"
                value={timeRange}
                onValueChange={(val) => val && setTimeRange(val)}
                variant="outline"
                className="justify-start"
              >
                <ToggleGroupItem value="daily">Daily</ToggleGroupItem>
                <ToggleGroupItem value="weekly">Weekly</ToggleGroupItem>
                <ToggleGroupItem value="monthly">Monthly</ToggleGroupItem>
              </ToggleGroup>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
          <ChartContainer config={chartConfig} className="aspect-auto h-[350px] w-full">
            {chartType === "line" ? (
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      labelFormatter={(value) => `${value}`}
                    />
                  }
                />
                <Line
                  type="monotone"
                  dataKey="views"
                  stroke="var(--color-views)"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="favorites"
                  stroke="var(--color-favorites)"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            ) : (
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      labelFormatter={(value) => `${value}`}
                    />
                  }
                />
                <Bar dataKey="views" fill="var(--color-views)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="favorites" fill="var(--color-favorites)" radius={[4, 4, 0, 0]} />
              </BarChart>
            )}
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
