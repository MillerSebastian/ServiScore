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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Loader2, Upload, X } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

export function PostServiceModal({ trigger }: { trigger?: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    price: "",
    location: "",
    description: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const { t } = useLanguage()

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.title.trim()) {
      newErrors.title = "Title is required"
    }
    if (!formData.category) {
      newErrors.category = "Category is required"
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
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      toast.success("Service posted successfully!", {
        description: "Your service is now visible to the community."
      })
      
      setOpen(false)
      setFormData({
        title: "",
        category: "",
        price: "",
        location: "",
        description: "",
      })
      setImagePreview(null)
      setErrors({})
    } catch (error) {
      toast.error("Failed to post service", {
        description: "Please try again later."
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
          <Button className="bg-pastel-blue text-blue-900 hover:bg-pastel-blue/80">
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
              <Label htmlFor="category">{t("services.post.category")} *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => {
                  setFormData({ ...formData, category: value })
                  if (errors.category) setErrors({ ...errors, category: "" })
                }}
                disabled={loading}
              >
                <SelectTrigger className={errors.category ? "border-destructive" : ""}>
                  <SelectValue placeholder={t("services.post.categoryPlaceholder")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="home">{t("services.post.category.home")}</SelectItem>
                  <SelectItem value="pets">{t("services.post.category.pets")}</SelectItem>
                  <SelectItem value="tech">{t("services.post.category.tech")}</SelectItem>
                  <SelectItem value="education">{t("services.post.category.education")}</SelectItem>
                </SelectContent>
              </Select>
              {errors.category && <span className="text-xs text-destructive">{errors.category}</span>}
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
            className="bg-pastel-blue text-blue-900 hover:bg-pastel-blue/80"
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
