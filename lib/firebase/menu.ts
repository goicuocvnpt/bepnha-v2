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
import { MenuItem } from '../types';

const MENU_COLLECTION = 'menuItems';

export const menuService = {
  // Create a menu item
  async createMenuItem(menuItem: Omit<MenuItem, 'id' | 'createdAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, MENU_COLLECTION), {
      ...menuItem,
      createdAt: Timestamp.now(),
    });
    return docRef.id;
  },

  // Get menu items for a date range
  async getMenuItems(userId: string, startDate: string, endDate: string): Promise<MenuItem[]> {
    const q = query(
      collection(db, MENU_COLLECTION),
      where('userId', '==', userId),
      where('date', '>=', startDate),
      where('date', '<=', endDate),
      orderBy('date', 'asc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
    })) as MenuItem[];
  },

  // Get menu items for a specific date
  async getMenuItemsForDate(userId: string, date: string): Promise<MenuItem[]> {
    const q = query(
      collection(db, MENU_COLLECTION),
      where('userId', '==', userId),
      where('date', '==', date)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
    })) as MenuItem[];
  },

  // Update a menu item
  async updateMenuItem(menuItemId: string, updates: Partial<MenuItem>): Promise<void> {
    const docRef = doc(db, MENU_COLLECTION, menuItemId);
    await updateDoc(docRef, updates);
  },

  // Delete a menu item
  async deleteMenuItem(menuItemId: string): Promise<void> {
    const docRef = doc(db, MENU_COLLECTION, menuItemId);
    await deleteDoc(docRef);
  },

  // Get menu items for the current week
  async getWeekMenu(userId: string, startOfWeek: string, endOfWeek: string): Promise<MenuItem[]> {
    return this.getMenuItems(userId, startOfWeek, endOfWeek);
  },
};
