"use client"

import { useState } from "react"
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
  Store,
  TrendingUp,
  Activity,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Filter,
  ArrowUpDown,
  PieChart,
  BarChart3,
} from "lucide-react"
import ChatbaseWidget from "@/components/ChatbaseWidget"

// Mock data for shops
const mockShops = [
  {
    id: 1,
    name: "Tech Haven",
    address: "123 Main St, New York, NY 10001",
    contact: "+1 (555) 123-4567",
    email: "contact@techhaven.com",
    category: "Electronics",
    status: "Active",
    description: "Premium electronics and gadgets store",
    createdAt: "2024-10-15",
  },
  {
    id: 2,
    name: "Fashion Hub",
    address: "456 Style Ave, Los Angeles, CA 90001",
    contact: "+1 (555) 234-5678",
    email: "info@fashionhub.com",
    category: "Clothing",
    status: "Active",
    description: "Latest trends in fashion and apparel",
    createdAt: "2024-11-20",
  },
  {
    id: 3,
    name: "Home Decor Plus",
    address: "789 Design Blvd, Chicago, IL 60601",
    contact: "+1 (555) 345-6789",
    email: "hello@homedecor.com",
    category: "Home & Garden",
    status: "Active",
    description: "Beautiful home decor and furniture",
    createdAt: "2024-09-10",
  },
  {
    id: 4,
    name: "Sports World",
    address: "321 Fitness Rd, Miami, FL 33101",
    contact: "+1 (555) 456-7890",
    email: "sales@sportsworld.com",
    category: "Sports",
    status: "Inactive",
    description: "Everything for sports and fitness enthusiasts",
    createdAt: "2024-08-05",
  },
  {
    id: 5,
    name: "Book Nook",
    address: "654 Library Ln, Seattle, WA 98101",
    contact: "+1 (555) 567-8901",
    email: "contact@booknook.com",
    category: "Books",
    status: "Active",
    description: "Wide selection of books and reading materials",
    createdAt: "2024-12-01",
  },
]

const categories = [
  "Electronics",
  "Clothing",
  "Home & Garden",
  "Sports",
  "Books",
  "Food & Beverage",
  "Health & Beauty",
  "Automotive",
  "Toys & Games",
  "Other",
]

export default function ShopManagementPage() {
  const [shops, setShops] = useState(mockShops)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingShop, setEditingShop] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [sortBy, setSortBy] = useState("name")

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    contact: "",
    email: "",
    category: "",
    description: "",
    status: "Active",
  })

  const handleOpenModal = (shop?: any) => {
    if (shop) {
      setEditingShop(shop)
      setFormData({
        name: shop.name,
        address: shop.address,
        contact: shop.contact,
        email: shop.email,
        category: shop.category,
        description: shop.description,
        status: shop.status,
      })
    } else {
      setEditingShop(null)
      setFormData({
        name: "",
        address: "",
        contact: "",
        email: "",
        category: "",
        description: "",
        status: "Active",
      })
    }
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingShop(null)
    setFormData({
      name: "",
      address: "",
      contact: "",
      email: "",
      category: "",
      description: "",
      status: "Active",
    })
  }

  const handleSaveShop = () => {
    if (editingShop) {
      // Update existing shop
      setShops(shops.map(shop => 
        shop.id === editingShop.id 
          ? { ...shop, ...formData }
          : shop
      ))
    } else {
      // Create new shop
      const newShop = {
        id: shops.length + 1,
        ...formData,
        createdAt: new Date().toISOString().split('T')[0],
      }
      setShops([...shops, newShop])
    }
    handleCloseModal()
  }

  const handleDeleteShop = (id: number) => {
    if (confirm("Are you sure you want to delete this shop?")) {
      setShops(shops.filter(shop => shop.id !== id))
    }
  }

  // Filter and sort logic
  const filteredShops = shops
    .filter(shop => {
      const matchesSearch = shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           shop.address.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = filterCategory === "all" || shop.category === filterCategory
      const matchesStatus = filterStatus === "all" || shop.status === filterStatus
      return matchesSearch && matchesCategory && matchesStatus
    })
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name)
      if (sortBy === "category") return a.category.localeCompare(b.category)
      if (sortBy === "status") return a.status.localeCompare(b.status)
      if (sortBy === "date") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      return 0
    })

  // Metrics calculations
  const totalShops = shops.length
  const activeShops = shops.filter(s => s.status === "Active").length
  const inactiveShops = shops.filter(s => s.status === "Inactive").length
  const recentShops = shops.filter(s => {
    const date = new Date(s.createdAt)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    return date >= thirtyDaysAgo
  }).length

  const categoryCounts = shops.reduce((acc, shop) => {
    acc[shop.category] = (acc[shop.category] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const topCategories = Object.entries(categoryCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)

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
        <>
          <ChatbaseWidget />
        </>
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
                <Store className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalShops}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Across all categories
                </p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Shops</CardTitle>
                <Activity className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeShops}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {inactiveShops} inactive
                </p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Added (30 days)</CardTitle>
                <TrendingUp className="h-4 w-4 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{recentShops}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  New this month
                </p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Top Category</CardTitle>
                <PieChart className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {topCategories[0]?.[0] || "N/A"}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {topCategories[0]?.[1] || 0} shops
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Category Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Shops by Category
              </CardTitle>
              <CardDescription>Distribution of shops across categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topCategories.map(([category, count]) => (
                  <div key={category} className="flex items-center gap-4">
                    <div className="min-w-32 text-sm font-medium">{category}</div>
                    <div className="flex-1">
                      <div className="h-8 bg-muted rounded-lg overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-end px-3 text-white text-sm font-medium"
                          style={{ width: `${(count / totalShops) * 100}%` }}
                        >
                          {count}
                        </div>
                      </div>
                    </div>
                    <div className="min-w-16 text-sm text-muted-foreground text-right">
                      {((count / totalShops) * 100).toFixed(1)}%
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

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
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-full sm:w-32">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
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
                      <SelectItem value="status">Status</SelectItem>
                      <SelectItem value="date">Date</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Shop Name</TableHead>
                      <TableHead>Address</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredShops.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          No shops found. Try adjusting your filters or create a new shop.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredShops.map((shop) => (
                        <TableRow key={shop.id}>
                          <TableCell className="font-medium">{shop.name}</TableCell>
                          <TableCell className="max-w-xs truncate">
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                              <span className="truncate">{shop.address}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{shop.category}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center gap-1 text-sm">
                                <Phone className="h-3 w-3 text-muted-foreground" />
                                {shop.contact}
                              </div>
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Mail className="h-3 w-3" />
                                {shop.email}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={shop.status === "Active" ? "default" : "secondary"}
                              className={shop.status === "Active" ? "bg-green-500/10 text-green-700 border-green-500/20" : ""}
                            >
                              {shop.status}
                            </Badge>
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
              <div className="mt-4 text-sm text-muted-foreground">
                Showing {filteredShops.length} of {totalShops} shops
              </div>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>

      {/* Shop Management Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
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
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="address">Address *</Label>
              <Input
                id="address"
                placeholder="Enter shop address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="contact">Contact *</Label>
                <Input
                  id="contact"
                  placeholder="+1 (555) 123-4567"
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="shop@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Enter shop description"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button 
              onClick={handleSaveShop}
              disabled={!formData.name || !formData.address || !formData.contact || !formData.email || !formData.category}
            >
              {editingShop ? "Update Shop" : "Create Shop"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  )
}
