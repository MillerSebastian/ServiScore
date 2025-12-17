const BASE_URL = process.env.NEXT_PUBLIC_SERVISCORE_API || 'https://serviscore-nest-production.up.railway.app'

export interface CreateStoreDto {
  storeCategoryId: number
  store_name: string
  store_description: string
  store_phone: string
  store_total_favourites?: number
}

export interface UpdateStoreDto {
  storeCategoryId?: number
  store_name?: string
  store_description?: string
  store_phone?: string
  store_total_favourites?: number
}

export interface Store {
  id: number
  storeCategoryId: number
  store_name: string
  store_description: string
  store_phone: string
  store_total_favourites?: number
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

class StoresService {
  /**
   * Get all stores
   */
  async getAll(): Promise<Store[]> {
    const res = await fetch(`${BASE_URL}/stores`, {
      method: 'GET',
      headers: getAuthHeaders(),
    })
    if (!res.ok) {
      throw new Error(`Failed to fetch stores: ${res.status}`)
    }
    return res.json()
  }

  /**
   * Get a store by ID
   */
  async getById(id: number | string): Promise<Store> {
    const res = await fetch(`${BASE_URL}/stores/${id}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    })
    if (!res.ok) {
      if (res.status === 404) {
        throw new Error('Store not found')
      }
      throw new Error(`Failed to fetch store: ${res.status}`)
    }
    return res.json()
  }

  /**
   * Create a new store
   */
  async create(data: CreateStoreDto): Promise<Store> {
    const token = requireAuthToken()
    console.log('[StoresService] Creating store with data:', JSON.stringify(data, null, 2))
    console.log('[StoresService] Auth token present:', Boolean(token))
    
    const res = await fetch(`${BASE_URL}/stores`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    })
    
    if (!res.ok) {
      const errorText = await res.text()
      console.error('[StoresService] Create error status:', res.status)
      console.error('[StoresService] Create error response:', errorText)
      let error: any = {}
      try {
        error = JSON.parse(errorText)
      } catch {}
      throw new Error(error.message || `Failed to create store: ${res.status}`)
    }
    return res.json()
  }

  /**
   * Update an existing store
   */
  async update(id: number | string, data: UpdateStoreDto): Promise<Store> {
    requireAuthToken()
    const res = await fetch(`${BASE_URL}/stores/${id}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    })
    if (!res.ok) {
      const error = await res.json().catch(() => ({}))
      throw new Error(error.message || `Failed to update store: ${res.status}`)
    }
    return res.json()
  }

  /**
   * Delete a store
   */
  async delete(id: number | string): Promise<void> {
    requireAuthToken()
    const res = await fetch(`${BASE_URL}/stores/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    })
    if (!res.ok) {
      const error = await res.json().catch(() => ({}))
      throw new Error(error.message || `Failed to delete store: ${res.status}`)
    }
  }
}

export const storesService = new StoresService()
