export interface User {
  id: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  familyId?: string;
  createdAt: Date;
}

export interface Recipe {
  id: string;
  userId: string;
  title: string;
  description: string;
  imageUrl?: string;
  category: RecipeCategory;
  prepTime: number; // minutes
  cookTime: number; // minutes
  servings: number;
  ingredients: Ingredient[];
  instructions: string[];
  nutrition?: NutritionInfo;
  tags: string[];
  isFavorite: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Ingredient {
  name: string;
  amount: number;
  unit: string;
  category?: IngredientCategory;
}

export interface NutritionInfo {
  calories: number;
  protein: number; // grams
  carbs: number; // grams
  fat: number; // grams
  fiber?: number; // grams
}

export type RecipeCategory =
  | 'main-dish'
  | 'soup'
  | 'appetizer'
  | 'dessert'
  | 'beverage'
  | 'salad'
  | 'other';

export type IngredientCategory =
  | 'meat'
  | 'vegetable'
  | 'fruit'
  | 'dairy'
  | 'grain'
  | 'spice'
  | 'other';

export interface MenuItem {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD format
  mealType: MealType;
  recipeId: string;
  recipe?: Recipe;
  notes?: string;
  createdAt: Date;
}

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface ShoppingList {
  id: string;
  userId: string;
  title: string;
  items: ShoppingItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ShoppingItem {
  id: string;
  name: string;
  amount: number;
  unit: string;
  category: IngredientCategory;
  isChecked: boolean;
  recipeId?: string;
}

export interface Family {
  id: string;
  name: string;
  memberIds: string[];
  createdBy: string;
  createdAt: Date;
}
