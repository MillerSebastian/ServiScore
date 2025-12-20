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
  orderBy
} from 'firebase/firestore'

export interface CreateStoreDto {
  storeCategoryId: string
  store_name: string
  store_description: string
  store_phone: string
  store_total_favourites?: number
  user_id?: string // Added user_id
}

export interface UpdateStoreDto {
  storeCategoryId?: string
  store_name?: string
  store_description?: string
  store_phone?: string
  store_total_favourites?: number
}

export interface Store {
  id: string // Firestore ID
  storeCategoryId: string
  store_name: string
  store_description: string
  store_phone: string
  store_total_favourites?: number
  user_id?: string
  createdAt?: string
  updatedAt?: string
  image_url?: string;
}

class StoresService {
  /**
   * Get all stores
   */
  async getAll(): Promise<Store[]> {
    try {
      const querySnapshot = await getDocs(collection(db, "stores"));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Store[];
    } catch (error) {
      console.error("Error fetching stores: ", error);
      throw error;
    }
  }

  /**
   * Get a store by ID
   */
  async getById(id: string): Promise<Store> {
    try {
      const docRef = doc(db, "stores", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        } as Store;
      } else {
        throw new Error("Store not found");
      }
    } catch (error) {
      console.error("Error fetching store: ", error);
      throw error;
    }
  }

  /**
   * Create a new store
   */
  async create(data: CreateStoreDto): Promise<Store> {
    try {
      const payload = {
        ...data,
        store_total_favourites: data.store_total_favourites || 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      const docRef = await addDoc(collection(db, "stores"), payload);
      return {
        id: docRef.id,
        ...payload
      } as Store;
    } catch (error) {
      console.error("Error creating store: ", error);
      throw error;
    }
  }

  /**
   * Update an existing store
   */
  async update(id: string, data: UpdateStoreDto): Promise<void> {
    try {
      const docRef = doc(db, "stores", id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error updating store: ", error);
      throw error;
    }
  }

  /**
   * Delete a store
   */
  async delete(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, "stores", id));
    } catch (error) {
      console.error("Error deleting store: ", error);
      throw error;
    }
  }
}

export const storesService = new StoresService()
