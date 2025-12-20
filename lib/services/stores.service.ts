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

export interface CreateStoreDto {
  storeCategoryId: string
  store_name: string
  store_description: string
  store_phone: string
  store_total_favourites?: number
  user_id?: string
  profile_image_url?: string
  banner_image_url?: string
  gallery_images?: string[]
  videos?: string[]
  store_location?: string
  store_hours?: string
  rating?: number
  comments?: Comment[]
  reviews?: Review[]
}

export interface UpdateStoreDto {
  storeCategoryId?: string
  store_name?: string
  store_description?: string
  store_phone?: string
  store_total_favourites?: number
  profile_image_url?: string
  banner_image_url?: string
  gallery_images?: string[]
  videos?: string[]
  store_location?: string
  store_hours?: string
  rating?: number
  comments?: Comment[]
  reviews?: Review[]
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
  image_url?: string // Legacy, keeping for backwards compatibility
  profile_image_url?: string
  banner_image_url?: string
  gallery_images?: string[]
  videos?: string[]
  store_location?: string
  store_hours?: string
  rating?: number // Average rating
  comments?: Comment[]
  reviews?: Review[]
  userRatings?: UserRating[] // Individual ratings for calculating average
  reviewCount?: number // Total number of reviews
}

export interface Comment {
  id: string
  userId: string
  userName: string
  userAvatar?: string
  text: string
  date: string
  replies?: Reply[]
  likes?: string[] // Array of user IDs who liked
  likeCount?: number // Total likes
}

export interface Reply {
  id: string
  userId: string
  userName: string
  userAvatar?: string
  text: string
  date: string
}

export interface Review {
  id: string
  userId: string
  userName: string
  userAvatar?: string
  rating: number
  text: string
  date: string
}

export interface UserRating {
  userId: string
  rating: number
  date: string
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
   * Subscribe to stores in realtime
   */
  subscribeToStores(callback: (stores: Store[]) => void): () => void {
    const unsubscribe = onSnapshot(
      collection(db, "stores"),
      (querySnapshot) => {
        const stores = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Store[];
        callback(stores);
      },
      (error) => {
        console.error("Error in stores subscription: ", error);
      }
    );

    return unsubscribe;
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
