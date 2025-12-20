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
}

export const servicesService = new ServicesService()
