"use client"

import * as React from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface GeographicalMapProps {
  dateRange: { from: Date; to: Date }
  category: string
  data?: {
    views: any[]
  }
}

export function GeographicalMap({ dateRange, category, data }: GeographicalMapProps) {
  const views = data?.views || []

  // Aggregate views by location
  const locationCounts: Record<string, number> = {}
  views.forEach(v => {
    const loc = v.location || "Unknown"
    locationCounts[loc] = (locationCounts[loc] || 0) + 1
  })

  // Convert to array and sort
  const locationData = Object.entries(locationCounts)
    .map(([region, count]) => ({
      region,
      sales: count, // Using count as proxy for "sales" or just "visits"
      percentage: Math.round((count / views.length) * 100) || 0,
      growth: "+0%", // Mock growth
      color: "bg-blue-500" // Default color
    }))
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 6) // Top 6

  // Fallback if empty
  if (locationData.length === 0) {
    locationData.push({ region: "No Data Yet", sales: 0, percentage: 0, growth: "-", color: "bg-gray-300" })
  }

  const totalInteractions = locationData.reduce((sum, d) => sum + d.sales, 0)

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Geographical Performance</CardTitle>
        <CardDescription>
          Store views breakdown by location
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="relative h-64 md:h-80 bg-muted/30 rounded-lg overflow-hidden">
            {/* Simple Map Visualization Placeholder - Static for now as dynamic mapping is complex */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-full h-full max-w-4xl opacity-50 grayscale">
                {/* Re-using existing SVG but deemphasized since dots won't match real data yet */}
                <svg viewBox="0 0 800 400" className="w-full h-full">
                  <rect x="50" y="50" width="700" height="300" fill="var(--muted)" rx="8" />
                  <text x="400" y="200" textAnchor="middle" fill="var(--foreground)" fontSize="14">
                    Map visualization requires geo-coordinates
                  </text>
                </svg>
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {locationData.map((location, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${location.color}`} />
                  <div>
                    <p className="font-medium truncate max-w-[120px]" title={location.region}>{location.region}</p>
                    <p className="text-sm text-muted-foreground">
                      {location.sales.toLocaleString()} views
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="outline" className="mb-1">
                    {location.percentage}%
                  </Badge>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Total Views Logged</span>
              <span className="font-semibold text-lg">
                {totalInteractions.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
