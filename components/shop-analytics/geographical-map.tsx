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
}

const locationData = [
  { region: "North America", sales: 45200, percentage: 35, growth: "+12.5%", color: "bg-blue-500" },
  { region: "Europe", sales: 38900, percentage: 30, growth: "+8.3%", color: "bg-green-500" },
  { region: "Asia", sales: 29400, percentage: 23, growth: "+18.7%", color: "bg-purple-500" },
  { region: "South America", sales: 8100, percentage: 6, growth: "+5.2%", color: "bg-yellow-500" },
  { region: "Africa", sales: 4500, percentage: 4, growth: "+15.1%", color: "bg-orange-500" },
  { region: "Oceania", sales: 2500, percentage: 2, growth: "+3.8%", color: "bg-pink-500" },
]

export function GeographicalMap({ dateRange, category }: GeographicalMapProps) {
  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Geographical Performance</CardTitle>
        <CardDescription>
          Shop performance breakdown by location
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="relative h-64 md:h-80 bg-muted/30 rounded-lg overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-full h-full max-w-4xl">
                <svg viewBox="0 0 800 400" className="w-full h-full">
                  <rect x="50" y="50" width="700" height="300" fill="var(--muted)" rx="8" />
                  
                  <circle cx="150" cy="150" r="40" fill="var(--primary)" opacity="0.7" />
                  <text x="150" y="155" textAnchor="middle" fill="var(--primary-foreground)" fontSize="12" fontWeight="bold">NA</text>
                  
                  <circle cx="400" cy="140" r="35" fill="var(--primary)" opacity="0.6" />
                  <text x="400" y="145" textAnchor="middle" fill="var(--primary-foreground)" fontSize="12" fontWeight="bold">EU</text>
                  
                  <circle cx="600" cy="180" r="30" fill="var(--primary)" opacity="0.5" />
                  <text x="600" y="185" textAnchor="middle" fill="var(--primary-foreground)" fontSize="12" fontWeight="bold">AS</text>
                  
                  <circle cx="200" cy="280" r="15" fill="var(--primary)" opacity="0.4" />
                  <text x="200" y="285" textAnchor="middle" fill="var(--primary-foreground)" fontSize="10" fontWeight="bold">SA</text>
                  
                  <circle cx="450" cy="260" r="12" fill="var(--primary)" opacity="0.3" />
                  <text x="450" y="265" textAnchor="middle" fill="var(--primary-foreground)" fontSize="10" fontWeight="bold">AF</text>
                  
                  <circle cx="680" cy="300" r="10" fill="var(--primary)" opacity="0.3" />
                  <text x="680" y="305" textAnchor="middle" fill="var(--primary-foreground)" fontSize="9" fontWeight="bold">OC</text>
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
                    <p className="font-medium">{location.region}</p>
                    <p className="text-sm text-muted-foreground">
                      ${location.sales.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="outline" className="mb-1">
                    {location.growth}
                  </Badge>
                  <p className="text-sm font-medium">{location.percentage}%</p>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Total Global Sales</span>
              <span className="font-semibold text-lg">
                ${locationData.reduce((sum, loc) => sum + loc.sales, 0).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
