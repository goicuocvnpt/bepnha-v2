'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/authStore';
import { Card } from '@/components/ui/Card';
import { BookOpen, Calendar, ShoppingCart, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const { user, loading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const features = [
    {
      icon: BookOpen,
      title: 'Công thức nấu ăn',
      description: 'Quản lý và lưu trữ các công thức yêu thích của gia đình',
      href: '/recipes',
      color: 'bg-blue-100 text-blue-600',
    },
    {
      icon: Calendar,
      title: 'Lên thực đơn',
      description: 'Lập kế hoạch bữa ăn cho từng ngày trong tuần',
      href: '/menu',
      color: 'bg-green-100 text-green-600',
    },
    {
      icon: ShoppingCart,
      title: 'Danh sách mua sắm',
      description: 'Tự động tạo danh sách nguyên liệu cần mua',
      href: '/shopping',
      color: 'bg-purple-100 text-purple-600',
    },
    {
      icon: Sparkles,
      title: 'Gợi ý AI',
      description: 'Nhận gợi ý món ăn từ Google Gemini AI',
      href: '/ai-suggestions',
      color: 'bg-yellow-100 text-yellow-600',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Chào mừng đến với Bếp Nhà! 👋
        </h1>
        <p className="text-xl text-gray-600">
          Quản lý thực đơn gia đình một cách thông minh và dễ dàng
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-12">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <Link key={feature.href} href={feature.href}>
              <Card className="h-full hover:shadow-xl transition-shadow">
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-lg ${feature.color}`}>
                    <Icon className="w-8 h-8" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>

      <Card>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Bắt đầu nhanh
        </h2>
        <div className="space-y-3 text-gray-600">
          <div className="flex items-start space-x-3">
            <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
              1
            </span>
            <p>Thêm công thức nấu ăn yêu thích của gia đình bạn</p>
          </div>
          <div className="flex items-start space-x-3">
            <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
              2
            </span>
            <p>Lên kế hoạch thực đơn cho tuần</p>
          </div>
          <div className="flex items-start space-x-3">
            <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
              3
            </span>
            <p>Tự động tạo danh sách mua sắm từ thực đơn</p>
          </div>
          <div className="flex items-start space-x-3">
            <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
              4
            </span>
            <p>Sử dụng AI để nhận gợi ý món ăn mới</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
