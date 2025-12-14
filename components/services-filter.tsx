"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Filter, X } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export interface FilterState {
  category: string
  minPrice: number
  maxPrice: number
  location: string
  status: string
}

interface ServicesFilterProps {
  filters: FilterState
  onFilterChange: (filters: FilterState) => void
  onReset: () => void
}

export function ServicesFilter({ filters, onFilterChange, onReset }: ServicesFilterProps) {
  const [open, setOpen] = useState(false)
  const { t } = useLanguage()

  const activeFiltersCount = [
    filters.category !== "all",
    filters.location !== "all",
    filters.status !== "all",
    filters.minPrice > 0 || filters.maxPrice < 500,
  ].filter(Boolean).length

  const handleReset = () => {
    onReset()
    setOpen(false)
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="gap-2 bg-transparent relative">
          <Filter className="h-4 w-4" />
          {t("services.filter")}
          {activeFiltersCount > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 rounded-full">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Filter Services</SheetTitle>
          <SheetDescription>Refine your search to find the perfect service</SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-6">
          <div className="space-y-2">
            <Label>Category</Label>
            <Select
              value={filters.category}
              onValueChange={(value) => onFilterChange({ ...filters, category: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                <SelectItem value="home">Home Services</SelectItem>
                <SelectItem value="pets">Pet Care</SelectItem>
                <SelectItem value="tech">Tech Support</SelectItem>
                <SelectItem value="education">Education</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              value={filters.status}
              onValueChange={(value) => onFilterChange({ ...filters, status: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="Open">Open</SelectItem>
                <SelectItem value="Closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Location</Label>
            <Select
              value={filters.location}
              onValueChange={(value) => onFilterChange({ ...filters, location: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="All locations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All locations</SelectItem>
                <SelectItem value="Downtown">Downtown</SelectItem>
                <SelectItem value="North End">North End</SelectItem>
                <SelectItem value="South Side">South Side</SelectItem>
                <SelectItem value="West District">West District</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <Label>Price Range: ${filters.minPrice} - ${filters.maxPrice}</Label>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Min: ${filters.minPrice}</Label>
              <Slider
                value={[filters.minPrice]}
                onValueChange={([value]) => onFilterChange({ ...filters, minPrice: value })}
                max={filters.maxPrice - 10}
                step={5}
                className="mb-4"
              />
              <Label className="text-xs text-muted-foreground">Max: ${filters.maxPrice}</Label>
              <Slider
                value={[filters.maxPrice]}
                onValueChange={([value]) => onFilterChange({ ...filters, maxPrice: value })}
                min={filters.minPrice + 10}
                max={500}
                step={5}
              />
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={handleReset} className="flex-1 gap-2">
              <X className="h-4 w-4" />
              Reset
            </Button>
            <Button onClick={() => setOpen(false)} className="flex-1">
              Apply Filters
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
