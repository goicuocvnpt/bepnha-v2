'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/authStore';
import { shoppingService } from '@/lib/firebase/shopping';
import { ShoppingList, ShoppingItem } from '@/lib/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Plus, Trash2, Check } from 'lucide-react';

export default function ShoppingPage() {
  const { user, loading: authLoading } = useAuthStore();
  const router = useRouter();
  const [shoppingLists, setShoppingLists] = useState<ShoppingList[]>([]);
  const [loading, setLoading] = useState(true);
  const [newListTitle, setNewListTitle] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const loadShoppingLists = async () => {
      if (user) {
        try {
          const data = await shoppingService.getUserShoppingLists(user.id);
          setShoppingLists(data);
        } catch (error) {
          console.error('Error loading shopping lists:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadShoppingLists();
  }, [user]);

  const createNewList = async () => {
    if (!user || !newListTitle.trim()) return;

    try {
      const listId = await shoppingService.createShoppingList({
        userId: user.id,
        title: newListTitle,
        items: [],
      });

      const newList: ShoppingList = {
        id: listId,
        userId: user.id,
        title: newListTitle,
        items: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      setShoppingLists([newList, ...shoppingLists]);
      setNewListTitle('');
    } catch (error) {
      console.error('Error creating shopping list:', error);
    }
  };

  const toggleItemChecked = async (listId: string, itemId: string, isChecked: boolean) => {
    try {
      await shoppingService.toggleItemChecked(listId, itemId, isChecked);
      setShoppingLists(
        shoppingLists.map((list) =>
          list.id === listId
            ? {
                ...list,
                items: list.items.map((item) =>
                  item.id === itemId ? { ...item, isChecked } : item
                ),
              }
            : list
        )
      );
    } catch (error) {
      console.error('Error toggling item:', error);
    }
  };

  const deleteList = async (listId: string) => {
    try {
      await shoppingService.deleteShoppingList(listId);
      setShoppingLists(shoppingLists.filter((list) => list.id !== listId));
    } catch (error) {
      console.error('Error deleting list:', error);
    }
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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Danh sách mua sắm</h1>
          <p className="mt-2 text-gray-600">
            Quản lý danh sách nguyên liệu cần mua
          </p>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex space-x-2">
          <Input
            type="text"
            placeholder="Tên danh sách mới..."
            value={newListTitle}
            onChange={(e) => setNewListTitle(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && createNewList()}
          />
          <Button
            variant="primary"
            onClick={createNewList}
            disabled={!newListTitle.trim()}
          >
            <Plus className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {shoppingLists.length === 0 ? (
        <Card className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Plus className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Chưa có danh sách nào
          </h3>
          <p className="text-gray-600">
            Tạo danh sách mua sắm đầu tiên của bạn
          </p>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shoppingLists.map((list) => (
            <Card key={list.id} className="h-full">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  {list.title}
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => deleteList(list.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              {list.items.length === 0 ? (
                <p className="text-gray-500 text-sm">Danh sách trống</p>
              ) : (
                <div className="space-y-2">
                  {list.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded"
                    >
                      <button
                        onClick={() =>
                          toggleItemChecked(list.id, item.id, !item.isChecked)
                        }
                        className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center ${
                          item.isChecked
                            ? 'bg-blue-600 border-blue-600'
                            : 'border-gray-300'
                        }`}
                      >
                        {item.isChecked && <Check className="w-4 h-4 text-white" />}
                      </button>
                      <span
                        className={`flex-1 text-sm ${
                          item.isChecked
                            ? 'line-through text-gray-400'
                            : 'text-gray-700'
                        }`}
                      >
                        {item.name} - {item.amount} {item.unit}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  {list.items.filter((i) => i.isChecked).length} /{' '}
                  {list.items.length} hoàn thành
                </p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
