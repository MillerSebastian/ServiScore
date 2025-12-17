"use client"

import * as React from "react"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { ThemeSelector } from "@/components/theme-selector"
import { ModeToggle } from "@/components/mode-toggle"
import { LanguageToggle } from "@/components/language-toggle"
import { useLanguage } from "@/contexts/language-context"

export function SettingsSheet({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { t } = useLanguage()
  const [notifications, setNotifications] = React.useState(true)
  const [emailUpdates, setEmailUpdates] = React.useState(false)
  const [soundEnabled, setSoundEnabled] = React.useState(true)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{t("sidebar.settings") || "Settings"}</SheetTitle>
          <SheetDescription>
            Manage your application preferences and settings
          </SheetDescription>
        </SheetHeader>
        
        <div className="space-y-6 py-6">
          {/* Appearance Section */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">Appearance</h3>
              <p className="text-sm text-muted-foreground">
                Customize the look and feel of the application
              </p>
            </div>
            <Separator />
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="theme-mode">Theme Mode</Label>
                <div className="flex items-center gap-2">
                  <ModeToggle />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="color-theme">Color Theme</Label>
                <ThemeSelector />
              </div>
            </div>
          </div>

          {/* Language Section */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">Language</h3>
              <p className="text-sm text-muted-foreground">
                Select your preferred language
              </p>
            </div>
            <Separator />
            
            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <LanguageToggle />
            </div>
          </div>

          {/* Notifications Section */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">Notifications</h3>
              <p className="text-sm text-muted-foreground">
                Configure how you receive notifications
              </p>
            </div>
            <Separator />
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notifications">Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications about activity
                  </p>
                </div>
                <Switch
                  id="notifications"
                  checked={notifications}
                  onCheckedChange={setNotifications}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-updates">Email Updates</Label>
                  <p className="text-sm text-muted-foreground">
                    Get updates via email
                  </p>
                </div>
                <Switch
                  id="email-updates"
                  checked={emailUpdates}
                  onCheckedChange={setEmailUpdates}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="sound">Sound Effects</Label>
                  <p className="text-sm text-muted-foreground">
                    Play sounds for notifications
                  </p>
                </div>
                <Switch
                  id="sound"
                  checked={soundEnabled}
                  onCheckedChange={setSoundEnabled}
                />
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
