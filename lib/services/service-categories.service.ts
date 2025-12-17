const BASE_URL = process.env.NEXT_PUBLIC_SERVISCORE_API || 'https://serviscore-nest-production.up.railway.app'

export interface CreateServiceCategoryDto {
  name: string
  description?: string
}

export interface UpdateServiceCategoryDto {
  name?: string
  description?: string
}

export interface ServiceCategory {
  id: number
  name: string
  description?: string
  isActive?: boolean
  createdAt?: string
  updatedAt?: string
}

function getAuthHeaders(): HeadersInit {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  }
}

function requireAuthToken(): string {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null
  if (!token) {
    throw new Error('Not authenticated')
  }
  return token
}

class ServiceCategoriesService {
  /**
   * Get all service categories
   */
  async getAll(): Promise<ServiceCategory[]> {
    const res = await fetch(`${BASE_URL}/service-category`, {
      method: 'GET',
      headers: getAuthHeaders(),
    })
    if (!res.ok) {
      throw new Error(`Failed to fetch service categories: ${res.status}`)
    }
    const data = await res.json()
    
    // Map backend response to our interface (backend uses id_service_category)
    return data.map((cat: any) => ({
      id: cat.id_service_category ?? cat.id ?? cat.service_category_id,
      name: cat.name ?? cat.service_category_name ?? `Category ${cat.id_service_category ?? cat.id}`,
      description: cat.description ?? cat.service_category_description ?? '',
      isActive: cat.isActive ?? cat.is_active ?? true,
      createdAt: cat.createdAt ?? cat.created_at,
      updatedAt: cat.updatedAt ?? cat.updated_at,
    }))
  }

  /**
   * Get a service category by ID
   */
  async getById(id: number | string): Promise<ServiceCategory> {
    const res = await fetch(`${BASE_URL}/service-category/${id}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    })
    if (!res.ok) {
      if (res.status === 404) {
        throw new Error('Service category not found')
      }
      throw new Error(`Failed to fetch service category: ${res.status}`)
    }
    return res.json()
  }

  /**
   * Create a new service category (Admin only)
   */
  async create(data: CreateServiceCategoryDto): Promise<ServiceCategory> {
    const token = requireAuthToken()
    console.log('[ServiceCategoriesService] Creating category with data:', JSON.stringify(data, null, 2))
    console.log('[ServiceCategoriesService] Auth token present:', Boolean(token))
    
    const res = await fetch(`${BASE_URL}/service-category`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    })
    
    if (!res.ok) {
      const errorText = await res.text()
      console.error('[ServiceCategoriesService] Create error status:', res.status)
      console.error('[ServiceCategoriesService] Create error response:', errorText)
      let error: any = {}
      try {
        error = JSON.parse(errorText)
      } catch {}
      throw new Error(error.message || `Failed to create service category: ${res.status}`)
    }
    return res.json()
  }

  /**
   * Update an existing service category (Admin only)
   */
  async update(id: number | string, data: UpdateServiceCategoryDto): Promise<ServiceCategory> {
    requireAuthToken()
    const res = await fetch(`${BASE_URL}/service-category/${id}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    })
    if (!res.ok) {
      const error = await res.json().catch(() => ({}))
      throw new Error(error.message || `Failed to update service category: ${res.status}`)
    }
    return res.json()
  }

  /**
   * Delete (toggle active status) a service category (Admin only)
   */
  async delete(id: number | string): Promise<void> {
    requireAuthToken()
    const res = await fetch(`${BASE_URL}/service-category/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    })
    if (!res.ok) {
      const error = await res.json().catch(() => ({}))
      throw new Error(error.message || `Failed to delete service category: ${res.status}`)
    }
  }
}

export const serviceCategoriesService = new ServiceCategoriesService()
