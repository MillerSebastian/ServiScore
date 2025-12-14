"use client"

import { IconTrendingDown, IconTrendingUp, IconShoppingCart, IconUsers, IconCurrencyDollar, IconChartBar } from "@tabler/icons-react"
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
}

export function ShopMetricsCards({ dateRange, location, category }: ShopMetricsCardsProps) {
  const metrics = [
    {
      title: "Total Sales",
      value: "$124,582.00",
      change: "+18.2%",
      trend: "up",
      description: "Total sales revenue",
      footer: "Compared to previous period",
      icon: IconCurrencyDollar,
    },
    {
      title: "Total Revenue",
      value: "$98,450.00",
      change: "+15.8%",
      trend: "up",
      description: "Net revenue after costs",
      footer: "Strong growth this period",
      icon: IconChartBar,
    },
    {
      title: "Customer Count",
      value: "3,842",
      change: "+12.4%",
      trend: "up",
      description: "Active customers",
      footer: "New customer acquisition up",
      icon: IconUsers,
    },
    {
      title: "Orders",
      value: "5,234",
      change: "-3.2%",
      trend: "down",
      description: "Total orders placed",
      footer: "Slight decrease from last period",
      icon: IconShoppingCart,
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
