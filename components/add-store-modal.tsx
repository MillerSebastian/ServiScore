"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Upload, Plus } from "lucide-react"

export function AddStoreModal({ trigger }: { trigger?: React.ReactNode }) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-pastel-blue text-blue-900 hover:bg-pastel-blue/80">
            <Plus className="mr-2 h-4 w-4" /> Add Store
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload New Store</DialogTitle>
          <DialogDescription>Add your store to the community. Click save when you're done.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Store Name</Label>
            <Input id="name" placeholder="e.g. The Cozy Corner" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="category">Category</Label>
            <Input id="category" placeholder="e.g. Cafe, Bakery, Retail" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" placeholder="Tell us about your store..." />
          </div>
          <div className="grid gap-2">
            <Label>Store Image</Label>
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-xl p-6 text-center hover:bg-muted/50 transition-colors cursor-pointer">
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <Upload className="h-8 w-8" />
                <span className="text-xs">Click to upload image</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={() => setOpen(false)} className="bg-pastel-blue text-blue-900 hover:bg-pastel-blue/80">
            Create Store
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
