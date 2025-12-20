"use client"

import { useState, useEffect } from "react"
import { servicesService, Service, CreateServiceDto, UpdateServiceDto } from "@/lib/services/services.service"
import { serviceCategoriesService, ServiceCategory } from "@/lib/services/service-categories.service"
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
  Briefcase,
  TrendingUp,
  DollarSign,
  MapPin,
  Calendar,
  Filter,
  ArrowUpDown,
  Loader2,
  Upload,
  X
} from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { auth } from "@/lib/firebase"
import { toast } from "sonner"
import { authService } from "@/lib/services/auth.service"
import { useRouter } from "next/navigation"

// Status mapping
const statusMap: Record<number, string> = {
  1: "Active",
  2: "Inactive",
  3: "Pending",
}

export default function ServiceManagementPage() {
  const router = useRouter()
  const [services, setServices] = useState<Service[]>([])
  const [categories, setCategories] = useState<ServiceCategory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [sortBy, setSortBy] = useState("title")

  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  // Form state matching backend fields
  const [formData, setFormData] = useState({
    service_title: "",
    service_description: "",
    service_category_id: "",
    service_price: "",
    service_location: "",
    service_datetime: "",
    status_id: "1",
  })

  // Fetch services and categories on mount
  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setIsLoading(true)
      const [servicesData, categoriesData] = await Promise.all([
        servicesService.getAll(),
        serviceCategoriesService.getAll()
      ])
      setServices(servicesData)
      setCategories(categoriesData)
    } catch (error) {
      console.error('Failed to fetch data:', error)
      toast.error('Failed to fetch data')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenModal = async (service?: Service) => {
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
        description: "Debes completar el proceso de verificación para gestionar servicios"
      })
      router.push("/profile")
      return
    }

    if (service) {
      setEditingService(service)
      setFormData({
        service_title: service.service_title || "",
        service_description: service.service_description || "",
        service_category_id: String(service.service_category_id || ""),
        service_price: String(service.service_price || ""),
        service_location: service.service_location || "",
        service_datetime: service.service_datetime ? service.service_datetime.slice(0, 16) : "",
        status_id: String(service.status_id || "1"),
      })
      setImagePreview(null) // Reset preview for edit (could fetch existing image if URL stored)
    } else {
      setEditingService(null)
      setFormData({
        service_title: "",
        service_description: "",
        service_category_id: "",
        service_price: "",
        service_location: "",
        service_datetime: "",
        status_id: "1",
      })
      setImagePreview(null)
    }
    setImageFile(null)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingService(null)
    setFormData({
      service_title: "",
      service_description: "",
      service_category_id: "",
      service_price: "",
      service_location: "",
      service_datetime: "",
      status_id: "1",
    })
    setImageFile(null)
    setImagePreview(null)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSaveService = async () => {
    try {
      setIsSaving(true)
      const currentUser = auth.currentUser

      if (!currentUser) {
        toast.error('You must be logged in')
        return
      }

      let imageUrl = null;
      if (imageFile) {
        const formData = new FormData();
        formData.append('file', imageFile);
        formData.append('folder', 'services');

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });

        if (!res.ok) throw new Error('Image upload failed');
        const data = await res.json();
        imageUrl = data.secure_url;
      }

      const payload: CreateServiceDto | UpdateServiceDto = {
        service_title: formData.service_title,
        service_description: formData.service_description,
        service_category_id: formData.service_category_id,
        service_price: Number(formData.service_price),
        service_location: formData.service_location,
        service_datetime: formData.service_datetime ? new Date(formData.service_datetime).toISOString() : new Date().toISOString(),
        status_id: Number(formData.status_id),
        user_id: currentUser.uid,
        // Add image URL to payload if we had a field for it in DTO (assuming we might adding it later or mixing)
        // For now, services DTO doesn't explicitly have image_url, but Firestore allows extra fields.
        // We'll add it to payload as any.
      }

      if (imageUrl) {
        (payload as any).image_url = imageUrl;
      }

      if (editingService) {
        await servicesService.update(editingService.id, payload)
        toast.success('Service updated')
      } else {
        await servicesService.create(payload as CreateServiceDto)
        toast.success('Service created')
      }

      await fetchData()
      handleCloseModal()
    } catch (error) {
      console.error('Failed to save service:', error)
      toast.error('Failed to save service')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteService = async (id: string) => {
    if (confirm("Are you sure you want to delete this service?")) {
      try {
        await servicesService.delete(id)
        toast.success('Service deleted')
        await fetchData()
      } catch (error) {
        console.error('Failed to delete service:', error)
        toast.error('Failed to delete service')
      }
    }
  }

  // Build category map from loaded categories
  const categoryMap: Record<string, string> = categories.reduce((acc, cat) => {
    acc[String(cat.id)] = cat.name
    return acc
  }, {} as Record<string, string>)

  // Filter and sort logic
  const filteredServices = services
    .filter(service => {
      const matchesSearch = service.service_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.service_description?.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = filterCategory === "all" || String(service.service_category_id) === filterCategory
      const matchesStatus = filterStatus === "all" || String(service.status_id) === filterStatus
      return matchesSearch && matchesCategory && matchesStatus
    })
    .sort((a, b) => {
      if (sortBy === "title") return (a.service_title || "").localeCompare(b.service_title || "")
      if (sortBy === "price") return (b.service_price || 0) - (a.service_price || 0)
      if (sortBy === "date") return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
      return 0
    })

  // Metrics calculations
  const totalServices = services.length
  const activeServices = services.filter(s => s.status_id === 1).length
  const totalRevenue = services.reduce((sum, s) => sum + (s.service_price || 0), 0)

  const recentServices = services.filter(s => {
    if (!s.createdAt) return false
    const date = new Date(s.createdAt)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    return date >= thirtyDaysAgo
  }).length

  const categoryCounts = services.reduce((acc, service) => {
    const catName = categoryMap[service.service_category_id] || "Other"
    acc[catName] = (acc[catName] || 0) + 1
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
        <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Service Management</h1>
              <p className="text-muted-foreground">Create, manage, and analyze your services</p>
            </div>
            <Button onClick={() => handleOpenModal()} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Service
            </Button>
          </div>

          {/* Metrics Dashboard */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Services</CardTitle>
                <Briefcase className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalServices}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {activeServices} active
                </p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Value</CardTitle>
                <DollarSign className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Combined service prices
                </p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">New (30 days)</CardTitle>
                <TrendingUp className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{recentServices}</div>
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

          {/* Service List */}
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <CardTitle>Service List</CardTitle>
                  <CardDescription>Manage all your services in one place</CardDescription>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search services..."
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
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-full sm:w-32">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="1">Active</SelectItem>
                      <SelectItem value="2">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-full sm:w-32">
                      <ArrowUpDown className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Sort" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="title">Title</SelectItem>
                      <SelectItem value="price">Price</SelectItem>
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
                        <TableHead>Title</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredServices.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                            No services found. Try adjusting your filters or create a new service.
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredServices.map((service) => (
                          <TableRow key={service.id}>
                            <TableCell className="font-medium">
                              <div>
                                <p className="font-semibold">{service.service_title}</p>
                                <p className="text-xs text-muted-foreground line-clamp-1">{service.service_description}</p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{categoryMap[service.service_category_id] || "Other"}</Badge>
                            </TableCell>
                            <TableCell className="font-semibold">${service.service_price?.toLocaleString()}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3 text-muted-foreground" />
                                {service.service_location || "-"}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3 text-muted-foreground" />
                                {service.service_datetime ? new Date(service.service_datetime).toLocaleDateString() : "-"}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={service.status_id === 1 ? "default" : "secondary"}
                                className={service.status_id === 1 ? "bg-green-500/10 text-green-700 border-green-500/20" : ""}
                              >
                                {statusMap[service.status_id] || "Unknown"}
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
                                  <DropdownMenuItem onClick={() => handleOpenModal(service)}>
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => handleDeleteService(service.id)}
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
                Showing {filteredServices.length} of {totalServices} services
              </div>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>

      {/* Service Management Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingService ? "Edit Service" : "Create New Service"}</DialogTitle>
            <DialogDescription>
              {editingService ? "Update service information" : "Add a new service to your collection"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
            </div>
            <div className="grid gap-2">
              <Label>Service Image</Label>
              <div className="flex items-center gap-4">
                <div className="relative h-20 w-20 border rounded-md overflow-hidden bg-muted">
                  {imagePreview ? (
                    <>
                      <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview(null);
                          setImageFile(null);
                        }}
                        className="absolute top-0 right-0 p-1 bg-black/50 text-white hover:bg-red-500 rounded-bl-md"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </>
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                      <Upload className="h-6 w-6" />
                    </div>
                  )}
                </div>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={isSaving}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="title">Service Title *</Label>
              <Input
                id="title"
                placeholder="Enter service title"
                value={formData.service_title}
                onChange={(e) => setFormData({ ...formData, service_title: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.service_category_id} onValueChange={(value) => setFormData({ ...formData, service_category_id: value })}>
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
                <Label htmlFor="price">Price ($) *</Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="0.00"
                  value={formData.service_price}
                  onChange={(e) => setFormData({ ...formData, service_price: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  placeholder="e.g., City A area"
                  value={formData.service_location}
                  onChange={(e) => setFormData({ ...formData, service_location: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="datetime">Date & Time</Label>
                <Input
                  id="datetime"
                  type="datetime-local"
                  value={formData.service_datetime}
                  onChange={(e) => setFormData({ ...formData, service_datetime: e.target.value })}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status_id} onValueChange={(value) => setFormData({ ...formData, status_id: value })}>
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Active</SelectItem>
                  <SelectItem value="2">Inactive</SelectItem>
                  <SelectItem value="3">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter service description"
                rows={3}
                value={formData.service_description}
                onChange={(e) => setFormData({ ...formData, service_description: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveService}
              disabled={!formData.service_title || !formData.service_category_id || !formData.service_price || !formData.service_location || isSaving}
            >
              {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {editingService ? "Update Service" : "Create Service"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  )
}
