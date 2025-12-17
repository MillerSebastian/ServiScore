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
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { IconCreditCard, IconCheck, IconDownload, IconPlus } from "@tabler/icons-react"
import { useLanguage } from "@/contexts/language-context"

export function BillingDialog({ 
  open, 
  onOpenChange 
}: { 
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { t } = useLanguage()

  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      current: false,
      features: [
        "Up to 3 shops",
        "10 services per shop",
        "Basic analytics",
        "Community support"
      ]
    },
    {
      name: "Pro",
      price: "$29",
      period: "per month",
      current: true,
      features: [
        "Unlimited shops",
        "Unlimited services",
        "Advanced analytics",
        "Priority support",
        "Custom branding",
        "API access"
      ]
    },
    {
      name: "Enterprise",
      price: "$99",
      period: "per month",
      features: [
        "Everything in Pro",
        "Dedicated account manager",
        "Custom integrations",
        "SLA guarantee",
        "Advanced security",
        "Training & onboarding"
      ]
    }
  ]

  const invoices = [
    { id: "INV-2024-001", date: "Dec 1, 2024", amount: "$29.00", status: "Paid" },
    { id: "INV-2024-002", date: "Nov 1, 2024", amount: "$29.00", status: "Paid" },
    { id: "INV-2024-003", date: "Oct 1, 2024", amount: "$29.00", status: "Paid" },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Billing & Subscription</DialogTitle>
          <DialogDescription>
            Manage your subscription plan and billing information
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Plan */}
          <div className="space-y-3">
            <h3 className="text-lg font-medium">Current Plan</h3>
            <Card className="border-primary">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Pro Plan</CardTitle>
                    <CardDescription>Your current subscription</CardDescription>
                  </div>
                  <Badge>Active</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold">$29</span>
                  <span className="text-muted-foreground">per month</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Next billing date: January 1, 2025
                </p>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button variant="outline">Change Plan</Button>
                <Button variant="ghost" className="text-destructive">Cancel Subscription</Button>
              </CardFooter>
            </Card>
          </div>

          <Separator />

          {/* Available Plans */}
          <div className="space-y-3">
            <h3 className="text-lg font-medium">Available Plans</h3>
            <div className="grid gap-4 md:grid-cols-3">
              {plans.map((plan) => (
                <Card key={plan.name} className={plan.current ? "border-primary" : ""}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {plan.name}
                      {plan.current && <Badge variant="secondary">Current</Badge>}
                    </CardTitle>
                    <CardDescription>
                      <span className="text-2xl font-bold text-foreground">{plan.price}</span>
                      <span className="text-sm"> {plan.period}</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2 text-sm">
                          <IconCheck className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full" 
                      variant={plan.current ? "secondary" : "default"}
                      disabled={plan.current}
                    >
                      {plan.current ? "Current Plan" : "Upgrade"}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>

          <Separator />

          {/* Payment Method */}
          <div className="space-y-3">
            <h3 className="text-lg font-medium">Payment Method</h3>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center">
                      <IconCreditCard className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">•••• •••• •••• 4242</p>
                      <p className="text-sm text-muted-foreground">Expires 12/2025</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Update
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Button variant="outline" className="w-full">
              <IconPlus className="mr-2 h-4 w-4" />
              Add Payment Method
            </Button>
          </div>

          <Separator />

          {/* Billing History */}
          <div className="space-y-3">
            <h3 className="text-lg font-medium">Billing History</h3>
            <div className="rounded-md border">
              <div className="divide-y">
                {invoices.map((invoice) => (
                  <div key={invoice.id} className="flex items-center justify-between p-4">
                    <div>
                      <p className="font-medium">{invoice.id}</p>
                      <p className="text-sm text-muted-foreground">{invoice.date}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-medium">{invoice.amount}</span>
                      <Badge variant="secondary">{invoice.status}</Badge>
                      <Button variant="ghost" size="icon">
                        <IconDownload className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
