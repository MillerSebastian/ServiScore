"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LogTable } from "@/components/logs/log-table"
import { FileText, ShoppingBag, Wrench, ShieldAlert } from "lucide-react"

// Mock Data
const shopLogs = [
  { id: "1", action: "Product Added", user: "John Doe", details: "Added 'Wireless Headphones' to inventory", timestamp: "2024-03-15T10:30:00", status: "success", ip: "192.168.1.1" },
  { id: "2", action: "Stock Update", user: "Jane Smith", details: "Updated stock for SKU-123", timestamp: "2024-03-15T09:45:00", status: "success", ip: "192.168.1.2" },
  { id: "3", action: "Order Cancelled", user: "System", details: "Order #5521 cancelled due to payment failure", timestamp: "2024-03-14T16:20:00", status: "error", ip: "10.0.0.5" },
  { id: "4", action: "Price Change", user: "Admin", details: "Changed price of 'Smart Watch'", timestamp: "2024-03-14T14:10:00", status: "warning", ip: "192.168.1.1" },
  { id: "5", action: "New Category", user: "John Doe", details: "Created category 'Electronics'", timestamp: "2024-03-13T11:00:00", status: "success", ip: "192.168.1.1" },
] as const

const serviceLogs = [
  { id: "1", action: "Service Request", user: "Alice Brown", details: "New request for 'Plumbing Repair'", timestamp: "2024-03-15T11:15:00", status: "success", ip: "192.168.1.5" },
  { id: "2", action: "Status Update", user: "Bob Wilson", details: "Marked ticket #882 as In Progress", timestamp: "2024-03-15T10:00:00", status: "success", ip: "192.168.1.6" },
  { id: "3", action: "Feedback Received", user: "Client", details: "Received 5-star rating for service #991", timestamp: "2024-03-14T15:30:00", status: "success", ip: "10.0.0.8" },
  { id: "4", action: "Dispute Raised", user: "Client", details: "Dispute opened for order #772", timestamp: "2024-03-14T09:20:00", status: "error", ip: "10.0.0.9" },
  { id: "5", action: "Provider Verified", user: "System", details: "Verified credentials for provider 'FixIt Fast'", timestamp: "2024-03-13T13:45:00", status: "success", ip: "10.0.0.1" },
] as const

const superUserLogs = [
  { id: "1", action: "User Ban", user: "SuperAdmin", details: "Banned user 'spammer123' for TOS violation", timestamp: "2024-03-15T12:00:00", status: "warning", ip: "172.16.0.1" },
  { id: "2", action: "Role Updated", user: "SuperAdmin", details: "Promoted 'sarah_j' to Moderator", timestamp: "2024-03-15T11:30:00", status: "success", ip: "172.16.0.1" },
  { id: "3", action: "System Backup", user: "System", details: "Automated daily backup completed", timestamp: "2024-03-15T02:00:00", status: "success", ip: "localhost" },
  { id: "4", action: "Config Change", user: "DevOps", details: "Updated firewall rules", timestamp: "2024-03-14T23:00:00", status: "warning", ip: "172.16.0.5" },
  { id: "5", action: "Login Attempt", user: "Unknown", details: "Failed login attempt for root", timestamp: "2024-03-14T20:15:00", status: "error", ip: "45.22.11.99" },
] as const

export default function LogsPage() {
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
          <div className="flex items-center justify-between space-y-2 py-4">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">System Logs</h2>
              <p className="text-muted-foreground">
                Monitor activities across shops, services, and administration.
              </p>
            </div>
          </div>

          <Tabs defaultValue="shop" className="space-y-4">
            <TabsList>
              <TabsTrigger value="shop" className="gap-2">
                <ShoppingBag className="h-4 w-4" />
                Shop Logs
              </TabsTrigger>
              <TabsTrigger value="services" className="gap-2">
                <Wrench className="h-4 w-4" />
                Services Logs
              </TabsTrigger>
              <TabsTrigger value="superuser" className="gap-2">
                <ShieldAlert className="h-4 w-4" />
                Super User Logs
              </TabsTrigger>
            </TabsList>

            <TabsContent value="shop" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Shop Activity</CardTitle>
                  <CardDescription>
                    Recent inventory, order, and product changes.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <LogTable data={[...shopLogs]} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="services" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Service Operations</CardTitle>
                  <CardDescription>
                    Service requests, status updates, and provider activities.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <LogTable data={[...serviceLogs]} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="superuser" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Administrative Actions</CardTitle>
                  <CardDescription>
                    Critical system changes, user management, and security events.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <LogTable data={[...superUserLogs]} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
