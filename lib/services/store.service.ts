import { MOCK_STORES } from "../mock-data"
import type { Store } from "../types/store.types"

class StoreService {
  private readonly basePath = "/stores"

  async getMyStores(): Promise<Store[]> {
    // Minimal implementation returning mock data for local dev
    return Promise.resolve(MOCK_STORES)
  }

  async getPublicStores(): Promise<Store[]> {
    return Promise.resolve(MOCK_STORES)
  }
}

export const storeService = new StoreService()
