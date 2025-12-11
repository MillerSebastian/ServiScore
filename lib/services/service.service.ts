import { MOCK_SERVICES } from "../mock-data"
import type { Service } from "../types/service.types"

class ServiceService {
  private readonly basePath = "/services"

  async getMyServices(): Promise<Service[]> {
    // Minimal implementation returning mock data for local dev
    return Promise.resolve(MOCK_SERVICES)
  }

  async getPublicServices(): Promise<Service[]> {
    return Promise.resolve(MOCK_SERVICES)
  }
}

export const serviceService = new ServiceService()
