const BASE_URL = process.env.NEXT_PUBLIC_SERVISCORE_API || 'https://serviscore-nest-production.up.railway.app'

export interface CreateServiceDto {
  service_category_id: number
  user_id: number
  status_id: number
  service_title: string
  service_description: string
  service_price: number
  service_location: string
  service_datetime: string
}

export interface UpdateServiceDto {
  service_category_id?: number
  user_id?: number
  status_id?: number
  service_title?: string
  service_description?: string
  service_price?: number
  service_location?: string
  service_datetime?: string
}

export interface Service {
  id: number
  service_category_id: number
  user_id: number
  status_id: number
  service_title: string
  service_description: string
  service_price: number
  service_location: string
  service_datetime: string
  service_is_active?: boolean
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

class ServicesService {
  /**
   * Map backend service response to our interface
   */
  private mapService(data: any): Service {
    return {
      id: data.id_service ?? data.id,
      service_category_id: data.service_category_id,
      user_id: data.user_id,
      status_id: data.status_id,
      service_title: data.service_title,
      service_description: data.service_description,
      service_price: parseFloat(data.service_price) || 0,
      service_location: data.service_location,
      service_datetime: data.service_datetime,
      service_is_active: data.service_is_active,
      createdAt: data.service_created_at ?? data.createdAt,
      updatedAt: data.service_updated_at ?? data.updatedAt,
    }
  }

  /**
   * Get all services
   */
  async getAll(): Promise<Service[]> {
    const res = await fetch(`${BASE_URL}/services`, {
      headers: getAuthHeaders(),
    })
    if (!res.ok) {
      throw new Error(`Failed to fetch services: ${res.status}`)
    }
    const data = await res.json()
    return data.map((s: any) => this.mapService(s))
  }

  /**
   * Get service by ID
   */
  async getById(id: number | string): Promise<Service> {
    const res = await fetch(`${BASE_URL}/services/${id}`, {
      headers: getAuthHeaders(),
    })
    if (!res.ok) {
      if (res.status === 404) {
        throw new Error('Service not found')
      }
      throw new Error(`Failed to fetch service: ${res.status}`)
    }
    const data = await res.json()
    return this.mapService(data)
  }

  /**
   * Create a new service
   */
  async create(data: CreateServiceDto): Promise<Service> {
    console.log('[ServicesService] Creating service with data:', JSON.stringify(data, null, 2))
    
    const res = await fetch(`${BASE_URL}/services`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    })
    
    if (!res.ok) {
      const errorText = await res.text()
      console.error('[ServicesService] Create error response:', errorText)
      let error: any = {}
      try {
        error = JSON.parse(errorText)
      } catch {}
      throw new Error(error.message || `Failed to create service: ${res.status}`)
    }
    const responseData = await res.json()
    return this.mapService(responseData)
  }

  /**
   * Update an existing service
   */
  async update(id: number | string, data: UpdateServiceDto): Promise<Service> {
    const res = await fetch(`${BASE_URL}/services/${id}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    })
    if (!res.ok) {
      const error = await res.json().catch(() => ({}))
      throw new Error(error.message || `Failed to update service: ${res.status}`)
    }
    return res.json()
  }

  /**
   * Delete a service
   */
  async delete(id: number | string): Promise<void> {
    const res = await fetch(`${BASE_URL}/services/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    })
    if (!res.ok) {
      throw new Error(`Failed to delete service: ${res.status}`)
    }
  }
}

export const servicesService = new ServicesService()
