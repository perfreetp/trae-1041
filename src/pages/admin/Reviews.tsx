import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, Star, User, Calendar, MessageSquare, 
  AlertCircle, Check, ThumbsUp, Filter
} from 'lucide-react';
import { useAppStore } from '@/store';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function Reviews() {
  const navigate = useNavigate();
  const { reviews, reportOverview } = useAppStore();
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [onlyPending, setOnlyPending] = useState(false);

  const filteredReviews = reviews.filter(review => {
    if (filterRating !== null && review.rating !== filterRating) return false;
    if (onlyPending && review.reply) return false;
    return true;
  });

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center space-x-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center text-gray-600 hover:text-primary-600 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>返回首页</span>
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">评价中心</h1>
            <p className="text-gray-500">查看和管理用户评价与投诉</p>
          </div>
        </div>

        {/* 统计概览 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">总评价数</p>
                <p className="text-2xl font-bold text-gray-800">{reviews.length}</p>
              </div>
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-primary-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">平均评分</p>
                <p className="text-2xl font-bold text-gray-800">{reportOverview.avgRating}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-yellow-600 fill-yellow-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">待回复</p>
                <p className="text-2xl font-bold text-gray-800">
                  {reviews.filter(r => !r.reply).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-accent-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">好评率</p>
                <p className="text-2xl font-bold text-green-600">
                  {Math.round(reviews.filter(r => r.rating >= 4).length / reviews.length * 100)}%
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <ThumbsUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* 评分分布 */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="font-semibold text-gray-800 mb-4">评分分布</h2>
          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = reviews.filter(r => r.rating === rating).length;
              const percentage = (count / reviews.length) * 100;
              return (
                <div key={rating} className="flex items-center space-x-4">
                  <div className="w-20 flex items-center space-x-1">
                    <span className="text-sm text-gray-600">{rating}星</span>
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  </div>
                  <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-yellow-400 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="w-12 text-right text-sm text-gray-500">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 筛选和列表 */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-800">评价列表</h2>
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={onlyPending}
                  onChange={(e) => setOnlyPending(e.target.checked)}
                />
                <span className="text-sm text-gray-600">只看待回复</span>
              </label>
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <select
                  value={filterRating ?? ''}
                  onChange={(e) => setFilterRating(e.target.value ? Number(e.target.value) : null)}
                  className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">全部评分</option>
                  <option value="5">5星</option>
                  <option value="4">4星</option>
                  <option value="3">3星</option>
                  <option value="2">2星</option>
                  <option value="1">1星</option>
                </select>
              </div>
            </div>
          </div>

          <div className="divide-y divide-gray-50">
            {filteredReviews.length === 0 ? (
              <div className="py-12 text-center text-gray-500">
                暂无符合条件的评价
              </div>
            ) : (
              filteredReviews.map((review) => (
                <div key={review.id} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-primary-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-800">{review.userName}</div>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <span>{review.projectName}</span>
                          <span>·</span>
                          <span className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(review.createTime).toLocaleDateString()}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                    {renderStars(review.rating)}
                  </div>

                  <p className="text-gray-600 mb-4">{review.content}</p>

                  {/* 商家回复 */}
                  {review.reply ? (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-sm font-medium text-primary-600">商家回复</span>
                        <span className="text-xs text-gray-400">
                          {review.replyTime && new Date(review.replyTime).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{review.reply}</p>
                    </div>
                  ) : (
                    <div className="flex items-center justify-end">
                      <button className="px-4 py-2 bg-primary-50 text-primary-600 rounded-lg text-sm hover:bg-primary-100 transition-colors">
                        回复评价
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
