"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { format } from "date-fns"
import { 
  Search, 
  Filter, 
  Download, 
  MapPin, 
  Monitor, 
  Smartphone, 
  Calendar as CalendarIcon,
  ShieldAlert,
  FileText,
  Eye
} from "lucide-react"
import { cn } from "@/lib/utils"

// Mock Data
const sessionLogs = [
  { id: 1, location: "New York, USA", device: "Desktop (Chrome)", ip: "192.168.1.1", timestamp: "2024-03-15T10:30:00" },
  { id: 2, location: "London, UK", device: "Mobile (Safari)", ip: "10.0.0.5", timestamp: "2024-03-14T15:45:00" },
  { id: 3, location: "Toronto, Canada", device: "Desktop (Firefox)", ip: "172.16.0.1", timestamp: "2024-03-13T09:20:00" },
  { id: 4, location: "Paris, France", device: "Tablet (Safari)", ip: "192.168.1.10", timestamp: "2024-03-12T18:10:00" },
  { id: 5, location: "New York, USA", device: "Desktop (Chrome)", ip: "192.168.1.1", timestamp: "2024-03-11T11:00:00" },
]

const profileViews = [
  { id: 1, viewer: "Alice Brown", role: "Shop Owner", location: "Boston, USA", timestamp: "2024-03-15T11:15:00", frequency: 5 },
  { id: 2, viewer: "Bob Wilson", role: "Service Provider", location: "Chicago, USA", timestamp: "2024-03-15T10:00:00", frequency: 3 },
  { id: 3, viewer: "Charlie Davis", role: "User", location: "Austin, USA", timestamp: "2024-03-14T16:30:00", frequency: 1 },
  { id: 4, viewer: "Diana Evans", role: "Shop Owner", location: "Seattle, USA", timestamp: "2024-03-14T14:20:00", frequency: 8 },
  { id: 5, viewer: "Evan Foster", role: "Service Provider", location: "Miami, USA", timestamp: "2024-03-13T13:45:00", frequency: 2 },
]

const activityLogs = [
  { id: 1, action: "Profile Update", type: "General", details: "Updated bio information", timestamp: "2024-03-15T12:00:00" },
  { id: 2, action: "Permission Change", type: "Special", details: "Granted moderator access to user 'sarah_j'", timestamp: "2024-03-15T11:30:00" },
  { id: 3, action: "Service Deletion", type: "General", details: "Deleted service 'Old Repair Listing'", timestamp: "2024-03-14T16:00:00" },
  { id: 4, action: "Account Upgrade", type: "Special", details: "Upgraded account to Premium tier", timestamp: "2024-03-14T10:00:00" },
  { id: 5, action: "Password Change", type: "Special", details: "Changed account password", timestamp: "2024-03-13T09:00:00" },
]

export default function SuperUserLogsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [date, setDate] = useState<Date>()
  const [filterType, setFilterType] = useState("all")

  // Filter logic would go here based on state
  // For demo, we just use the raw data

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
              <h2 className="text-3xl font-bold tracking-tight">Super User Logs</h2>
              <p className="text-muted-foreground">
                Detailed tracking of sessions, profile views, and account activity.
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
                      "w-[240px] justify-start text-left font-normal",
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
                <SelectTrigger className="w-[180px]">
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

          <Tabs defaultValue="sessions" className="space-y-4">
            <TabsList>
              <TabsTrigger value="sessions" className="gap-2">
                <Monitor className="h-4 w-4" />
                Session Logs
              </TabsTrigger>
              <TabsTrigger value="views" className="gap-2">
                <Eye className="h-4 w-4" />
                Profile Views
              </TabsTrigger>
              <TabsTrigger value="activity" className="gap-2">
                <FileText className="h-4 w-4" />
                Activity Logs
              </TabsTrigger>
            </TabsList>

            <TabsContent value="sessions" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Login Sessions</CardTitle>
                  <CardDescription>
                    History of your login locations, devices, and timestamps.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Location</TableHead>
                        <TableHead>Device / Browser</TableHead>
                        <TableHead>IP Address</TableHead>
                        <TableHead>Timestamp</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sessionLogs.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            {log.location}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                                {log.device.toLowerCase().includes("mobile") ? (
                                    <Smartphone className="h-4 w-4 text-muted-foreground" />
                                ) : (
                                    <Monitor className="h-4 w-4 text-muted-foreground" />
                                )}
                                {log.device}
                            </div>
                          </TableCell>
                          <TableCell className="font-mono text-xs">{log.ip}</TableCell>
                          <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="views" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Who Viewed Your Profile</CardTitle>
                  <CardDescription>
                    Insights on users visiting your super profile.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Viewer</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Last Viewed</TableHead>
                        <TableHead className="text-right">Frequency</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {profileViews.map((view) => (
                        <TableRow key={view.id}>
                          <TableCell className="font-medium">{view.viewer}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{view.role}</Badge>
                          </TableCell>
                          <TableCell className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            {view.location}
                          </TableCell>
                          <TableCell>{new Date(view.timestamp).toLocaleString()}</TableCell>
                          <TableCell className="text-right">{view.frequency}x</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Activity History</CardTitle>
                  <CardDescription>
                    Record of your actions and system events.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Action</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Details</TableHead>
                        <TableHead>Timestamp</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {activityLogs.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell className="font-medium">{log.action}</TableCell>
                          <TableCell>
                            <Badge 
                                variant={log.type === "Special" ? "destructive" : "secondary"}
                                className={log.type === "Special" ? "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/20" : ""}
                            >
                                {log.type === "Special" && <ShieldAlert className="h-3 w-3 mr-1" />}
                                {log.type}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">{log.details}</TableCell>
                          <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
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
