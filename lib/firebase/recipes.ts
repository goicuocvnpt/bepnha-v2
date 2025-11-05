import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { db } from './config';
import { Recipe } from '../types';

const RECIPES_COLLECTION = 'recipes';

export const recipeService = {
  // Create a new recipe
  async createRecipe(recipe: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, RECIPES_COLLECTION), {
      ...recipe,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return docRef.id;
  },

  // Get all recipes for a user
  async getUserRecipes(userId: string): Promise<Recipe[]> {
    const q = query(
      collection(db, RECIPES_COLLECTION),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
      updatedAt: doc.data().updatedAt.toDate(),
    })) as Recipe[];
  },

  // Get a single recipe by ID
  async getRecipe(recipeId: string): Promise<Recipe | null> {
    const docRef = doc(db, RECIPES_COLLECTION, recipeId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
        createdAt: docSnap.data().createdAt.toDate(),
        updatedAt: docSnap.data().updatedAt.toDate(),
      } as Recipe;
    }
    return null;
  },

  // Update a recipe
  async updateRecipe(recipeId: string, updates: Partial<Recipe>): Promise<void> {
    const docRef = doc(db, RECIPES_COLLECTION, recipeId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    });
  },

  // Delete a recipe
  async deleteRecipe(recipeId: string): Promise<void> {
    const docRef = doc(db, RECIPES_COLLECTION, recipeId);
    await deleteDoc(docRef);
  },

  // Search recipes by title or tags
  async searchRecipes(userId: string, searchTerm: string): Promise<Recipe[]> {
    const allRecipes = await this.getUserRecipes(userId);
    return allRecipes.filter(recipe =>
      recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  },

  // Get recipes by category
  async getRecipesByCategory(userId: string, category: string): Promise<Recipe[]> {
    const q = query(
      collection(db, RECIPES_COLLECTION),
      where('userId', '==', userId),
      where('category', '==', category),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
      updatedAt: doc.data().updatedAt.toDate(),
    })) as Recipe[];
  },

  // Toggle favorite status
  async toggleFavorite(recipeId: string, isFavorite: boolean): Promise<void> {
    const docRef = doc(db, RECIPES_COLLECTION, recipeId);
    await updateDoc(docRef, {
      isFavorite,
      updatedAt: Timestamp.now(),
    });
  },
};
