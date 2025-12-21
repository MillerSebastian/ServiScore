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

  // ... (previous methods)

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
      const newStore = {
        id: docRef.id,
        ...payload
      } as Store;

      // Log Creation
      await this._logStoreActivity('Create', newStore, `Store created: ${newStore.store_name}`, 0, 'General');

      return newStore;
    } catch (error) {
      console.error("Error creating store: ", error);
      throw error;
    }
  }

  /**
   * Add a review to a store
   */
  async addReview(storeId: string, review: Review, storeName: string) {
    const storeRef = doc(db, "stores", storeId);
    // Fetches current store data to append review - in a real app use arrayUnion but we want to log
    // simplified for this context, assuming we just update the array
    try {
      const storeSnap = await getDoc(storeRef);
      if (!storeSnap.exists()) throw new Error("Store not found");

      const currentReviews = storeSnap.data().reviews || [];
      const updatedReviews = [...currentReviews, review];

      // Calculate new average rating
      const totalRating = updatedReviews.reduce((acc: number, r: any) => acc + r.rating, 0);
      const newAverage = totalRating / updatedReviews.length;

      await updateDoc(storeRef, {
        reviews: updatedReviews,
        rating: newAverage,
        reviewCount: updatedReviews.length
      });

      // Log Activity
      await this._logStoreActivity(
        'Review',
        { id: storeId, store_name: storeName } as Store,
        `Rated ${review.rating} stars: "${review.text.substring(0, 30)}..."`,
        review.rating,
        'Rating'
      );

    } catch (error) {
      console.error("Error adding review", error);
      throw error;
    }
  }

  /**
   * Toggle Favorite
   */
  async toggleFavorite(storeId: string, userId: string, isFavorite: boolean, storeName: string) {
    const storeRef = doc(db, "stores", storeId);
    try {
      // This is a simplified logic. Realworld might need a subcollection or array of UserIDs.
      // Assuming we just increment/decrement a counter for the demo 
      // OR we update the favorites array.

      // For the purpose of LOGGING, we just want to record the event.
      // In a real implementation we'd probably call an increment API.

      // Log Activity
      await this._logStoreActivity(
        isFavorite ? 'Favorite' : 'Unfavorite',
        { id: storeId, store_name: storeName } as Store,
        isFavorite ? `Added to favorites` : `Removed from favorites`,
        0,
        'Favorite'
      );
    } catch (error) {
      console.error("Error toggling favorite", error);
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

  /**
   * Log a store view
   */
  async logView(storeId: string, storeName: string, device: string) {
    await this._logStoreActivity('View', { id: storeId, store_name: storeName } as Store, 'Store Page View', 0, 'View', { device });
  }

  // Public: Log Store Activity
  async logActivity(action: string, store: Store, details: string, value: number, type: string, additionalData: any = {}) {
    return this._logStoreActivity(action, store, details, value, type, additionalData);
  }

  // Internal: Log Store Activity
  private async _logStoreActivity(action: string, store: Store, details: string, value: number, type: string, additionalData: any = {}) {
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
      await addDoc(collection(db, "store_logs"), {
        action,
        storeId: store.id,
        storeName: store.store_name,
        details,
        value, // e.g. Rating stars
        type, // 'Rating', 'Favorite', 'General', 'View'
        location,
        device: additionalData.device || 'Desktop',
        timestamp: new Date().toISOString(),
        ...additionalData
      });

    } catch (error) {
      console.error("Failed to log store activity", error);
    }
  }
}

export const storesService = new StoresService()
