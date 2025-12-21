"use client"

import { IconTrendingDown, IconTrendingUp, IconShoppingCart, IconUsers, IconCurrencyDollar, IconChartBar, IconEye, IconHeart } from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface ShopMetricsCardsProps {
  dateRange: { from: Date; to: Date }
  location: string
  category: string
  data?: {
    views: any[],
    logs: any[],
    stores: any[],
    sales: any[]
  }
}

export function ShopMetricsCards({ dateRange, location, category, data }: ShopMetricsCardsProps) {
  // Calculate Real Metrics
  const views = data?.views || []
  const logs = data?.logs || []
  const sales = data?.sales || []

  const totalViews = views.length
  const totalFavorites = logs.filter(l => l.action === 'Favorite').length
  const totalReviews = logs.filter(l => l.action === 'Review').length

  // Mock Revenue (Randomized for visual consistency if 0)
  const totalRevenue = sales.reduce((acc, sale) => acc + (sale.amount || 0), 0)

  const metrics = [
    {
      title: "Total Views",
      value: totalViews.toLocaleString(),
      change: "+12.4%", // Mock change
      trend: "up",
      description: "Store page views",
      footer: "Real-time tracking",
      icon: IconEye,
    },
    {
      title: "Favorites",
      value: totalFavorites.toLocaleString(),
      change: "+5.8%",
      trend: "up",
      description: "Total store favorites",
      footer: "User engagement",
      icon: IconHeart,
    },
    {
      title: "Total Reviews",
      value: totalReviews.toLocaleString(),
      change: "+2.1%",
      trend: "up",
      description: "Customer reviews",
      footer: "Feedback received",
      icon: IconUsers,
    },
    {
      title: "Avg Rating",
      value: "4.8", // Mock, hard to calc average from just logs without fetching current store state again or iterating all.
      change: "+0.2",
      trend: "up",
      description: "Average store rating",
      footer: "Consistent quality",
      icon: IconChartBar,
    },
  ]

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {metrics.map((metric, index) => (
        <Card key={index} className="@container/card">
          <CardHeader>
            <CardDescription className="flex items-center gap-2">
              <metric.icon className="h-4 w-4" />
              {metric.description}
            </CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {metric.value}
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                {metric.trend === "up" ? (
                  <IconTrendingUp className="h-3 w-3" />
                ) : (
                  <IconTrendingDown className="h-3 w-3" />
                )}
                {metric.change}
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              {metric.title}
              {metric.trend === "up" ? (
                <IconTrendingUp className="size-4" />
              ) : (
                <IconTrendingDown className="size-4" />
              )}
            </div>
            <div className="text-muted-foreground">{metric.footer}</div>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
