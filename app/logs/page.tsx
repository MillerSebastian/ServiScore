"use client"

import { useState, useEffect } from "react"
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
  Calendar as CalendarIcon,
  Search,
  Filter,
  CheckCircle,
  MapPin,
  Store,
  Loader2,
  ShieldAlert,
  LogIn,
  LogOut,
  Laptop,
  Smartphone,
  Star
} from "lucide-react"

import { db, auth } from "@/lib/firebase"
import { collection, getDocs, query, orderBy, limit, where } from "firebase/firestore"
import { onAuthStateChanged } from "firebase/auth"
import { useRouter } from "next/navigation"

export default function LogsPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [date, setDate] = useState<Date>()
  const [filterType, setFilterType] = useState("all")

  const [activities, setActivities] = useState<any[]>([])
  const [services, setServices] = useState<any[]>([])
  const [systemLogs, setSystemLogs] = useState<any[]>([])
  const [storeLogs, setStoreLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/login")
        return
      }
      // Only fetch logs if user is present
      fetchData(user.uid)
    })
    return () => unsubscribe()
  }, [])

  const fetchData = async (uid: string) => {
    try {
      setLoading(true)

      // Fetch Stores (User's)
      const storesQuery = query(collection(db, "stores"), where("user_id", "==", uid))
      const storesSnap = await getDocs(storesQuery)
      const storesData = storesSnap.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .sort((a: any, b: any) => (b.createdAt && a.createdAt ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime() : 0)) as any[]

      // Fetch Services (User's)
      const servicesQuery = query(collection(db, "services"), where("user_id", "==", uid))
      const servicesSnap = await getDocs(servicesQuery)
      const servicesData = servicesSnap.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .sort((a: any, b: any) => (b.createdAt && a.createdAt ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime() : 0)) as any[]

      setServices(servicesData)

      // Fetch System Logs (User's)
      const logsQuery = query(collection(db, "system_logs"), where("userId", "==", uid), limit(50))
      const logsSnap = await getDocs(logsQuery)
      const logsData = logsSnap.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .sort((a: any, b: any) => (b.timestamp && a.timestamp ? new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime() : 0)) as any[]

      setSystemLogs(logsData)

      // Fetch Store Logs (User's Stores)
      let storeLogsData: any[] = []
      const userStoreIds = storesData.map(s => s.id)

      if (userStoreIds.length > 0) {
        // Take top 10 recent stores to filter logs
        const targetStoreIds = userStoreIds.slice(0, 10)
        const storeLogsQuery = query(collection(db, "store_logs"), where("storeId", "in", targetStoreIds), limit(50))
        const storeLogsSnap = await getDocs(storeLogsQuery)
        storeLogsData = storeLogsSnap.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .sort((a: any, b: any) => (b.timestamp && a.timestamp ? new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime() : 0)) as any[]
      }
      setStoreLogs(storeLogsData)

      // Consolidate into Activity Log
      const combined = [
        ...storesData.map(s => ({
          id: s.id,
          source: 'System',
          action: 'New Store Created',
          details: `Store "${s.store_name}" registered`,
          type: 'General',
          timestamp: s.createdAt ? new Date(s.createdAt) : new Date(),
          value: 0,
          status: 'success'
        })),
        ...servicesData.map(s => ({
          id: s.id,
          source: 'User',
          action: 'New Service',
          details: `Service "${s.service_title}" added`,
          type: 'Service',
          timestamp: s.createdAt ? new Date(s.createdAt) : new Date(),
          value: Number(s.service_price) || 0,
          status: 'success'
        }))
      ].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())

      setActivities(combined)
    } catch (error) {
      console.error("Failed to fetch logs:", error)
    } finally {
      setLoading(false)
    }
  }

  // Filter Logic
  const filteredActivities = activities.filter(item => {
    const matchesSearch = item.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.action.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === "all" ||
      (filterType === "service" && item.type === "Service") ||
      (filterType === "general" && item.type === "General")

    const matchesDate = !date || (
      item.timestamp.getDate() === date.getDate() &&
      item.timestamp.getMonth() === date.getMonth() &&
      item.timestamp.getFullYear() === date.getFullYear()
    )

    return matchesSearch && matchesType && matchesDate
  })

  // System Logs Filter Logic
  const filteredSystemLogs = systemLogs.filter(log => {
    const matchesSearch = log.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesDate = !date || (
      new Date(log.timestamp).getDate() === date.getDate() &&
      new Date(log.timestamp).getMonth() === date.getMonth() &&
      new Date(log.timestamp).getFullYear() === date.getFullYear()
    )

    return matchesSearch && matchesDate
  })

  // Store Logs Filter
  const filteredStoreLogs = storeLogs.filter(log => {
    const matchesSearch = log.storeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDate = !date || (
      new Date(log.timestamp).getDate() === date.getDate() &&
      new Date(log.timestamp).getMonth() === date.getMonth() &&
      new Date(log.timestamp).getFullYear() === date.getFullYear()
    )
    return matchesSearch && matchesDate
  })

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
              <h2 className="text-3xl font-bold tracking-tight">System Logs</h2>
              <p className="text-muted-foreground">
                Monitor activities across shops, services, and administration.
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative w-full md:w-72">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search logs..."
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
                  <SelectItem value="general">General (Stores)</SelectItem>
                  <SelectItem value="service">Services</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Tabs defaultValue="activity" className="space-y-4">
            <TabsList>
              <TabsTrigger value="activity" className="gap-2">
                <Briefcase className="h-4 w-4" />
                Activity Feed
              </TabsTrigger>
              <TabsTrigger value="system" className="gap-2">
                <ShieldAlert className="h-4 w-4 text-red-500" />
                System Logs (Admin)
              </TabsTrigger>
              <TabsTrigger value="store" className="gap-2">
                <Store className="h-4 w-4 text-blue-500" />
                Store Logs
              </TabsTrigger>
              <TabsTrigger value="performance" className="gap-2">
                <TrendingUp className="h-4 w-4" />
                Service Overview
              </TabsTrigger>
            </TabsList>

            <TabsContent value="activity" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>System Activity History</CardTitle>
                  <CardDescription>
                    Recent creation events for Stores and Services.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex justify-center p-8">
                      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Action</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Details</TableHead>
                          <TableHead>Source</TableHead>
                          <TableHead>Value</TableHead>
                          <TableHead>Timestamp</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredActivities.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                              No logs found matching your criteria.
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredActivities.map((log, idx) => (
                            <TableRow key={`${log.id}-${idx}`}>
                              <TableCell className="font-medium">{log.action}</TableCell>
                              <TableCell>
                                <Badge
                                  variant={log.type === "Service" ? "default" : "secondary"}
                                  className={log.type === "Service" ? "bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/20" : ""}
                                >
                                  {log.type}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-muted-foreground max-w-xs truncate">
                                {log.details}
                              </TableCell>
                              <TableCell>{log.source}</TableCell>
                              <TableCell>
                                {log.value > 0 ? (
                                  <span className="font-semibold text-green-600">
                                    ${log.value.toLocaleString()}
                                  </span>
                                ) : (
                                  <span className="text-muted-foreground">-</span>
                                )}
                              </TableCell>
                              <TableCell>{log.timestamp.toLocaleString()}</TableCell>
                              <TableCell>
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="system" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShieldAlert className="h-5 w-5 text-red-500" />
                    Administrative Actions
                  </CardTitle>
                  <CardDescription>
                    Sensitive system actions including Login, Logout, and access attempts.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex justify-center p-8">
                      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Action</TableHead>
                          <TableHead>User</TableHead>
                          <TableHead>IP Address</TableHead>
                          <TableHead>Device</TableHead>
                          <TableHead>Timestamp</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredSystemLogs.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                              No system logs found.
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredSystemLogs.map((log, idx) => (
                            <TableRow key={log.id}>
                              <TableCell>
                                <Badge
                                  className={cn(
                                    "flex w-fit gap-1",
                                    log.action.includes("Login") ? "bg-green-500/15 text-green-700 dark:text-green-400 border-green-500/20" :
                                      "bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/20"
                                  )}
                                >
                                  {log.action.includes("Login") ? <LogIn className="h-3 w-3" /> : <LogOut className="h-3 w-3" />}
                                  {log.action}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex flex-col">
                                  <span className="font-medium text-sm">{log.userName}</span>
                                  <span className="text-xs text-muted-foreground">{log.userEmail}</span>
                                </div>
                              </TableCell>
                              <TableCell className="font-mono text-xs">{log.ipAddress}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-1 text-xs text-muted-foreground max-w-[200px] truncate" title={log.device}>
                                  {log.device.includes("Mobile") ? <Smartphone className="h-3 w-3" /> : <Laptop className="h-3 w-3" />}
                                  {log.device}
                                </div>
                              </TableCell>
                              <TableCell className="text-xs text-muted-foreground">
                                {new Date(log.timestamp).toLocaleString()}
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="store" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Store className="h-5 w-5 text-blue-500" />
                    Store Activity Logs
                  </CardTitle>
                  <CardDescription>
                    Real-time tracking of Store Creation, Ratings, and Favorites with location data.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex justify-center p-8">
                      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Type</TableHead>
                          <TableHead>Store Name</TableHead>
                          <TableHead>Details</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Timestamp</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredStoreLogs.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                              No store logs found.
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredStoreLogs.map((log) => (
                            <TableRow key={log.id}>
                              <TableCell>
                                {log.type === 'Rating' ? (
                                  <Badge className={cn(
                                    "gap-1",
                                    log.value > 3 ? "bg-green-500/15 text-green-700 dark:text-green-400 border-green-500/20" : "bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/20"
                                  )}>
                                    <Star className="h-3 w-3 fill-current" />
                                    Review
                                  </Badge>
                                ) : log.type === 'Favorite' ? (
                                  <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/50 gap-1">
                                    <TrendingUp className="h-3 w-3" />
                                    Favorite
                                  </Badge>
                                ) : (
                                  <Badge variant="secondary">
                                    {log.action}
                                  </Badge>
                                )}
                              </TableCell>
                              <TableCell className="font-medium">{log.storeName}</TableCell>
                              <TableCell className="text-muted-foreground max-w-[250px] truncate">{log.details}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-1 text-xs">
                                  <MapPin className="h-3 w-3 text-muted-foreground" />
                                  {log.location || 'Unknown'}
                                </div>
                              </TableCell>
                              <TableCell className="text-xs text-muted-foreground">
                                {new Date(log.timestamp).toLocaleString()}
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="performance" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Service List Overview</CardTitle>
                  <CardDescription>
                    Current status and pricing of all registered services.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex justify-center p-8">
                      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Service Name</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Date Created</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {services.map((service) => (
                          <TableRow key={service.id}>
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-2">
                                <Briefcase className="h-4 w-4 text-muted-foreground" />
                                {service.service_title}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3 text-muted-foreground" />
                                {service.service_location}
                              </div>
                            </TableCell>
                            <TableCell className="font-semibold text-green-600">
                              ${Number(service.service_price || 0).toLocaleString()}
                            </TableCell>
                            <TableCell>
                              {service.createdAt ? new Date(service.createdAt).toLocaleDateString() : '-'}
                            </TableCell>
                            <TableCell>
                              <Badge variant={service.status_id === 1 ? "default" : "secondary"}>
                                {service.status_id === 1 ? "Active" : "Inactive"}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
