"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { ShopMetricsCards } from "@/components/shop-analytics/shop-metrics-cards"
import { PerformanceTrends } from "@/components/shop-analytics/performance-trends"
import { GeographicalMap } from "@/components/shop-analytics/geographical-map"
import { CustomerInsights } from "@/components/shop-analytics/customer-insights"
import { AnalyticsFilters } from "@/components/shop-analytics/analytics-filters"

export default function ShopAnalyticsPage() {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date(),
  })
  const [selectedLocation, setSelectedLocation] = useState<string>("all")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

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
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="px-4 lg:px-6">
                <div className="mb-6">
                  <h1 className="text-3xl font-bold tracking-tight">Shop Analytics Dashboard</h1>
                  <p className="text-muted-foreground mt-2">
                    Comprehensive insights for shop accounts and performance metrics
                  </p>
                </div>

                <AnalyticsFilters
                  dateRange={dateRange}
                  onDateRangeChange={setDateRange}
                  selectedLocation={selectedLocation}
                  onLocationChange={setSelectedLocation}
                  selectedCategory={selectedCategory}
                  onCategoryChange={setSelectedCategory}
                />
              </div>

              <ShopMetricsCards 
                dateRange={dateRange}
                location={selectedLocation}
                category={selectedCategory}
              />

              <div className="px-4 lg:px-6">
                <PerformanceTrends 
                  dateRange={dateRange}
                  location={selectedLocation}
                  category={selectedCategory}
                />
              </div>

              <div className="px-4 lg:px-6">
                <GeographicalMap 
                  dateRange={dateRange}
                  category={selectedCategory}
                />
              </div>

              <div className="px-4 lg:px-6">
                <CustomerInsights 
                  dateRange={dateRange}
                  location={selectedLocation}
                  category={selectedCategory}
                />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
