'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/authStore';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Sparkles, Plus, Trash2 } from 'lucide-react';

export default function AISuggestionsPage() {
  const { user, loading: authLoading } = useAuthStore();
  const router = useRouter();
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [newIngredient, setNewIngredient] = useState('');
  const [preferences, setPreferences] = useState('');
  const [suggestions, setSuggestions] = useState('');
  const [loading, setLoading] = useState(false);
  const [numberOfDays, setNumberOfDays] = useState(7);
  const [peopleCount, setPeopleCount] = useState(4);
  const [mealPlan, setMealPlan] = useState('');
  const [loadingMealPlan, setLoadingMealPlan] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, authLoading, router]);

  const addIngredient = () => {
    if (newIngredient.trim()) {
      setIngredients([...ingredients, newIngredient.trim()]);
      setNewIngredient('');
    }
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const generateSuggestions = async () => {
    if (ingredients.length === 0) {
      alert('Vui lòng thêm ít nhất một nguyên liệu');
      return;
    }

    setLoading(true);
    setSuggestions('');

    try {
      const response = await fetch('/api/ai/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredients, preferences }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuggestions(data.suggestions);
      } else {
        alert(data.error || 'Có lỗi xảy ra');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Có lỗi xảy ra khi tạo gợi ý');
    } finally {
      setLoading(false);
    }
  };

  const generateMealPlan = async () => {
    setLoadingMealPlan(true);
    setMealPlan('');

    try {
      const response = await fetch('/api/ai/meal-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ numberOfDays, peopleCount, preferences }),
      });

      const data = await response.json();

      if (response.ok) {
        setMealPlan(data.mealPlan);
      } else {
        alert(data.error || 'Có lỗi xảy ra');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Có lỗi xảy ra khi tạo thực đơn');
    } finally {
      setLoadingMealPlan(false);
    }
  };

  if (authLoading) {
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
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <Sparkles className="w-8 h-8 text-yellow-500" />
          <h1 className="text-3xl font-bold text-gray-900">Gợi ý AI</h1>
        </div>
        <p className="text-gray-600">
          Nhận gợi ý món ăn và thực đơn từ Google Gemini AI
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Recipe Suggestions */}
        <Card>
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Gợi ý món ăn từ nguyên liệu
          </h2>

          <div className="space-y-4">
            <div className="flex space-x-2">
              <Input
                type="text"
                placeholder="Thêm nguyên liệu..."
                value={newIngredient}
                onChange={(e) => setNewIngredient(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addIngredient()}
              />
              <Button variant="primary" onClick={addIngredient}>
                <Plus className="w-5 h-5" />
              </Button>
            </div>

            {ingredients.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {ingredients.map((ingredient, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full"
                  >
                    <span>{ingredient}</span>
                    <button
                      onClick={() => removeIngredient(index)}
                      className="hover:text-blue-900"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <Input
              type="text"
              placeholder="Sở thích (không bắt buộc)..."
              value={preferences}
              onChange={(e) => setPreferences(e.target.value)}
            />

            <Button
              variant="primary"
              className="w-full"
              onClick={generateSuggestions}
              disabled={loading || ingredients.length === 0}
            >
              {loading ? 'Đang tạo gợi ý...' : 'Tạo gợi ý món ăn'}
            </Button>
          </div>

          {suggestions && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">
                {suggestions}
              </pre>
            </div>
          )}
        </Card>

        {/* Meal Plan Generator */}
        <Card>
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Tạo thực đơn tự động
          </h2>

          <div className="space-y-4">
            <Input
              type="number"
              label="Số ngày"
              min="1"
              max="14"
              value={numberOfDays}
              onChange={(e) => setNumberOfDays(parseInt(e.target.value))}
            />

            <Input
              type="number"
              label="Số người"
              min="1"
              max="20"
              value={peopleCount}
              onChange={(e) => setPeopleCount(parseInt(e.target.value))}
            />

            <Input
              type="text"
              label="Yêu cầu đặc biệt"
              placeholder="VD: ăn chay, ít dầu mỡ..."
              value={preferences}
              onChange={(e) => setPreferences(e.target.value)}
            />

            <Button
              variant="primary"
              className="w-full"
              onClick={generateMealPlan}
              disabled={loadingMealPlan}
            >
              {loadingMealPlan ? 'Đang tạo thực đơn...' : 'Tạo thực đơn'}
            </Button>
          </div>

          {mealPlan && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">
                {mealPlan}
              </pre>
            </div>
          )}
        </Card>
      </div>

      <Card>
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Hướng dẫn sử dụng
        </h2>
        <div className="space-y-3 text-gray-600">
          <div className="flex items-start space-x-3">
            <span className="flex-shrink-0 w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
              1
            </span>
            <p>
              <strong>Gợi ý món ăn:</strong> Thêm các nguyên liệu bạn có sẵn và
              nhận gợi ý món ăn phù hợp
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <span className="flex-shrink-0 w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
              2
            </span>
            <p>
              <strong>Tạo thực đơn:</strong> Chọn số ngày và số người để AI tự
              động lập thực đơn cân bằng dinh dưỡng
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <span className="flex-shrink-0 w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
              3
            </span>
            <p>
              <strong>Lưu ý:</strong> Để sử dụng tính năng này, bạn cần cấu hình
              GOOGLE_GEMINI_API_KEY trong file .env.local
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
