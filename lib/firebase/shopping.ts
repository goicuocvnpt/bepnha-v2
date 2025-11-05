import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { db } from './config';
import { ShoppingList } from '../types';

const SHOPPING_COLLECTION = 'shoppingLists';

export const shoppingService = {
  // Create a shopping list
  async createShoppingList(list: Omit<ShoppingList, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, SHOPPING_COLLECTION), {
      ...list,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return docRef.id;
  },

  // Get all shopping lists for a user
  async getUserShoppingLists(userId: string): Promise<ShoppingList[]> {
    const q = query(
      collection(db, SHOPPING_COLLECTION),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
      updatedAt: doc.data().updatedAt.toDate(),
    })) as ShoppingList[];
  },

  // Update a shopping list
  async updateShoppingList(listId: string, updates: Partial<ShoppingList>): Promise<void> {
    const docRef = doc(db, SHOPPING_COLLECTION, listId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    });
  },

  // Delete a shopping list
  async deleteShoppingList(listId: string): Promise<void> {
    const docRef = doc(db, SHOPPING_COLLECTION, listId);
    await deleteDoc(docRef);
  },

  // Toggle item checked status
  async toggleItemChecked(listId: string, itemId: string, isChecked: boolean): Promise<void> {
    const docRef = doc(db, SHOPPING_COLLECTION, listId);
    const list = await this.getShoppingList(listId);
    if (list) {
      const updatedItems = list.items.map(item =>
        item.id === itemId ? { ...item, isChecked } : item
      );
      await updateDoc(docRef, {
        items: updatedItems,
        updatedAt: Timestamp.now(),
      });
    }
  },

  // Get a single shopping list
  async getShoppingList(listId: string): Promise<ShoppingList | null> {
    const docRef = doc(db, SHOPPING_COLLECTION, listId);
    const docSnap = await (await import('firebase/firestore')).getDoc(docRef);

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
        createdAt: docSnap.data().createdAt.toDate(),
        updatedAt: docSnap.data().updatedAt.toDate(),
      } as ShoppingList;
    }
    return null;
  },
};
