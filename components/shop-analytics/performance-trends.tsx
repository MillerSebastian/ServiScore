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
}

const dailyData = [
  { date: "Mon", sales: 4200, revenue: 3800, orders: 45 },
  { date: "Tue", sales: 3800, revenue: 3400, orders: 42 },
  { date: "Wed", sales: 5100, revenue: 4600, orders: 58 },
  { date: "Thu", sales: 4600, revenue: 4100, orders: 51 },
  { date: "Fri", sales: 6200, revenue: 5600, orders: 68 },
  { date: "Sat", sales: 7800, revenue: 7100, orders: 82 },
  { date: "Sun", sales: 6500, revenue: 5900, orders: 71 },
]

const weeklyData = [
  { week: "Week 1", sales: 28400, revenue: 25600, orders: 312 },
  { week: "Week 2", sales: 31200, revenue: 28100, orders: 345 },
  { week: "Week 3", sales: 29800, revenue: 26900, orders: 328 },
  { week: "Week 4", sales: 35100, revenue: 31600, orders: 387 },
]

const monthlyData = [
  { month: "Jan", sales: 98500, revenue: 88650, orders: 1089 },
  { month: "Feb", sales: 105200, revenue: 94680, orders: 1162 },
  { month: "Mar", sales: 112800, revenue: 101520, orders: 1246 },
  { month: "Apr", sales: 108900, revenue: 98010, orders: 1203 },
  { month: "May", sales: 118400, revenue: 106560, orders: 1308 },
  { month: "Jun", sales: 124500, revenue: 112050, orders: 1375 },
]

const chartConfig = {
  sales: {
    label: "Sales",
    color: "var(--chart-1)",
  },
  revenue: {
    label: "Revenue",
    color: "var(--chart-2)",
  },
  orders: {
    label: "Orders",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig

export function PerformanceTrends({ dateRange, location, category }: PerformanceTrendsProps) {
  const [timeRange, setTimeRange] = React.useState("daily")
  const [chartType, setChartType] = React.useState("line")

  const getData = () => {
    switch (timeRange) {
      case "daily":
        return dailyData
      case "weekly":
        return weeklyData
      case "monthly":
        return monthlyData
      default:
        return dailyData
    }
  }

  const getXAxisKey = () => {
    switch (timeRange) {
      case "daily":
        return "date"
      case "weekly":
        return "week"
      case "monthly":
        return "month"
      default:
        return "date"
    }
  }

  const data = getData()
  const xAxisKey = getXAxisKey()

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="@container/card md:col-span-2">
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Performance Trends</CardTitle>
              <CardDescription>
                Sales, revenue, and order trends over time
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
                onValueChange={setTimeRange}
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
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey={xAxisKey}
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => `$${value.toLocaleString()}`}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      labelFormatter={(value) => `${value}`}
                      formatter={(value) => `$${value.toLocaleString()}`}
                    />
                  }
                />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="var(--color-sales)"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="var(--color-revenue)"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            ) : (
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey={xAxisKey}
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => `$${value.toLocaleString()}`}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      labelFormatter={(value) => `${value}`}
                      formatter={(value) => `$${value.toLocaleString()}`}
                    />
                  }
                />
                <Bar dataKey="sales" fill="var(--color-sales)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="revenue" fill="var(--color-revenue)" radius={[4, 4, 0, 0]} />
              </BarChart>
            )}
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
