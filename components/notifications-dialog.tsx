"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  IconBell, 
  IconCheck, 
  IconTrash,
  IconSettings,
  IconShoppingCart,
  IconStar,
  IconUsers,
  IconTrendingUp
} from "@tabler/icons-react"
import { useLanguage } from "@/contexts/language-context"

export function NotificationsDialog({ 
  open, 
  onOpenChange 
}: { 
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { t } = useLanguage()
  const [preferences, setPreferences] = React.useState({
    email: true,
    push: true,
    sms: false,
    orderUpdates: true,
    newReviews: true,
    marketing: false,
    security: true
  })

  const notifications = [
    {
      id: 1,
      type: "order",
      icon: IconShoppingCart,
      title: "New order received",
      message: "Tech Haven placed a new order for $2,450",
      time: "2 hours ago",
      unread: true
    },
    {
      id: 2,
      type: "review",
      icon: IconStar,
      title: "New review posted",
      message: "Fashion Hub received a 5-star review",
      time: "5 hours ago",
      unread: true
    },
    {
      id: 3,
      type: "team",
      icon: IconUsers,
      title: "Team member added",
      message: "Sarah Johnson joined your team",
      time: "1 day ago",
      unread: false
    },
    {
      id: 4,
      type: "analytics",
      icon: IconTrendingUp,
      title: "Monthly report ready",
      message: "Your November analytics report is available",
      time: "2 days ago",
      unread: false
    },
    {
      id: 5,
      type: "system",
      icon: IconSettings,
      title: "System maintenance",
      message: "Scheduled maintenance on Dec 20, 2024",
      time: "3 days ago",
      unread: false
    }
  ]

  const getIconColor = (type: string) => {
    switch(type) {
      case "order": return "text-blue-500"
      case "review": return "text-yellow-500"
      case "team": return "text-green-500"
      case "analytics": return "text-purple-500"
      default: return "text-gray-500"
    }
  }

  const markAllAsRead = () => {
    // TODO: Implement mark all as read
  }

  const clearAll = () => {
    // TODO: Implement clear all
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl">Notifications</DialogTitle>
          <DialogDescription>
            Manage your notifications and preferences
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden space-y-4">
          {/* Quick Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                {notifications.filter(n => n.unread).length} unread
              </Badge>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                <IconCheck className="h-4 w-4 mr-2" />
                Mark all read
              </Button>
              <Button variant="ghost" size="sm" onClick={clearAll}>
                <IconTrash className="h-4 w-4 mr-2" />
                Clear all
              </Button>
            </div>
          </div>

          {/* Notifications List */}
          <ScrollArea className="h-[300px] rounded-md border p-4">
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`flex gap-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors ${
                    notification.unread ? "bg-muted/30" : ""
                  }`}
                >
                  <div className={`mt-1 ${getIconColor(notification.type)}`}>
                    <notification.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-start justify-between">
                      <p className="font-medium text-sm">{notification.title}</p>
                      {notification.unread && (
                        <div className="h-2 w-2 rounded-full bg-primary mt-1" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{notification.message}</p>
                    <p className="text-xs text-muted-foreground">{notification.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <Separator />

          {/* Notification Preferences */}
          <div className="space-y-4">
            <h3 className="font-medium">Notification Preferences</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-notif">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications via email
                  </p>
                </div>
                <Switch
                  id="email-notif"
                  checked={preferences.email}
                  onCheckedChange={(checked) => 
                    setPreferences({ ...preferences, email: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="push-notif">Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Get push notifications in your browser
                  </p>
                </div>
                <Switch
                  id="push-notif"
                  checked={preferences.push}
                  onCheckedChange={(checked) => 
                    setPreferences({ ...preferences, push: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="sms-notif">SMS Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive important updates via SMS
                  </p>
                </div>
                <Switch
                  id="sms-notif"
                  checked={preferences.sms}
                  onCheckedChange={(checked) => 
                    setPreferences({ ...preferences, sms: checked })
                  }
                />
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h4 className="text-sm font-medium">Notification Types</h4>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="order-updates">Order Updates</Label>
                <Switch
                  id="order-updates"
                  checked={preferences.orderUpdates}
                  onCheckedChange={(checked) => 
                    setPreferences({ ...preferences, orderUpdates: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="new-reviews">New Reviews</Label>
                <Switch
                  id="new-reviews"
                  checked={preferences.newReviews}
                  onCheckedChange={(checked) => 
                    setPreferences({ ...preferences, newReviews: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="marketing">Marketing</Label>
                <Switch
                  id="marketing"
                  checked={preferences.marketing}
                  onCheckedChange={(checked) => 
                    setPreferences({ ...preferences, marketing: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="security">Security Alerts</Label>
                <Switch
                  id="security"
                  checked={preferences.security}
                  onCheckedChange={(checked) => 
                    setPreferences({ ...preferences, security: checked })
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
