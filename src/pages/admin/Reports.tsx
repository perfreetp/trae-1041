import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, TrendingUp, DollarSign, ShoppingCart, Users,
  Calendar, BarChart3, PieChart as PieChartIcon, Activity
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend 
} from 'recharts';
import { useAppStore } from '@/store';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const COLORS = ['#1E88E5', '#FF9800', '#10B981', '#8B5CF6', '#EF4444'];

const days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
const hours = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];

export default function Reports() {
  const navigate = useNavigate();
  const { reportOverview, revenueData, projectRevenue, heatmapData } = useAppStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'heatmap' | 'revenue'>('overview');

  const getHeatmapColor = (value: number) => {
    if (value === 0) return 'bg-gray-100';
    if (value < 5) return 'bg-green-100';
    if (value < 10) return 'bg-green-300';
    if (value < 15) return 'bg-yellow-300';
    if (value < 20) return 'bg-orange-400';
    return 'bg-red-500';
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
            <h1 className="text-2xl font-bold text-gray-800">经营报表</h1>
            <p className="text-gray-500">查看平台运营数据和分析报表</p>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-gray-400" />
            <span className="text-sm text-gray-600">近30天数据</span>
          </div>
        </div>

        {/* Tab 切换 */}
        <div className="bg-white rounded-xl shadow-sm mb-6">
          <div className="flex p-2">
            {[
              { id: 'overview', label: '经营概览', icon: <BarChart3 className="w-4 h-4" /> },
              { id: 'heatmap', label: '客流热力', icon: <Activity className="w-4 h-4" /> },
              { id: 'revenue', label: '收入分析', icon: <PieChartIcon className="w-4 h-4" /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary-500 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 经营概览 */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* 统计卡片 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                    <ShoppingCart className="w-6 h-6 text-primary-600" />
                  </div>
                  <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">+12.5%</span>
                </div>
                <p className="text-gray-500 text-sm mb-1">总订单数</p>
                <p className="text-3xl font-bold text-gray-800">{reportOverview.totalOrders.toLocaleString()}</p>
                <p className="text-xs text-gray-400 mt-2">今日新增 {reportOverview.todayOrders} 单</p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                  <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">+8.2%</span>
                </div>
                <p className="text-gray-500 text-sm mb-1">总收入</p>
                <p className="text-3xl font-bold text-gray-800">¥{(reportOverview.totalRevenue / 10000).toFixed(1)}万</p>
                <p className="text-xs text-gray-400 mt-2">今日收入 ¥{reportOverview.todayRevenue.toLocaleString()}</p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-accent-600" />
                  </div>
                  <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">+15.3%</span>
                </div>
                <p className="text-gray-500 text-sm mb-1">服务乘客</p>
                <p className="text-3xl font-bold text-gray-800">{reportOverview.totalPassengers.toLocaleString()}</p>
                <p className="text-xs text-gray-400 mt-2">累计服务人次</p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-yellow-600" />
                  </div>
                  <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">+0.2</span>
                </div>
                <p className="text-gray-500 text-sm mb-1">平均评分</p>
                <p className="text-3xl font-bold text-gray-800">{reportOverview.avgRating}</p>
                <p className="text-xs text-gray-400 mt-2">用户满意度评分</p>
              </div>
            </div>

            {/* 收入趋势图 */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-6">收入趋势</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#9CA3AF" />
                    <YAxis tick={{ fontSize: 12 }} stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#fff', 
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                      formatter={(value: number) => [`¥${value.toLocaleString()}`, '收入']}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#1E88E5" 
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 6, fill: '#1E88E5' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* 订单量柱状图 */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-6">每日订单量</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueData.slice(-14)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#9CA3AF" />
                    <YAxis tick={{ fontSize: 12 }} stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#fff', 
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="orders" fill="#FF9800" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* 客流热力 */}
        {activeTab === 'heatmap' && (
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">时段客流热力图</h3>
            <div className="overflow-x-auto">
              <div className="min-w-[800px]">
                {/* 时间轴 */}
                <div className="flex mb-2">
                  <div className="w-16 flex-shrink-0" />
                  {hours.map((hour) => (
                    <div key={hour} className="flex-1 text-center text-xs text-gray-500">
                      {hour}:00
                    </div>
                  ))}
                </div>
                
                {/* 热力图格子 */}
                {days.map((day) => (
                  <div key={day} className="flex items-center mb-1">
                    <div className="w-16 flex-shrink-0 text-sm text-gray-600">{day}</div>
                    {hours.map((hour) => {
                      const data = heatmapData.find(d => d.day === day && d.hour === hour);
                      return (
                        <div
                          key={`${day}-${hour}`}
                          className={`flex-1 h-10 m-0.5 rounded ${getHeatmapColor(data?.value || 0)} transition-colors hover:ring-2 hover:ring-primary-300`}
                          title={`${day} ${hour}:00 - ${data?.value || 0}人`}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            {/* 图例 */}
            <div className="flex items-center justify-center space-x-6 mt-8">
              <span className="text-sm text-gray-500">客流密度：</span>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-4 bg-gray-100 rounded" />
                <span className="text-xs text-gray-500">0人</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-4 bg-green-300 rounded" />
                <span className="text-xs text-gray-500">5-10人</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-4 bg-yellow-300 rounded" />
                <span className="text-xs text-gray-500">10-15人</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-4 bg-orange-400 rounded" />
                <span className="text-xs text-gray-500">15-20人</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-4 bg-red-500 rounded" />
                <span className="text-xs text-gray-500">20+人</span>
              </div>
            </div>
          </div>
        )}

        {/* 收入分析 */}
        {activeTab === 'revenue' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 项目收入饼图 */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-6">项目收入占比</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={projectRevenue}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {projectRevenue.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number) => [`¥${(value / 10000).toFixed(1)}万`, '收入']}
                      contentStyle={{ 
                        backgroundColor: '#fff', 
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap justify-center gap-4 mt-4">
                {projectRevenue.map((item, idx) => (
                  <div key={item.name} className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx] }} />
                    <span className="text-sm text-gray-600">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 项目收入排行 */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-6">项目收入排行</h3>
              <div className="space-y-4">
                {projectRevenue
                  .sort((a, b) => b.value - a.value)
                  .map((item, idx) => {
                    const maxValue = Math.max(...projectRevenue.map(p => p.value));
                    const percentage = (item.value / maxValue) * 100;
                    return (
                      <div key={item.name}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                              idx === 0 ? 'bg-yellow-100 text-yellow-700' :
                              idx === 1 ? 'bg-gray-100 text-gray-700' :
                              idx === 2 ? 'bg-orange-100 text-orange-700' :
                              'bg-gray-50 text-gray-500'
                            }`}>
                              {idx + 1}
                            </span>
                            <span className="text-sm font-medium text-gray-700">{item.name}</span>
                          </div>
                          <span className="text-sm font-semibold text-gray-800">
                            ¥{(item.value / 10000).toFixed(1)}万
                          </span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full rounded-full transition-all duration-1000"
                            style={{ 
                              width: `${percentage}%`,
                              backgroundColor: COLORS[idx % COLORS.length]
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
