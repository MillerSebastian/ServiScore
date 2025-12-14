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
}

const demographicsData = [
  { name: "18-24", value: 15, color: "var(--chart-1)" },
  { name: "25-34", value: 35, color: "var(--chart-2)" },
  { name: "35-44", value: 28, color: "var(--chart-3)" },
  { name: "45-54", value: 15, color: "var(--chart-4)" },
  { name: "55+", value: 7, color: "var(--chart-5)" },
]

const purchaseBehavior = [
  { category: "Repeat Customers", percentage: 68, count: 2612 },
  { category: "New Customers", percentage: 32, count: 1230 },
]

const feedbackData = [
  { rating: "5 Stars", count: 1842, percentage: 48 },
  { rating: "4 Stars", count: 1265, percentage: 33 },
  { rating: "3 Stars", count: 462, percentage: 12 },
  { rating: "2 Stars", count: 192, percentage: 5 },
  { rating: "1 Star", count: 81, percentage: 2 },
]

const chartConfig = {
  value: {
    label: "Customers",
  },
} satisfies ChartConfig

export function CustomerInsights({ dateRange, location, category }: CustomerInsightsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card className="@container/card">
        <CardHeader>
          <CardTitle>Customer Demographics</CardTitle>
          <CardDescription>Age distribution of customers</CardDescription>
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

      <Card className="@container/card">
        <CardHeader>
          <CardTitle>Purchase Behavior</CardTitle>
          <CardDescription>Customer retention metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {purchaseBehavior.map((item, index) => (
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
                <span className="text-sm font-medium">Average Order Value</span>
                <span className="text-lg font-bold">$32.45</span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm font-medium">Purchase Frequency</span>
                <span className="text-lg font-bold">2.8x/month</span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm font-medium">Customer Lifetime Value</span>
                <span className="text-lg font-bold">$892</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardTitle>Feedback Analysis</CardTitle>
          <CardDescription>Customer satisfaction ratings</CardDescription>
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
                <span className="text-lg font-bold">4.2 / 5.0</span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm font-medium">Total Reviews</span>
                <span className="text-lg font-bold">3,842</span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm font-medium">Response Rate</span>
                <span className="text-lg font-bold">94%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
