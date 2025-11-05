'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/authStore';
import { recipeService } from '@/lib/firebase/recipes';
import { Recipe } from '@/lib/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Plus, Search, Heart, Clock, Users } from 'lucide-react';
import Link from 'next/link';

export default function RecipesPage() {
  const { user, loading: authLoading } = useAuthStore();
  const router = useRouter();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const loadRecipes = async () => {
      if (user) {
        try {
          const data = await recipeService.getUserRecipes(user.id);
          setRecipes(data);
        } catch (error) {
          console.error('Error loading recipes:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadRecipes();
  }, [user]);

  const filteredRecipes = recipes.filter((recipe) =>
    recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recipe.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Công thức nấu ăn</h1>
          <p className="mt-2 text-gray-600">
            Quản lý và lưu trữ các công thức yêu thích
          </p>
        </div>
        <Button
          variant="primary"
          className="mt-4 md:mt-0 flex items-center space-x-2"
          onClick={() => router.push('/recipes/new')}
        >
          <Plus className="w-5 h-5" />
          <span>Thêm công thức</span>
        </Button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="text"
            placeholder="Tìm kiếm công thức..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {filteredRecipes.length === 0 ? (
        <Card className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Plus className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Chưa có công thức nào
          </h3>
          <p className="text-gray-600 mb-6">
            Bắt đầu bằng cách thêm công thức đầu tiên của bạn
          </p>
          <Button
            variant="primary"
            onClick={() => router.push('/recipes/new')}
          >
            Thêm công thức đầu tiên
          </Button>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecipes.map((recipe) => (
            <Link key={recipe.id} href={`/recipes/${recipe.id}`}>
              <Card className="h-full hover:shadow-xl transition-shadow">
                {recipe.imageUrl && (
                  <div className="w-full h-48 bg-gray-200 rounded-lg mb-4 overflow-hidden">
                    <img
                      src={recipe.imageUrl}
                      alt={recipe.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xl font-semibold text-gray-900 flex-1">
                    {recipe.title}
                  </h3>
                  {recipe.isFavorite && (
                    <Heart className="w-5 h-5 text-red-500 fill-current flex-shrink-0 ml-2" />
                  )}
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {recipe.description}
                </p>

                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{recipe.prepTime + recipe.cookTime} phút</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>{recipe.servings} người</span>
                  </div>
                </div>

                {recipe.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {recipe.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
