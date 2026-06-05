import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, Calendar, Clock, Users, QrCode, RefreshCw, 
  XCircle, Clock as ClockIcon, Star, Ticket
} from 'lucide-react';
import { useAppStore } from '@/store';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import type { Order, OrderStatus } from '../../shared/types';

const statusTabs: { id: OrderStatus | 'all'; label: string }[] = [
  { id: 'all', label: '全部' },
  { id: 'pending', label: '待支付' },
  { id: 'paid', label: '待出行' },
  { id: 'completed', label: '已完成' },
  { id: 'cancelled', label: '已取消' },
];

const statusLabels: Record<OrderStatus, { text: string; color: string }> = {
  pending: { text: '待支付', color: 'bg-yellow-100 text-yellow-700' },
  paid: { text: '待出行', color: 'bg-blue-100 text-blue-700' },
  waiting: { text: '等待中', color: 'bg-purple-100 text-purple-700' },
  boarding: { text: '登机中', color: 'bg-green-100 text-green-700' },
  completed: { text: '已完成', color: 'bg-gray-100 text-gray-700' },
  cancelled: { text: '已取消', color: 'bg-red-100 text-red-700' },
  refunded: { text: '已退款', color: 'bg-orange-100 text-orange-700' },
};

const typeLabels: Record<string, string> = {
  helicopter: '直升机',
  balloon: '热气球',
  drone: '无人机',
};

export default function Orders() {
  const navigate = useNavigate();
  const { orders, cancelOrder } = useAppStore();
  const [activeTab, setActiveTab] = useState<OrderStatus | 'all'>('all');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = orders.filter(order => 
    activeTab === 'all' || order.status === activeTab
  );

  const handleCancel = (order: Order) => {
    setSelectedOrder(order);
    setShowCancelModal(true);
  };

  const confirmCancel = () => {
    if (selectedOrder) {
      cancelOrder(selectedOrder.id);
      setShowCancelModal(false);
      setSelectedOrder(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* 返回按钮 */}
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
        <h1 className="text-2xl font-bold text-gray-800 mb-6">我的订单</h1>

        {/* Tab 筛选 */}
        <div className="bg-white rounded-xl shadow-sm mb-6">
          <div className="flex space-x-1 p-2 overflow-x-auto">
            {statusTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary-500 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab.label}
                <span className="ml-1 text-xs opacity-75">
                  ({tab.id === 'all' 
                    ? orders.length 
                    : orders.filter(o => o.status === tab.id).length
                  })
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* 订单列表 */}
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm py-16 text-center">
              <Ticket className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">暂无订单</p>
              <button
                onClick={() => navigate('/')}
                className="mt-4 px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
              >
                去预订
              </button>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                {/* 订单头部 */}
                <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-500">订单号：{order.orderNo}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusLabels[order.status].color}`}>
                      {statusLabels[order.status].text}
                    </span>
                    <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                      {typeLabels[order.projectType]}
                    </span>
                  </div>
                  <span className="text-sm text-gray-400">
                    {new Date(order.createTime).toLocaleDateString()}
                  </span>
                </div>

                {/* 订单内容 */}
                <div className="px-6 py-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">{order.projectName}</h3>
                      <div className="space-y-1 text-sm text-gray-500">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4" />
                          <span>{order.slotDate}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4" />
                          <span>{order.slotTime}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4" />
                          <span>{order.passengers.length}位乘客</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-accent-500">¥{order.totalAmount}</div>
                      {order.refundAmount && (
                        <div className="text-sm text-gray-400">已退款 ¥{order.refundAmount}</div>
                      )}
                    </div>
                  </div>
                </div>

                {/* 操作按钮 */}
                <div className="px-6 py-4 bg-gray-50 flex items-center justify-end space-x-3">
                  {order.status === 'pending' && (
                    <>
                      <button 
                        onClick={() => handleCancel(order)}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                      >
                        取消订单
                      </button>
                      <button className="px-6 py-2 bg-accent-500 text-white rounded-lg hover:bg-accent-600 transition-colors">
                        立即支付
                      </button>
                    </>
                  )}
                  {order.status === 'paid' && (
                    <>
                      <button className="flex items-center space-x-1 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors">
                        <RefreshCw className="w-4 h-4" />
                        <span>改签</span>
                      </button>
                      <button 
                        onClick={() => handleCancel(order)}
                        className="flex items-center space-x-1 px-4 py-2 text-red-500 hover:text-red-600 transition-colors"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>退票</span>
                      </button>
                      <button className="flex items-center space-x-1 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors">
                        <QrCode className="w-4 h-4" />
                        <span>查看票券</span>
                      </button>
                    </>
                  )}
                  {order.status === 'completed' && (
                    <>
                      <button 
                        onClick={() => navigate(`/project/${order.projectId}`)}
                        className="px-4 py-2 text-primary-600 hover:text-primary-700 transition-colors"
                      >
                        再次预订
                      </button>
                      <button className="flex items-center space-x-1 px-4 py-2 bg-accent-500 text-white rounded-lg hover:bg-accent-600 transition-colors">
                        <Star className="w-4 h-4" />
                        <span>发表评价</span>
                      </button>
                    </>
                  )}
                  {order.status === 'cancelled' && (
                    <button 
                      onClick={() => navigate(`/project/${order.projectId}`)}
                      className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                    >
                      重新预订
                    </button>
                  )}
                </div>

                {/* 候补提示 */}
                {order.status === 'paid' && order.queueNumber && (
                  <div className="px-6 py-3 bg-purple-50 border-t border-purple-100">
                    <div className="flex items-center space-x-2 text-purple-700">
                      <ClockIcon className="w-4 h-4" />
                      <span className="text-sm">
                        您的排队号：<span className="font-bold">{order.queueNumber}</span> 号，
                        请留意现场叫号通知
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* 取消确认弹窗 */}
      {showCancelModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 animate-slide-up">
            <h3 className="text-xl font-bold text-gray-800 mb-2">确认取消订单</h3>
            <p className="text-gray-500 mb-4">
              您确定要取消订单 {selectedOrder.orderNo} 吗？
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6">
              <p className="text-sm text-yellow-700">
                退票说明：起飞前24小时可全额退款，24小时内收取10%手续费
              </p>
              <p className="text-sm text-yellow-700 mt-1">
                预计退款金额：<span className="font-bold">¥{Math.floor(selectedOrder.totalAmount * 0.9)}</span>
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 py-3 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
              >
                再想想
              </button>
              <button
                onClick={confirmCancel}
                className="flex-1 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                确认取消
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
