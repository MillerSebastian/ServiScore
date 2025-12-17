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
  Briefcase,
  TrendingUp,
  TrendingDown,
  Users,
  Star,
  Calendar as CalendarIcon,
  Search,
  Filter,
  Download,
  CheckCircle,
  Clock,
  MapPin,
  DollarSign,
  MessageSquare,
  Award,
} from "lucide-react"

const serviceActivityLogs = [
  {
    id: 1,
    serviceName: "Web Development",
    action: "New Booking",
    type: "General",
    details: "E-commerce website project booked by TechCorp Inc.",
    timestamp: "2024-12-13T11:20:00",
    customer: "TechCorp Inc.",
    status: "success",
    value: 5000,
  },
  {
    id: 2,
    serviceName: "Digital Marketing",
    action: "Service Completed",
    type: "General",
    details: "SEO campaign completed for Fashion Brand Ltd.",
    timestamp: "2024-12-13T10:00:00",
    customer: "Fashion Brand Ltd.",
    status: "success",
    value: 2500,
  },
  {
    id: 3,
    serviceName: "Graphic Design",
    action: "Price Updated",
    type: "Special",
    details: "Premium package price changed from $800 to $950",
    timestamp: "2024-12-13T09:30:00",
    customer: "System",
    status: "success",
    value: 0,
  },
  {
    id: 4,
    serviceName: "Consulting Services",
    action: "New Review Received",
    type: "General",
    details: "5-star review: 'Exceptional service and expertise'",
    timestamp: "2024-12-12T18:45:00",
    customer: "Sarah Johnson",
    status: "success",
    value: 0,
  },
  {
    id: 5,
    serviceName: "Web Development",
    action: "Service Modified",
    type: "Special",
    details: "Added React.js and Next.js to tech stack options",
    timestamp: "2024-12-12T16:15:00",
    customer: "Admin User",
    status: "success",
    value: 0,
  },
]

const servicePerformanceLogs = [
  {
    id: 1,
    serviceName: "Web Development",
    bookings: 45,
    revenue: 187500,
    trend: "up",
    change: "+28.3%",
    rating: 4.9,
    completionRate: "96%",
  },
  {
    id: 2,
    serviceName: "Digital Marketing",
    bookings: 67,
    revenue: 145200,
    trend: "up",
    change: "+15.7%",
    rating: 4.8,
    completionRate: "94%",
  },
  {
    id: 3,
    serviceName: "Graphic Design",
    bookings: 89,
    revenue: 98300,
    trend: "up",
    change: "+32.1%",
    rating: 4.7,
    completionRate: "98%",
  },
  {
    id: 4,
    serviceName: "Consulting Services",
    bookings: 34,
    revenue: 125600,
    trend: "down",
    change: "-8.2%",
    rating: 4.9,
    completionRate: "92%",
  },
  {
    id: 5,
    serviceName: "Content Writing",
    bookings: 112,
    revenue: 56780,
    trend: "up",
    change: "+41.5%",
    rating: 4.6,
    completionRate: "99%",
  },
]

const serviceReviewLogs = [
  {
    id: 1,
    serviceName: "Web Development",
    customer: "John Smith",
    rating: 5,
    review: "Outstanding work! The team delivered exactly what we needed.",
    location: "New York, USA",
    timestamp: "2024-12-13T14:30:00",
    verified: true,
  },
  {
    id: 2,
    serviceName: "Digital Marketing",
    customer: "Emily Davis",
    rating: 5,
    review: "Excellent SEO results. Our traffic increased by 200%!",
    location: "Los Angeles, USA",
    timestamp: "2024-12-13T12:15:00",
    verified: true,
  },
  {
    id: 3,
    serviceName: "Graphic Design",
    customer: "Michael Brown",
    rating: 4,
    review: "Great designs, minor revisions needed but overall satisfied.",
    location: "Chicago, USA",
    timestamp: "2024-12-13T10:45:00",
    verified: true,
  },
  {
    id: 4,
    serviceName: "Consulting Services",
    customer: "Sarah Johnson",
    rating: 5,
    review: "Exceptional service and expertise. Highly recommended!",
    location: "Miami, USA",
    timestamp: "2024-12-12T18:45:00",
    verified: true,
  },
  {
    id: 5,
    serviceName: "Content Writing",
    customer: "David Wilson",
    rating: 5,
    review: "Professional, timely, and high-quality content delivery.",
    location: "Seattle, USA",
    timestamp: "2024-12-12T16:20:00",
    verified: false,
  },
]

export default function ServiceLogsPage() {
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
              <h2 className="text-3xl font-bold tracking-tight">Service Logs</h2>
              <p className="text-muted-foreground">
                Comprehensive tracking of service activities, bookings, performance, and customer reviews.
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
                placeholder="Search service logs..."
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
                <Briefcase className="h-4 w-4" />
                Service Activity
              </TabsTrigger>
              <TabsTrigger value="performance" className="gap-2">
                <TrendingUp className="h-4 w-4" />
                Performance Metrics
              </TabsTrigger>
              <TabsTrigger value="reviews" className="gap-2">
                <MessageSquare className="h-4 w-4" />
                Customer Reviews
              </TabsTrigger>
            </TabsList>

            <TabsContent value="activity" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Service Activity History</CardTitle>
                  <CardDescription>
                    Recent bookings, updates, and changes across all offered services.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Service</TableHead>
                        <TableHead>Action</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Details</TableHead>
                        <TableHead>Customer/User</TableHead>
                        <TableHead>Value</TableHead>
                        <TableHead>Timestamp</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {serviceActivityLogs.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell className="font-medium">{log.serviceName}</TableCell>
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
                          <TableCell>{log.customer}</TableCell>
                          <TableCell>
                            {log.value > 0 ? (
                              <span className="font-semibold text-green-600">
                                ${log.value.toLocaleString()}
                              </span>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
                          <TableCell>
                            <CheckCircle className="h-4 w-4 text-green-500" />
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
                  <CardTitle>Service Performance Overview</CardTitle>
                  <CardDescription>
                    Bookings, revenue, ratings, and completion rates for each service.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Service Name</TableHead>
                        <TableHead>Bookings</TableHead>
                        <TableHead>Revenue</TableHead>
                        <TableHead>Trend</TableHead>
                        <TableHead>Rating</TableHead>
                        <TableHead>Completion Rate</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {servicePerformanceLogs.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell className="font-medium">{log.serviceName}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4 text-blue-500" />
                              {log.bookings}
                            </div>
                          </TableCell>
                          <TableCell className="font-semibold">
                            <div className="flex items-center gap-1">
                              <DollarSign className="h-4 w-4 text-green-500" />
                              {log.revenue.toLocaleString()}
                            </div>
                          </TableCell>
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
                              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                              <span className="font-medium">{log.rating}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="font-medium">
                              {log.completionRate}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Customer Reviews & Feedback</CardTitle>
                  <CardDescription>
                    Recent customer reviews and ratings for your services.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {serviceReviewLogs.map((log) => (
                    <div key={log.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold">{log.serviceName}</h4>
                            {log.verified && (
                              <Badge variant="outline" className="text-xs gap-1">
                                <CheckCircle className="h-3 w-3" />
                                Verified
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="font-medium">{log.customer}</span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {log.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {new Date(log.timestamp).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: log.rating }).map((_, i) => (
                            <Star key={i} className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                          ))}
                        </div>
                      </div>
                      <p className="text-muted-foreground leading-relaxed">{log.review}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
