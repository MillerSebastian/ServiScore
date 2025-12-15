"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { IconMail, IconBrandGithub, IconMessageCircle } from "@tabler/icons-react"
import { useLanguage } from "@/contexts/language-context"

export function HelpDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { t } = useLanguage()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{t("sidebar.getHelp") || "Get Help"}</DialogTitle>
          <DialogDescription>
            Find answers to common questions or contact support
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="space-y-3">
            <h3 className="font-medium">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Button variant="outline" className="justify-start">
                <IconMail className="mr-2 h-4 w-4" />
                Contact Support
              </Button>
              <Button variant="outline" className="justify-start">
                <IconBrandGithub className="mr-2 h-4 w-4" />
                Report Bug
              </Button>
              <Button variant="outline" className="justify-start">
                <IconMessageCircle className="mr-2 h-4 w-4" />
                Live Chat
              </Button>
            </div>
          </div>

          {/* Keyboard Shortcuts */}
          <div className="space-y-3">
            <h3 className="font-medium">Keyboard Shortcuts</h3>
            <div className="rounded-lg border p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Open Search</span>
                <Badge variant="secondary">⌘K / Ctrl+K</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Toggle Sidebar</span>
                <Badge variant="secondary">⌘B / Ctrl+B</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Go to Dashboard</span>
                <Badge variant="secondary">G then D</Badge>
              </div>
            </div>
          </div>

          {/* FAQ */}
          <div className="space-y-3">
            <h3 className="font-medium">Frequently Asked Questions</h3>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>How do I create a new shop?</AccordionTrigger>
                <AccordionContent>
                  Navigate to the Dashboard and click on "New Store" button. Fill in the required information
                  including shop name, description, location, and contact details. Once submitted, your shop
                  will be reviewed and activated within 24 hours.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-2">
                <AccordionTrigger>How do I manage my services?</AccordionTrigger>
                <AccordionContent>
                  Go to Management → Manage Services from the sidebar. Here you can add, edit, or remove
                  services associated with your shops. You can set prices, descriptions, and availability
                  for each service.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-3">
                <AccordionTrigger>How can I view analytics?</AccordionTrigger>
                <AccordionContent>
                  Analytics are available under the Analytics section in the sidebar. You can view
                  shop-specific metrics, service performance, and overall statistics. Premium users
                  get access to advanced analytics and export features.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-4">
                <AccordionTrigger>How do I change my profile settings?</AccordionTrigger>
                <AccordionContent>
                  Click on your profile picture in the sidebar footer, or navigate to Profile from
                  the main menu. Here you can update your personal information, change password,
                  manage notifications, and configure privacy settings.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-5">
                <AccordionTrigger>What are the different theme options?</AccordionTrigger>
                <AccordionContent>
                  ServiScore offers multiple color themes (Default, Blue, Green, Amber) and scaled
                  variants for better readability. You can also toggle between light and dark modes.
                  Access theme settings from the Settings panel or the header toolbar.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* Contact Info */}
          <div className="rounded-lg border bg-muted/50 p-4 space-y-2">
            <h3 className="font-medium">Need More Help?</h3>
            <p className="text-sm text-muted-foreground">
              Our support team is available Monday to Friday, 9am-6pm EST
            </p>
            <div className="flex gap-2 mt-3">
              <Button size="sm">
                <IconMail className="mr-2 h-4 w-4" />
                support@servicescore.com
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
