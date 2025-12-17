"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import {
  Store,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Package,
  Eye,
  Calendar as CalendarIcon,
  Search,
  Filter,
  Download,
  AlertCircle,
  CheckCircle,
  Clock,
  MapPin,
} from "lucide-react"

const storeActivityLogs = [
  {
    id: 1,
    storeName: "Tech Haven",
    action: "Product Added",
    type: "General",
    details: "New iPhone 15 Pro Max added to inventory",
    timestamp: "2024-12-13T10:30:00",
    user: "Admin User",
    status: "success",
  },
  {
    id: 2,
    storeName: "Fashion Hub",
    action: "Price Update",
    type: "Special",
    details: "Winter sale: 30% discount applied to 45 items",
    timestamp: "2024-12-13T09:15:00",
    user: "Store Manager",
    status: "success",
  },
  {
    id: 3,
    storeName: "Tech Haven",
    action: "Store Settings Modified",
    type: "Special",
    details: "Changed business hours and delivery zones",
    timestamp: "2024-12-13T08:45:00",
    user: "Admin User",
    status: "success",
  },
  {
    id: 4,
    storeName: "Home Decor Plus",
    action: "Inventory Update",
    type: "General",
    details: "Stock replenished: 120 items across 8 categories",
    timestamp: "2024-12-12T16:20:00",
    user: "Inventory Manager",
    status: "success",
  },
  {
    id: 5,
    storeName: "Fashion Hub",
    action: "Order Cancellation",
    type: "General",
    details: "Order #ORD-2024-1543 cancelled by customer",
    timestamp: "2024-12-12T14:10:00",
    user: "System",
    status: "warning",
  },
]

const storePerformanceLogs = [
  {
    id: 1,
    storeName: "Tech Haven",
    revenue: 45230,
    orders: 89,
    trend: "up",
    change: "+18.5%",
    rating: 4.8,
    location: "New York, USA",
  },
  {
    id: 2,
    storeName: "Fashion Hub",
    revenue: 38950,
    orders: 124,
    trend: "up",
    change: "+24.2%",
    rating: 4.9,
    location: "Los Angeles, USA",
  },
  {
    id: 3,
    storeName: "Home Decor Plus",
    revenue: 29870,
    orders: 67,
    trend: "down",
    change: "-5.3%",
    rating: 4.6,
    location: "Chicago, USA",
  },
  {
    id: 4,
    storeName: "Sports World",
    revenue: 52100,
    orders: 156,
    trend: "up",
    change: "+31.7%",
    rating: 4.7,
    location: "Miami, USA",
  },
]

const storeVisitorLogs = [
  {
    id: 1,
    storeName: "Tech Haven",
    visitors: 2450,
    uniqueVisitors: 1890,
    bounceRate: "32%",
    avgDuration: "4:32",
    topProduct: "iPhone 15 Pro",
    timestamp: "2024-12-13",
  },
  {
    id: 2,
    storeName: "Fashion Hub",
    visitors: 3120,
    uniqueVisitors: 2340,
    bounceRate: "28%",
    avgDuration: "5:45",
    topProduct: "Winter Jacket",
    timestamp: "2024-12-13",
  },
  {
    id: 3,
    storeName: "Home Decor Plus",
    visitors: 1780,
    uniqueVisitors: 1420,
    bounceRate: "41%",
    avgDuration: "3:18",
    topProduct: "Lamp Set",
    timestamp: "2024-12-13",
  },
]

export default function StoreLogsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [date, setDate] = useState<Date>()
  const [filterType, setFilterType] = useState("all")

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
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-2 py-4">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Store Logs</h2>
              <p className="text-muted-foreground">
                Comprehensive tracking of store activities, performance, and visitor analytics.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Export CSV
              </Button>
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Export PDF
              </Button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative w-full md:w-72">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search store logs..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2 flex-1 md:flex-none">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-60 justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-45">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter by Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="special">Special</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Tabs defaultValue="activity" className="space-y-4">
            <TabsList>
              <TabsTrigger value="activity" className="gap-2">
                <Store className="h-4 w-4" />
                Store Activity
              </TabsTrigger>
              <TabsTrigger value="performance" className="gap-2">
                <TrendingUp className="h-4 w-4" />
                Performance Metrics
              </TabsTrigger>
              <TabsTrigger value="visitors" className="gap-2">
                <Eye className="h-4 w-4" />
                Visitor Analytics
              </TabsTrigger>
            </TabsList>

            <TabsContent value="activity" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Store Activity History</CardTitle>
                  <CardDescription>
                    Recent actions and changes across all managed stores.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Store</TableHead>
                        <TableHead>Action</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Details</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Timestamp</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {storeActivityLogs.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell className="font-medium">{log.storeName}</TableCell>
                          <TableCell>{log.action}</TableCell>
                          <TableCell>
                            <Badge
                              variant={log.type === "Special" ? "default" : "secondary"}
                              className={log.type === "Special" ? "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/20" : ""}
                            >
                              {log.type}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground max-w-xs truncate">
                            {log.details}
                          </TableCell>
                          <TableCell>{log.user}</TableCell>
                          <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
                          <TableCell>
                            {log.status === "success" ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : log.status === "warning" ? (
                              <AlertCircle className="h-4 w-4 text-yellow-500" />
                            ) : (
                              <Clock className="h-4 w-4 text-blue-500" />
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="performance" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Store Performance Overview</CardTitle>
                  <CardDescription>
                    Revenue, orders, and rating metrics for each store.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Store Name</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Revenue</TableHead>
                        <TableHead>Orders</TableHead>
                        <TableHead>Trend</TableHead>
                        <TableHead>Rating</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {storePerformanceLogs.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell className="font-medium">{log.storeName}</TableCell>
                          <TableCell className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            {log.location}
                          </TableCell>
                          <TableCell className="font-semibold">
                            ${log.revenue.toLocaleString()}
                          </TableCell>
                          <TableCell>{log.orders}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              {log.trend === "up" ? (
                                <TrendingUp className="h-4 w-4 text-green-500" />
                              ) : (
                                <TrendingDown className="h-4 w-4 text-red-500" />
                              )}
                              <span className={log.trend === "up" ? "text-green-500" : "text-red-500"}>
                                {log.change}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Package className="h-4 w-4 text-yellow-500" />
                              {log.rating}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="visitors" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Visitor Analytics</CardTitle>
                  <CardDescription>
                    Detailed insights on store traffic and user behavior.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Store Name</TableHead>
                        <TableHead>Total Visitors</TableHead>
                        <TableHead>Unique Visitors</TableHead>
                        <TableHead>Bounce Rate</TableHead>
                        <TableHead>Avg Duration</TableHead>
                        <TableHead>Top Product</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {storeVisitorLogs.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell className="font-medium">{log.storeName}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4 text-blue-500" />
                              {log.visitors.toLocaleString()}
                            </div>
                          </TableCell>
                          <TableCell>{log.uniqueVisitors.toLocaleString()}</TableCell>
                          <TableCell>{log.bounceRate}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              {log.avgDuration}
                            </div>
                          </TableCell>
                          <TableCell className="text-muted-foreground">{log.topProduct}</TableCell>
                          <TableCell>{log.timestamp}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
