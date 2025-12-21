import { db } from '../firebase'
import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  onSnapshot
} from 'firebase/firestore'

export interface CreateServiceDto {
  service_category_id: string
  user_id: string // Changed to string for Firebase UID
  status_id: number
  service_title: string
  service_description: string
  service_price: number
  service_location: string
  service_datetime: string
  image_url?: string
}

export interface UpdateServiceDto {
  service_category_id?: string
  user_id?: string
  status_id?: number
  service_title?: string
  service_description?: string
  service_price?: number
  service_location?: string
  service_datetime?: string
  image_url?: string
}

export interface Service {
  id: string // Firestore IDs are strings
  service_category_id: string
  user_id: string
  status_id: number
  service_title: string
  service_description: string
  service_price: number
  service_location: string
  service_datetime: string
  image_url?: string
  service_is_active?: boolean
  createdAt?: string
  updatedAt?: string
}

class ServicesService {
  /**
   * Get all services
   */
  async getAll(): Promise<Service[]> {
    try {
      const querySnapshot = await getDocs(collection(db, "services"));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Service[];
    } catch (error) {
      console.error("Error fetching services: ", error);
      throw error;
    }
  }

  /**
   * Subscribe to services in realtime
   */
  subscribeToServices(callback: (services: Service[]) => void): () => void {
    const unsubscribe = onSnapshot(
      collection(db, "services"),
      (querySnapshot) => {
        const services = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Service[];
        callback(services);
      },
      (error) => {
        console.error("Error in services subscription: ", error);
      }
    );

    return unsubscribe;
  }

  /**
   * Get service by ID
   */
  async getById(id: string): Promise<Service> {
    try {
      const docRef = doc(db, "services", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        } as Service;
      } else {
        throw new Error("Service not found");
      }
    } catch (error) {
      console.error("Error fetching service: ", error);
      throw error;
    }
  }

  /**
   * Create a new service
   */
  async create(data: CreateServiceDto): Promise<Service> {
    try {
      const payload = {
        ...data,
        service_is_active: true, // Default to true
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      const docRef = await addDoc(collection(db, "services"), payload);
      return {
        id: docRef.id,
        ...payload
      } as Service;
    } catch (error) {
      console.error("Error creating service: ", error);
      throw error;
    }
  }

  /**
   * Update an existing service
   */
  async update(id: string, data: UpdateServiceDto): Promise<void> {
    try {
      const docRef = doc(db, "services", id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error updating service: ", error);
      throw error;
    }
  }

  /**
   * Delete a service
   */
  async delete(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, "services", id));
    } catch (error) {
      console.error("Error deleting service: ", error);
      throw error;
    }
  }
  /**
   * Log a service view
   */
  async logView(serviceId: string, serviceName: string, device: string) {
    await this._logServiceActivity('View', { id: serviceId, service_title: serviceName } as Service, 'Service Page View', 0, 'View', { device });
  }

  // Public: Log Service Activity
  async logActivity(action: string, service: Service, details: string, value: number, type: string, additionalData: any = {}) {
    return this._logServiceActivity(action, service, details, value, type, additionalData);
  }

  // Internal: Log Service Activity
  private async _logServiceActivity(action: string, service: Service, details: string, value: number, type: string, additionalData: any = {}) {
    try {
      // 1. Fetch Location
      let location = "Unknown Location";
      try {
        const res = await fetch('https://ipapi.co/json/');
        const data = await res.json();
        if (data.city && data.country_name) {
          location = `${data.city}, ${data.country_name}`;
        }
      } catch (e) {
        console.warn("Failed to fetch location for log", e);
      }

      // 2. Create Log
      await addDoc(collection(db, "service_logs"), {
        action,
        serviceId: service.id,
        serviceName: service.service_title,
        details,
        value,
        type,
        location,
        device: additionalData.device || 'Desktop',
        timestamp: new Date().toISOString(),
        ...additionalData
      });

    } catch (error) {
      console.error("Failed to log service activity", error);
    }
  }
}

export const servicesService = new ServicesService()
