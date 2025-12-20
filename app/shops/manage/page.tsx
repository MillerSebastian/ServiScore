"use client"

import { useState, useEffect } from "react"
import { storesService, Store, CreateStoreDto } from "@/lib/services/stores.service"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Store as StoreIcon,
  TrendingUp,
  Phone,
  Filter,
  ArrowUpDown,
  Loader2,
  Heart,
  Camera,
  Image as ImageIcon,
  Video,
  MapPin,
  Clock,
  Globe,
  X,
} from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { auth } from "@/lib/firebase"
import { toast } from "sonner"
import { authService } from "@/lib/services/auth.service"
import { useRouter } from "next/navigation"

// Categories mapping (id -> name)
const categoryMap: Record<number, string> = {
  1: "Electronics",
  2: "Clothing",
  3: "Home & Garden",
  4: "Sports",
  5: "Books",
  6: "Food & Beverage",
  7: "Health & Beauty",
  8: "Automotive",
  9: "Toys & Games",
  10: "Coffee Shop",
}

const categories = Object.entries(categoryMap).map(([id, name]) => ({ id: Number(id), name }))

export default function ShopManagementPage() {
  const router = useRouter()
  const [shops, setShops] = useState<Store[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [editingShop, setEditingShop] = useState<Store | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [sortBy, setSortBy] = useState("name")

  // Form state matching backend fields
  const [formData, setFormData] = useState({
    store_name: "",
    store_description: "",
    store_phone: "",
    storeCategoryId: "",
    store_location: "",
    store_hours: "",
    profile_image_url: "",
    banner_image_url: "",
    gallery_images: [] as string[],
    videos: [] as string[],
  })

  // Upload states
  const [isUploading, setIsUploading] = useState<Record<string, boolean>>({})

  // Fetch shops on mount
  useEffect(() => {
    fetchShops()
  }, [])

  const fetchShops = async () => {
    try {
      setIsLoading(true)
      const data = await storesService.getAll()
      setShops(data)
    } catch (error) {
      console.error('Failed to fetch shops:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenModal = async (shop?: Store) => {
    // Check verification before allowing create/edit
    const currentUser = auth.currentUser
    if (!currentUser) {
      toast.error("Please log in first")
      router.push("/login")
      return
    }

    const profile = await authService.getUserProfile(currentUser.uid)
    if (!profile?.isVerified) {
      toast.error("Verificación requerida", {
        description: "Debes completar el proceso de verificación para gestionar tiendas"
      })
      router.push("/profile")
      return
    }

    if (shop) {
      setEditingShop(shop)
      setFormData({
        store_name: shop.store_name || "",
        store_description: shop.store_description || "",
        store_phone: shop.store_phone || "",
        storeCategoryId: String(shop.storeCategoryId || ""),
        store_location: shop.store_location || "",
        store_hours: shop.store_hours || "",
        profile_image_url: shop.profile_image_url || "",
        banner_image_url: shop.banner_image_url || "",
        gallery_images: shop.gallery_images || [],
        videos: shop.videos || [],
      })
    } else {
      setEditingShop(null)
      setFormData({
        store_name: "",
        store_description: "",
        store_phone: "",
        storeCategoryId: "",
        store_location: "",
        store_hours: "",
        profile_image_url: "",
        banner_image_url: "",
        gallery_images: [],
        videos: [],
      })
    }
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingShop(null)
    setFormData({
      store_name: "",
      store_description: "",
      store_phone: "",
      storeCategoryId: "",
      store_location: "",
      store_hours: "",
      profile_image_url: "",
      banner_image_url: "",
      gallery_images: [],
      videos: [],
    })
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string, isMultiple = false) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    try {
      setIsUploading(prev => ({ ...prev, [field]: true }))

      const uploadPromises = Array.from(files).map(async (file) => {
        const formDataUpload = new FormData()
        formDataUpload.append('file', file)
        formDataUpload.append('folder', field === 'videos' ? 'stores/videos' : 'stores/images')

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formDataUpload
        })

        if (!res.ok) throw new Error('Upload failed')
        const data = await res.json()
        return data.secure_url
      })

      const uploadedUrls = await Promise.all(uploadPromises)

      if (isMultiple) {
        setFormData(prev => ({
          ...prev,
          [field]: [...((prev as any)[field] || []), ...uploadedUrls]
        }))
      } else {
        setFormData(prev => ({
          ...prev,
          [field]: uploadedUrls[0]
        }))
      }

      toast.success('Upload successful')
    } catch (error) {
      console.error('Upload failed:', error)
      toast.error('Failed to upload file')
    } finally {
      setIsUploading(prev => ({ ...prev, [field]: false }))
    }
  }

  const removeFile = (field: string, index: number) => {
    setFormData(prev => {
      const current = (prev as any)[field] as string[]
      return {
        ...prev,
        [field]: current.filter((_, i) => i !== index)
      }
    })
  }

  const handleSaveShop = async () => {
    try {
      setIsSaving(true)

      const payload: CreateStoreDto = {
        store_name: formData.store_name,
        store_description: formData.store_description,
        store_phone: formData.store_phone,
        storeCategoryId: formData.storeCategoryId,
        store_total_favourites: editingShop?.store_total_favourites || 0,
        store_location: formData.store_location,
        store_hours: formData.store_hours,
        profile_image_url: formData.profile_image_url,
        banner_image_url: formData.banner_image_url,
        gallery_images: formData.gallery_images,
        videos: formData.videos,
      }

      if (editingShop) {
        await storesService.update(editingShop.id, payload)
      } else {
        await storesService.create(payload)
      }

      await fetchShops()
      handleCloseModal()
    } catch (error) {
      console.error('Failed to save shop:', error)
      alert('Failed to save shop')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteShop = async (id: string) => {
    if (confirm("Are you sure you want to delete this shop?")) {
      try {
        await storesService.delete(id)
        await fetchShops()
      } catch (error) {
        console.error('Failed to delete shop:', error)
        alert('Failed to delete shop')
      }
    }
  }

  // Filter and sort logic
  const filteredShops = shops
    .filter(shop => {
      const matchesSearch = shop.store_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shop.store_description?.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = filterCategory === "all" || String(shop.storeCategoryId) === filterCategory
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      if (sortBy === "name") return (a.store_name || "").localeCompare(b.store_name || "")
      if (sortBy === "category") return Number(a.storeCategoryId || 0) - Number(b.storeCategoryId || 0)
      if (sortBy === "favourites") return (b.store_total_favourites || 0) - (a.store_total_favourites || 0)
      if (sortBy === "date") {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0
        return dateB - dateA
      }
      return 0
    })

  // Metrics calculations
  const totalShops = shops.length
  const totalFavourites = shops.reduce((sum, s) => sum + (s.store_total_favourites || 0), 0)

  const recentShops = shops.filter(s => {
    if (!s.createdAt) return false
    const date = new Date(s.createdAt)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    return date >= thirtyDaysAgo
  }).length

  const categoryCounts = shops.reduce((acc, shop) => {
    const catName = categoryMap[Number(shop.storeCategoryId)] || "Other"
    acc[catName] = (acc[catName] || 0) + 1
    return acc
  }, {} as Record<string, number>)

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
        <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Shop Management</h1>
              <p className="text-muted-foreground">Create, manage, and analyze your shops</p>
            </div>
            <Button onClick={() => handleOpenModal()} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Shop
            </Button>
          </div>

          {/* Metrics Dashboard */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Shops</CardTitle>
                <StoreIcon className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalShops}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Registered shops
                </p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Favourites</CardTitle>
                <Heart className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalFavourites}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Combined favourites
                </p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">New (30 days)</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{recentShops}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Added this month
                </p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Categories</CardTitle>
                <Filter className="h-4 w-4 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{Object.keys(categoryCounts).length}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Different categories
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Shop List */}
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <CardTitle>Shop List</CardTitle>
                  <CardDescription>Manage all your shops in one place</CardDescription>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search shops..."
                      className="pl-8 w-full sm:w-64"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger className="w-full sm:w-40">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map(cat => (
                        <SelectItem key={cat.id} value={String(cat.id)}>{cat.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-full sm:w-32">
                      <ArrowUpDown className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Sort" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name">Name</SelectItem>
                      <SelectItem value="category">Category</SelectItem>
                      <SelectItem value="favourites">Favourites</SelectItem>
                      <SelectItem value="date">Date</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="w-[80px]">Image</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Favourites</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredShops.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                            <div className="flex flex-col items-center gap-2">
                              <StoreIcon className="h-8 w-8 opacity-20" />
                              <p>No shops found. Try adjusting your filters or create a new shop.</p>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredShops.map((shop, idx) => (
                          <TableRow key={shop.id ? `shop-${shop.id}` : `shop-idx-${idx}`} className="group">
                            <TableCell>
                              <div className="h-12 w-12 rounded-lg bg-muted overflow-hidden border border-border/50">
                                <img
                                  src={shop.profile_image_url || shop.image_url || "/placeholder.svg"}
                                  alt={shop.store_name}
                                  className="h-full w-full object-cover transition-transform group-hover:scale-110"
                                />
                              </div>
                            </TableCell>
                            <TableCell className="font-medium">
                              <div>
                                <p className="font-semibold">{shop.store_name}</p>
                                <p className="text-xs text-muted-foreground line-clamp-1 max-w-[200px]">{shop.store_description}</p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="bg-pastel-blue/10 text-blue-700 border-pastel-blue/20">
                                {categoryMap[Number(shop.storeCategoryId)] || "Other"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1 text-xs">
                                <MapPin className="h-3 w-3 text-muted-foreground" />
                                <span className="line-clamp-1 max-w-[150px]">{shop.store_location || "No location"}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Heart className="h-3 w-3 text-red-500 fill-red-500/10" />
                                {shop.store_total_favourites || 0}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem onClick={() => handleOpenModal(shop)}>
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => handleDeleteShop(shop.id)}
                                    className="text-red-600"
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
              <div className="mt-4 text-sm text-muted-foreground">
                Showing {filteredShops.length} of {totalShops} shops
              </div>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>

      {/* Shop Management Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-3xl p-0 overflow-hidden border-none bg-transparent shadow-none">
          <div className="bg-background/95 backdrop-blur-xl border border-border/50 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <DialogHeader className="p-6 pb-0">
              <div className="flex justify-between items-center">
                <div>
                  <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                    {editingShop ? "Edit Shop" : "Create New Shop"}
                  </DialogTitle>
                  <DialogDescription className="text-muted-foreground/80 mt-1">
                    {editingShop ? "Refine your shop's presence" : "List your store on ServiScore"}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <Tabs defaultValue="general" className="flex-1 flex flex-col mt-6">
              <div className="px-6">
                <TabsList className="grid w-full grid-cols-3 bg-muted/50 p-1 rounded-xl">
                  <TabsTrigger value="general" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all py-2.5">
                    General Info
                  </TabsTrigger>
                  <TabsTrigger value="media" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all py-2.5">
                    Branding & Media
                  </TabsTrigger>
                  <TabsTrigger value="location" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all py-2.5">
                    Location & Hours
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
                {/* General Information Tab */}
                <TabsContent value="general" className="mt-0 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="grid gap-6">
                    <div className="bg-muted/30 p-4 rounded-2xl border border-border/50 space-y-4">
                      <div className="grid gap-2">
                        <Label htmlFor="name" className="text-sm font-semibold flex items-center gap-2">
                          <StoreIcon className="h-4 w-4 text-primary" /> Shop Name *
                        </Label>
                        <Input
                          id="name"
                          placeholder="e.g. Coffee Central"
                          className="bg-background/50 border-border/50 focus:ring-primary/20 rounded-xl py-6"
                          value={formData.store_name}
                          onChange={(e) => setFormData({ ...formData, store_name: e.target.value })}
                        />
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="grid gap-2">
                          <Label htmlFor="category" className="text-sm font-semibold flex items-center gap-2">
                            <Filter className="h-4 w-4 text-primary" /> Category *
                          </Label>
                          <Select value={formData.storeCategoryId} onValueChange={(value) => setFormData({ ...formData, storeCategoryId: value })}>
                            <SelectTrigger id="category" className="bg-background/50 border-border/50 rounded-xl h-12">
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl">
                              {categories.map(cat => (
                                <SelectItem key={cat.id} value={String(cat.id)} className="rounded-lg">{cat.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="phone" className="text-sm font-semibold flex items-center gap-2">
                            <Phone className="h-4 w-4 text-primary" /> Contact Phone *
                          </Label>
                          <Input
                            id="phone"
                            placeholder="9876543210"
                            className="bg-background/50 border-border/50 rounded-xl h-12"
                            value={formData.store_phone}
                            onChange={(e) => setFormData({ ...formData, store_phone: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="bg-muted/30 p-4 rounded-2xl border border-border/50 space-y-2">
                      <Label htmlFor="description" className="text-sm font-semibold">Store Biography</Label>
                      <Textarea
                        id="description"
                        placeholder="Tell the world what makes your shop unique..."
                        className="bg-background/50 border-border/50 rounded-xl min-h-[120px] resize-none focus:ring-primary/20"
                        value={formData.store_description}
                        onChange={(e) => setFormData({ ...formData, store_description: e.target.value })}
                      />
                    </div>
                  </div>
                </TabsContent>

                {/* Media Tab */}
                <TabsContent value="media" className="mt-0 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="grid gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Profile Photo */}
                      <div className="md:col-span-1 space-y-2">
                        <Label className="text-sm font-semibold">Profile Photo</Label>
                        <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted/50 border-2 border-dashed border-border/50 flex flex-col items-center justify-center group transition-all hover:bg-muted/80 hover:border-primary/50 cursor-pointer shadow-sm">
                          {formData.profile_image_url ? (
                            <img src={formData.profile_image_url} className="w-full h-full object-cover transition-transform group-hover:scale-105" alt="Profile" />
                          ) : (
                            <div className="flex flex-col items-center gap-2 text-muted-foreground group-hover:text-primary transition-colors">
                              <Camera className="h-8 w-8" />
                              <span className="text-[10px] font-medium uppercase tracking-widest">Upload</span>
                            </div>
                          )}
                          <input
                            type="file"
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            onChange={(e) => handleFileUpload(e, 'profile_image_url')}
                            accept="image/*"
                          />
                          {isUploading['profile_image_url'] && (
                            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
                              <Loader2 className="h-6 w-6 text-primary animate-spin" />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Banner Photo */}
                      <div className="md:col-span-2 space-y-2">
                        <Label className="text-sm font-semibold">Banner Background</Label>
                        <div className="relative h-full rounded-2xl overflow-hidden bg-muted/50 border-2 border-dashed border-border/50 flex flex-col items-center justify-center group transition-all hover:bg-muted/80 hover:border-primary/50 cursor-pointer shadow-sm min-h-[160px]">
                          {formData.banner_image_url ? (
                            <img src={formData.banner_image_url} className="w-full h-full object-cover transition-transform group-hover:scale-105" alt="Banner" />
                          ) : (
                            <div className="flex flex-col items-center gap-2 text-muted-foreground group-hover:text-primary transition-colors">
                              <ImageIcon className="h-10 w-10" />
                              <span className="text-[10px] font-medium uppercase tracking-widest text-center">Add Store Banner</span>
                            </div>
                          )}
                          <input
                            type="file"
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            onChange={(e) => handleFileUpload(e, 'banner_image_url')}
                            accept="image/*"
                          />
                          {isUploading['banner_image_url'] && (
                            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
                              <Loader2 className="h-8 w-8 text-primary animate-spin" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Label className="text-sm font-semibold">Showcase Gallery</Label>
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                        {formData.gallery_images.map((url, i) => (
                          <div key={url} className="relative aspect-square rounded-xl overflow-hidden border border-border/50 shadow-sm group">
                            <img src={url} className="w-full h-full object-cover" alt="Gallery" />
                            <button
                              onClick={() => removeFile('gallery_images', i)}
                              className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                        <div className="relative aspect-square rounded-xl bg-muted/30 border-2 border-dashed border-border/30 flex items-center justify-center cursor-pointer hover:bg-muted/50 hover:border-primary/50 transition-all shadow-inner">
                          <Plus className="h-6 w-6 text-muted-foreground" />
                          <input
                            type="file"
                            multiple
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            onChange={(e) => handleFileUpload(e, 'gallery_images', true)}
                            accept="image/*"
                          />
                          {isUploading['gallery_images'] && (
                            <div className="absolute inset-0 bg-background/60 backdrop-blur-xs flex items-center justify-center rounded-xl">
                              <Loader2 className="h-4 w-4 text-primary animate-spin" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Label className="text-sm font-semibold">Promotional Videos</Label>
                      <div className="flex flex-wrap gap-4">
                        {formData.videos.map((url, i) => (
                          <div key={url} className="relative h-24 w-40 rounded-xl overflow-hidden border border-border/50 bg-black group shadow-md">
                            <video src={url} className="w-full h-full object-cover opacity-60" />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <Video className="h-6 w-6 text-white/50 group-hover:text-white transition-colors" />
                            </div>
                            <button
                              onClick={() => removeFile('videos', i)}
                              className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 opacity-100 transition-opacity hover:bg-red-500"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                        <div className="relative h-24 w-24 rounded-xl bg-muted/30 border-2 border-dashed border-border/30 flex items-center justify-center cursor-pointer hover:bg-muted/50 hover:border-primary/50 transition-all shadow-inner">
                          <Video className="h-7 w-7 text-muted-foreground" />
                          <input
                            type="file"
                            multiple
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            onChange={(e) => handleFileUpload(e, 'videos', true)}
                            accept="video/*"
                          />
                          {isUploading['videos'] && (
                            <div className="absolute inset-0 bg-background/60 backdrop-blur-xs flex items-center justify-center rounded-xl">
                              <Loader2 className="h-4 w-4 text-primary animate-spin" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Location & Hours Tab */}
                <TabsContent value="location" className="mt-0 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="grid gap-6">
                    <div className="bg-muted/30 p-4 rounded-2xl border border-border/50 space-y-4 shadow-sm">
                      <div className="grid gap-2">
                        <Label htmlFor="location" className="text-sm font-semibold flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-primary" /> Store Location
                        </Label>
                        <Input
                          id="location"
                          placeholder="e.g. 123 Artisan Valley, Downtown"
                          className="bg-background/50 border-border/50 rounded-xl py-6"
                          value={formData.store_location}
                          onChange={(e) => setFormData({ ...formData, store_location: e.target.value })}
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="hours" className="text-sm font-semibold flex items-center gap-2">
                          <Clock className="h-4 w-4 text-primary" /> Availability Hours
                        </Label>
                        <Textarea
                          id="hours"
                          placeholder="Monday - Friday: 8:00 AM - 10:00 PM&#10;Weekends: 10:00 AM - 6:00 PM"
                          className="bg-background/50 border-border/50 rounded-xl min-h-[100px] resize-none focus:ring-primary/20"
                          value={formData.store_hours}
                          onChange={(e) => setFormData({ ...formData, store_hours: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="p-8 border-2 border-dashed border-border/30 rounded-3xl bg-pastel-blue/5 flex flex-col items-center justify-center text-center gap-3">
                      <div className="p-3 bg-pastel-blue/20 rounded-full text-blue-600">
                        <Globe className="h-6 w-6" />
                      </div>
                      <p className="text-sm font-medium">Digital Maps Integration</p>
                      <p className="text-xs text-muted-foreground max-w-[280px]">
                        ServiScore automatically generates a Leaflet map using your provided address for customers to find you easily.
                      </p>
                    </div>
                  </div>
                </TabsContent>
              </div>

              <div className="p-6 bg-muted/20 backdrop-blur-md border-t border-border/50 flex justify-between items-center sm:rounded-b-3xl">
                <Button variant="ghost" onClick={handleCloseModal} className="rounded-xl px-6 hover:bg-background/50 transition-colors">
                  Cancel
                </Button>
                <Button
                  className="px-8 bg-black hover:bg-black/90 dark:bg-white dark:hover:bg-white/90 dark:text-black text-white font-bold rounded-xl h-12 shadow-lg shadow-primary/10 transition-all hover:scale-[1.02] active:scale-[0.98]"
                  onClick={handleSaveShop}
                  disabled={!formData.store_name || !formData.storeCategoryId || !formData.store_phone || isSaving}
                >
                  {isSaving ? (
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  ) : (
                    <Plus className="h-5 w-5 mr-2" />
                  )}
                  {editingShop ? "Apply Changes" : "Publish Shop"}
                </Button>
              </div>
            </Tabs>
          </div>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  )
}
