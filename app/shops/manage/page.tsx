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
  })

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
      })
    } else {
      setEditingShop(null)
      setFormData({
        store_name: "",
        store_description: "",
        store_phone: "",
        storeCategoryId: "",
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
    })
  }

  const handleSaveShop = async () => {
    try {
      setIsSaving(true)

      const payload: CreateStoreDto = {
        store_name: formData.store_name,
        store_description: formData.store_description,
        store_phone: formData.store_phone,
        storeCategoryId: Number(formData.storeCategoryId),
        store_total_favourites: 0,
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

  const handleDeleteShop = async (id: number) => {
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
      if (sortBy === "category") return (a.storeCategoryId || 0) - (b.storeCategoryId || 0)
      if (sortBy === "favourites") return (b.store_total_favourites || 0) - (a.store_total_favourites || 0)
      if (sortBy === "date") return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
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
    const catName = categoryMap[shop.storeCategoryId] || "Other"
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
                <div className="rounded-lg border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Favourites</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredShops.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                            No shops found. Try adjusting your filters or create a new shop.
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredShops.map((shop, idx) => (
                          <TableRow key={shop.id ? `shop-${shop.id}` : `shop-idx-${idx}`}>
                            <TableCell className="font-medium">
                              <div>
                                <p className="font-semibold">{shop.store_name}</p>
                                <p className="text-xs text-muted-foreground line-clamp-1">{shop.store_description}</p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{categoryMap[shop.storeCategoryId] || "Other"}</Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Phone className="h-3 w-3 text-muted-foreground" />
                                {shop.store_phone || "-"}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Heart className="h-3 w-3 text-red-500" />
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
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingShop ? "Edit Shop" : "Create New Shop"}</DialogTitle>
            <DialogDescription>
              {editingShop ? "Update shop information" : "Add a new shop to your collection"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Shop Name *</Label>
              <Input
                id="name"
                placeholder="Enter shop name"
                value={formData.store_name}
                onChange={(e) => setFormData({ ...formData, store_name: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.storeCategoryId} onValueChange={(value) => setFormData({ ...formData, storeCategoryId: value })}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat.id} value={String(cat.id)}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone *</Label>
                <Input
                  id="phone"
                  placeholder="9876543210"
                  value={formData.store_phone}
                  onChange={(e) => setFormData({ ...formData, store_phone: e.target.value })}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter shop description"
                rows={3}
                value={formData.store_description}
                onChange={(e) => setFormData({ ...formData, store_description: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveShop}
              disabled={!formData.store_name || !formData.storeCategoryId || !formData.store_phone || isSaving}
            >
              {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {editingShop ? "Update Shop" : "Create Shop"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  )
}
