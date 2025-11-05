'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/authStore';
import { menuService } from '@/lib/firebase/menu';
import { recipeService } from '@/lib/firebase/recipes';
import { MenuItem, Recipe, MealType } from '@/lib/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { format, startOfWeek, endOfWeek, addDays } from 'date-fns';
import { vi } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';

export default function MenuPage() {
  const { user, loading: authLoading } = useAuthStore();
  const router = useRouter();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const loadData = async () => {
      if (user) {
        try {
          const [menuData, recipesData] = await Promise.all([
            menuService.getMenuItems(
              user.id,
              format(weekStart, 'yyyy-MM-dd'),
              format(weekEnd, 'yyyy-MM-dd')
            ),
            recipeService.getUserRecipes(user.id),
          ]);
          setMenuItems(menuData);
          setRecipes(recipesData);
        } catch (error) {
          console.error('Error loading data:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadData();
  }, [user, weekStart, weekEnd]);

  const getMenuItemsForDate = (date: Date, mealType: MealType) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return menuItems.filter(
      (item) => item.date === dateStr && item.mealType === mealType
    );
  };

  const getRecipeById = (recipeId: string) => {
    return recipes.find((r) => r.id === recipeId);
  };

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const mealTypes: MealType[] = ['breakfast', 'lunch', 'dinner'];
  const mealTypeLabels: Record<MealType, string> = {
    breakfast: 'Sáng',
    lunch: 'Trưa',
    dinner: 'Tối',
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Thực đơn tuần</h1>
          <p className="mt-2 text-gray-600">
            {format(weekStart, 'dd/MM', { locale: vi })} -{' '}
            {format(weekEnd, 'dd/MM/yyyy', { locale: vi })}
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentDate(addDays(currentDate, -7))}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentDate(new Date())}
          >
            Hôm nay
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentDate(addDays(currentDate, 7))}
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border border-gray-300 bg-gray-50 p-3 text-left font-semibold text-gray-700 w-24">
                Bữa ăn
              </th>
              {weekDays.map((day) => (
                <th
                  key={day.toISOString()}
                  className="border border-gray-300 bg-gray-50 p-3 text-center font-semibold text-gray-700"
                >
                  <div>{format(day, 'EEEE', { locale: vi })}</div>
                  <div className="text-sm font-normal text-gray-500">
                    {format(day, 'dd/MM')}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {mealTypes.map((mealType) => (
              <tr key={mealType}>
                <td className="border border-gray-300 bg-gray-50 p-3 font-medium text-gray-700">
                  {mealTypeLabels[mealType]}
                </td>
                {weekDays.map((day) => {
                  const items = getMenuItemsForDate(day, mealType);
                  return (
                    <td
                      key={day.toISOString()}
                      className="border border-gray-300 p-3 align-top"
                    >
                      <div className="space-y-2">
                        {items.map((item) => {
                          const recipe = getRecipeById(item.recipeId);
                          return (
                            <div
                              key={item.id}
                              className="bg-blue-50 p-2 rounded text-sm"
                            >
                              {recipe?.title || 'Đang tải...'}
                            </div>
                          );
                        })}
                        <button
                          className="w-full text-left text-gray-400 hover:text-blue-600 text-sm flex items-center space-x-1"
                          onClick={() => {
                            // TODO: Open modal to add menu item
                            console.log('Add menu item', day, mealType);
                          }}
                        >
                          <Plus className="w-4 h-4" />
                          <span>Thêm món</span>
                        </button>
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {recipes.length === 0 && (
        <Card className="text-center py-12 mt-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Chưa có công thức nào
          </h3>
          <p className="text-gray-600 mb-6">
            Thêm công thức trước khi lên thực đơn
          </p>
          <Button
            variant="primary"
            onClick={() => router.push('/recipes/new')}
          >
            Thêm công thức
          </Button>
        </Card>
      )}
    </div>
  );
}
