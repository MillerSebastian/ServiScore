import { db } from '../firebase'
import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  writeBatch
} from 'firebase/firestore'

export interface CreateServiceCategoryDto {
  name: string
  description?: string
}

export interface UpdateServiceCategoryDto {
  name?: string
  description?: string
}

export interface ServiceCategory {
  id: string // Firestore IDs are strings
  name: string
  description?: string
  isActive?: boolean
  createdAt?: string
  updatedAt?: string
}

const DEFAULT_CATEGORIES = [
  { name: "Plumbing", description: "Pipes, faucets, and leaks" },
  { name: "Electrical", description: "Wiring, lights, and panels" },
  { name: "Cleaning", description: "Home and office cleaning" },
  { name: "Landscaping", description: "Garden and lawn care" },
  { name: "Painting", description: "Interior and exterior painting" },
  { name: "Carpentry", description: "Woodwork and repairs" },
  { name: "HVAC", description: "Heating and air conditioning" },
  { name: "Moving", description: "Relocation assistance" },
  { name: "Pest Control", description: "Removal of bugs and pests" },
  { name: "Roofing", description: "Roof repairs and installation" }
];

class ServiceCategoriesService {
  /**
   * Get all service categories
   */
  async getAll(): Promise<ServiceCategory[]> {
    try {
      const querySnapshot = await getDocs(collection(db, "service_categories"));
      let categories = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ServiceCategory[];

      // Seed if empty
      if (categories.length === 0) {
        categories = await this.seedCategories();
      }

      return categories;
    } catch (error) {
      console.error("Error fetching categories: ", error);
      throw error;
    }
  }

  /**
   * Seed default categories
   */
  async seedCategories(): Promise<ServiceCategory[]> {
    const batch = writeBatch(db);
    const newCategories: ServiceCategory[] = [];

    DEFAULT_CATEGORIES.forEach(cat => {
      const docRef = doc(collection(db, "service_categories"));
      const payload = {
        name: cat.name,
        description: cat.description,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      batch.set(docRef, payload);
      newCategories.push({ id: docRef.id, ...payload });
    });

    await batch.commit();
    return newCategories;
  }

  /**
   * Get a service category by ID
   */
  async getById(id: string): Promise<ServiceCategory> {
    try {
      const docRef = doc(db, "service_categories", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        } as ServiceCategory;
      } else {
        throw new Error("Service category not found");
      }
    } catch (error) {
      console.error("Error fetching category: ", error);
      throw error;
    }
  }

  /**
   * Create a new service category (Admin only)
   */
  async create(data: CreateServiceCategoryDto): Promise<ServiceCategory> {
    try {
      const payload = {
        ...data,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      const docRef = await addDoc(collection(db, "service_categories"), payload);
      return {
        id: docRef.id,
        ...payload
      } as ServiceCategory;
    } catch (error) {
      console.error("Error creating category: ", error);
      throw error;
    }
  }

  /**
   * Update an existing service category (Admin only)
   */
  async update(id: string, data: UpdateServiceCategoryDto): Promise<void> {
    try {
      const docRef = doc(db, "service_categories", id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error updating category: ", error);
      throw error;
    }
  }

  /**
   * Delete (toggle active status) a service category (Admin only)
   */
  async delete(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, "service_categories", id));
    } catch (error) {
      console.error("Error deleting category: ", error);
      throw error;
    }
  }
}

export const serviceCategoriesService = new ServiceCategoriesService()
