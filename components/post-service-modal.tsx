"use client"

import type React from "react"

import { useState, useEffect } from "react"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Loader2, Upload, X } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { servicesService } from "@/lib/services/services.service"
import { serviceCategoriesService, ServiceCategory } from "@/lib/services/service-categories.service"

interface PostServiceModalProps {
  trigger?: React.ReactNode
  onServiceCreated?: (service: any) => void
}

export function PostServiceModal({ trigger, onServiceCreated }: PostServiceModalProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<ServiceCategory[]>([])
  const [loadingCategories, setLoadingCategories] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    categoryId: "",
    price: "",
    location: "",
    description: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const { t } = useLanguage()

  // Load categories when modal opens
  useEffect(() => {
    if (open && categories.length === 0) {
      loadCategories()
    }
  }, [open])

  const loadCategories = async () => {
    setLoadingCategories(true)
    try {
      const data = await serviceCategoriesService.getAll()
      setCategories(data)
    } catch (error) {
      console.error('[PostService] Failed to load categories:', error)
      toast.error("Failed to load categories")
    } finally {
      setLoadingCategories(false)
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.title.trim()) {
      newErrors.title = "Title is required"
    }
    if (!formData.categoryId) {
      newErrors.categoryId = "Category is required"
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = "Valid price is required"
    }
    if (!formData.location.trim()) {
      newErrors.location = "Location is required"
    }
    if (!formData.description.trim()) {
      newErrors.description = "Description is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error("Please fill in all required fields")
      return
    }

    setLoading(true)
    
    try {
      const userId = localStorage.getItem('user_id')
      const categoryId = Number(formData.categoryId)
      
      if (!categoryId || isNaN(categoryId)) {
        toast.error("Please select a valid category")
        setLoading(false)
        return
      }

      const payload = {
        service_title: formData.title,
        service_description: formData.description,
        service_category_id: categoryId,
        service_price: parseFloat(formData.price),
        service_location: formData.location || "Remote",
        service_datetime: new Date().toISOString(),
        status_id: 1,
        user_id: Number(userId) || 1,
      }
      
      const newService = await servicesService.create(payload)
      
      toast.success("Service posted successfully!", {
        description: "Your service is now visible to the community."
      })
      
      setOpen(false)
      setFormData({
        title: "",
        categoryId: "",
        price: "",
        location: "",
        description: "",
      })
      setImagePreview(null)
      setErrors({})
      
      // Notify parent component about the new service
      if (onServiceCreated && newService) {
        onServiceCreated(newService)
      }
    } catch (error: any) {
      console.error('Failed to create service:', error)
      toast.error("Failed to post service", {
        description: error.message || "Please try again later."
      })
    } finally {
      setLoading(false)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image too large", {
          description: "Please upload an image smaller than 5MB"
        })
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus className="mr-2 h-4 w-4" /> {t("services.post.button")}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("services.post.title")}</DialogTitle>
          <DialogDescription>{t("services.post.description")}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="image" className="cursor-pointer">
              <div className={cn(
                "border-2 border-dashed rounded-lg p-4 hover:border-primary transition-colors",
                imagePreview ? "border-primary" : "border-muted-foreground/25"
              )}>
                {imagePreview ? (
                  <div className="relative">
                    <img src={imagePreview} alt="Preview" className="w-full h-32 object-cover rounded" />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault()
                        setImagePreview(null)
                      }}
                      className="absolute top-1 right-1 p-1 bg-background rounded-full shadow-md hover:bg-destructive hover:text-destructive-foreground"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <Upload className="h-8 w-8" />
                    <span className="text-sm">Click to upload image (Max 5MB)</span>
                  </div>
                )}
              </div>
              <Input
                id="image"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
                disabled={loading}
              />
            </Label>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="title">{t("services.post.serviceTitle")} *</Label>
            <Input
              id="title"
              placeholder={t("services.post.serviceTitlePlaceholder")}
              value={formData.title}
              onChange={(e) => {
                setFormData({ ...formData, title: e.target.value })
                if (errors.title) setErrors({ ...errors, title: "" })
              }}
              disabled={loading}
              className={errors.title ? "border-destructive" : ""}
            />
            {errors.title && <span className="text-xs text-destructive">{errors.title}</span>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="categoryId">{t("services.post.category")} *</Label>
              <select
                id="categoryId"
                value={formData.categoryId}
                onChange={(e) => {
                  setFormData({ ...formData, categoryId: e.target.value })
                  if (errors.categoryId) setErrors({ ...errors, categoryId: "" })
                }}
                disabled={loading || loadingCategories}
                className={cn(
                  "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors",
                  "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                  "disabled:cursor-not-allowed disabled:opacity-50",
                  errors.categoryId ? "border-destructive" : ""
                )}
              >
                <option value="">{loadingCategories ? "Loading..." : "Select category"}</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={String(cat.id)}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {errors.categoryId && <span className="text-xs text-destructive">{errors.categoryId}</span>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="price">{t("services.post.price")} *</Label>
              <Input
                id="price"
                type="number"
                placeholder="0.00"
                value={formData.price}
                onChange={(e) => {
                  setFormData({ ...formData, price: e.target.value })
                  if (errors.price) setErrors({ ...errors, price: "" })
                }}
                disabled={loading}
                className={errors.price ? "border-destructive" : ""}
              />
              {errors.price && <span className="text-xs text-destructive">{errors.price}</span>}
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="location">{t("services.post.location")} *</Label>
            <Input
              id="location"
              placeholder={t("services.post.locationPlaceholder")}
              value={formData.location}
              onChange={(e) => {
                setFormData({ ...formData, location: e.target.value })
                if (errors.location) setErrors({ ...errors, location: "" })
              }}
              disabled={loading}
              className={errors.location ? "border-destructive" : ""}
            />
            {errors.location && <span className="text-xs text-destructive">{errors.location}</span>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">{t("services.post.descriptionLabel")} *</Label>
            <Textarea
              id="description"
              placeholder={t("services.post.descriptionPlaceholder")}
              value={formData.description}
              onChange={(e) => {
                setFormData({ ...formData, description: e.target.value })
                if (errors.description) setErrors({ ...errors, description: "" })
              }}
              disabled={loading}
              className={errors.description ? "border-destructive" : ""}
              rows={4}
            />
            {errors.description && <span className="text-xs text-destructive">{errors.description}</span>}
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Posting...
              </>
            ) : (
              t("services.post.button")
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
