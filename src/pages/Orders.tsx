import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, Calendar, Clock, Users, QrCode, RefreshCw, 
  XCircle, Clock as ClockIcon, Star, Ticket, CreditCard,
  AlertTriangle, MessageSquare, X, Check, ChevronRight,
  ListPlus
} from 'lucide-react';
import { useAppStore } from '@/store';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import type { Order, OrderStatus, TimeSlot } from '../../shared/types';

const statusTabs: { id: OrderStatus | 'all'; label: string }[] = [
  { id: 'all', label: '全部' },
  { id: 'pending', label: '待支付' },
  { id: 'paid', label: '待出行' },
  { id: 'flightCancelled', label: '停飞待处理' },
  { id: 'waitlisted', label: '候补中' },
  { id: 'completed', label: '已完成' },
  { id: 'refunded', label: '已退款' },
];

const statusLabels: Record<OrderStatus, { text: string; color: string }> = {
  pending: { text: '待支付', color: 'bg-yellow-100 text-yellow-700' },
  paid: { text: '待出行', color: 'bg-blue-100 text-blue-700' },
  waiting: { text: '等待中', color: 'bg-purple-100 text-purple-700' },
  boarding: { text: '登机中', color: 'bg-green-100 text-green-700' },
  completed: { text: '已完成', color: 'bg-gray-100 text-gray-700' },
  cancelled: { text: '已取消', color: 'bg-red-100 text-red-700' },
  refunded: { text: '已退款', color: 'bg-orange-100 text-orange-700' },
  flightCancelled: { text: '停飞待处理', color: 'bg-red-100 text-red-700' },
  waitlisted: { text: '候补中', color: 'bg-purple-100 text-purple-700' },
};

const typeLabels: Record<string, string> = {
  helicopter: '直升机',
  balloon: '热气球',
  drone: '无人机',
};

export default function Orders() {
  const navigate = useNavigate();
  const { 
    orders, timeSlots, cancelOrder, payOrder, rescheduleOrder, 
    addToWaitlist, waitlistItems, addComplaint, paymentRecords, refundRecords
  } = useAppStore();
  
  const [activeTab, setActiveTab] = useState<OrderStatus | 'all'>('all');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showPayModal, setShowPayModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [showComplaintModal, setShowComplaintModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [cancelReason, setCancelReason] = useState('');
  const [complaintType, setComplaintType] = useState('服务问题');
  const [complaintContent, setComplaintContent] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('微信支付');

  const filteredOrders = orders.filter(order => 
    activeTab === 'all' || order.status === activeTab
  );

  const getOrderWaitlistPosition = (orderId: string) => {
    const item = waitlistItems.find(w => w.orderId === orderId && w.status === 'waiting');
    return item?.position;
  };

  const getOrderPaymentRecords = (orderId: string) => {
    return paymentRecords.filter(p => p.orderId === orderId);
  };

  const getOrderRefundRecords = (orderId: string) => {
    return refundRecords.filter(r => r.orderId === orderId);
  };

  const getAvailableSlotsForReschedule = (order: Order) => {
    return timeSlots.filter(s => 
      s.projectId === order.projectId && 
      s.availableStock > 0 && 
      s.id !== order.slotId &&
      new Date(s.date) >= new Date()
    );
  };

  const handlePay = (order: Order) => {
    setSelectedOrder(order);
    setShowPayModal(true);
  };

  const confirmPay = () => {
    if (selectedOrder) {
      const success = payOrder(selectedOrder.id, paymentMethod);
      if (success) {
        setShowPayModal(false);
        setSelectedOrder(null);
      }
    }
  };

  const handleCancel = (order: Order) => {
    setSelectedOrder(order);
    setCancelReason('');
    setShowCancelModal(true);
  };

  const confirmCancel = () => {
    if (selectedOrder) {
      const success = cancelOrder(selectedOrder.id, cancelReason || '用户个人原因');
      if (success) {
        setShowCancelModal(false);
        setSelectedOrder(null);
      }
    }
  };

  const handleReschedule = (order: Order) => {
    setSelectedOrder(order);
    setSelectedSlot('');
    setShowRescheduleModal(true);
  };

  const confirmReschedule = () => {
    if (selectedOrder && selectedSlot) {
      const success = rescheduleOrder(selectedOrder.id, selectedSlot);
      if (success) {
        setShowRescheduleModal(false);
        setSelectedOrder(null);
        setSelectedSlot('');
      }
    }
  };

  const handleWaitlist = (order: Order) => {
    addToWaitlist(order.id, order.projectId, order.slotId);
  };

  const handleComplaint = (order: Order) => {
    setSelectedOrder(order);
    setComplaintType('服务问题');
    setComplaintContent('');
    setShowComplaintModal(true);
  };

  const confirmComplaint = () => {
    if (selectedOrder) {
      addComplaint({
        orderId: selectedOrder.id,
        projectId: selectedOrder.projectId,
        userId: 'u1',
        userName: selectedOrder.passengers[0]?.name || '游客',
        type: complaintType,
        content: complaintContent,
        images: [],
      });
      setShowComplaintModal(false);
      setSelectedOrder(null);
      setComplaintContent('');
    }
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
        <h1 className="text-2xl font-bold text-gray-800 mb-6">我的订单</h1>

        <div className="bg-white rounded-xl shadow-sm mb-6">
          <div className="flex space-x-1 p-2 overflow-x-auto">
            {statusTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
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
            filteredOrders.map((order) => {
              const waitlistPos = getOrderWaitlistPosition(order.id);
              const orderPayments = getOrderPaymentRecords(order.id);
              const orderRefunds = getOrderRefundRecords(order.id);
              const availableSlots = getAvailableSlotsForReschedule(order);

              return (
                <div key={order.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
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
                          <div className="text-sm text-green-600">已退款 ¥{order.refundAmount}</div>
                        )}
                      </div>
                    </div>

                    {orderPayments.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <p className="text-sm font-medium text-gray-700 mb-2">支付记录</p>
                        {orderPayments.map(payment => (
                          <div key={payment.id} className="flex items-center justify-between text-sm text-gray-500">
                            <span>{payment.paymentMethod} - 支付成功</span>
                            <span className="text-green-600 font-medium">+¥{payment.amount}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {orderRefunds.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm font-medium text-gray-700 mb-2">退款记录</p>
                        {orderRefunds.map(refund => (
                          <div key={refund.id} className="flex items-center justify-between text-sm text-gray-500">
                            <span>{refund.reason}</span>
                            <span className="text-orange-600 font-medium">-¥{refund.amount}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {order.status === 'flightCancelled' && (
                    <div className="px-6 py-3 bg-red-50 border-t border-red-100">
                      <div className="flex items-center space-x-2 text-red-700">
                        <AlertTriangle className="w-4 h-4" />
                        <span className="text-sm">
                          因天气原因，该航班已取消。您可以选择改签或全额退款。
                        </span>
                      </div>
                    </div>
                  )}

                  {order.status === 'waitlisted' && waitlistPos && (
                    <div className="px-6 py-3 bg-purple-50 border-t border-purple-100">
                      <div className="flex items-center space-x-2 text-purple-700">
                        <ListPlus className="w-4 h-4" />
                        <span className="text-sm">
                          候补排队中，当前排在第 <span className="font-bold">{waitlistPos}</span> 位
                        </span>
                      </div>
                    </div>
                  )}

                  {order.status === 'paid' && order.queueNumber && (
                    <div className="px-6 py-3 bg-blue-50 border-t border-blue-100">
                      <div className="flex items-center space-x-2 text-blue-700">
                        <ClockIcon className="w-4 h-4" />
                        <span className="text-sm">
                          您的排队号：<span className="font-bold">{order.queueNumber}</span> 号，
                          请留意现场叫号通知
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="px-6 py-4 bg-gray-50 flex items-center justify-end space-x-3">
                    {order.status === 'pending' && (
                      <>
                        <button 
                          onClick={() => handleCancel(order)}
                          className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                        >
                          取消订单
                        </button>
                        <button 
                          onClick={() => handlePay(order)}
                          className="flex items-center space-x-1 px-6 py-2 bg-accent-500 text-white rounded-lg hover:bg-accent-600 transition-colors"
                        >
                          <CreditCard className="w-4 h-4" />
                          <span>立即支付</span>
                        </button>
                      </>
                    )}
                    
                    {(order.status === 'paid' || order.status === 'flightCancelled') && (
                      <>
                        {availableSlots.length > 0 && (
                          <button 
                            onClick={() => handleReschedule(order)}
                            className="flex items-center space-x-1 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                          >
                            <RefreshCw className="w-4 h-4" />
                            <span>改签</span>
                          </button>
                        )}
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

                    {order.status === 'waitlisted' && (
                      <button 
                        onClick={() => handleCancel(order)}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                      >
                        取消候补
                      </button>
                    )}

                    {order.status === 'completed' && (
                      <>
                        <button 
                          onClick={() => handleComplaint(order)}
                          className="flex items-center space-x-1 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                        >
                          <MessageSquare className="w-4 h-4" />
                          <span>投诉</span>
                        </button>
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

                    {(order.status === 'refunded' || order.status === 'cancelled') && (
                      <button 
                        onClick={() => navigate(`/project/${order.projectId}`)}
                        className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                      >
                        重新预订
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* 支付弹窗 */}
      {showPayModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">订单支付</h2>
              <button onClick={() => setShowPayModal(false)} className="p-2 text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="text-center mb-6">
                <p className="text-gray-500 mb-2">支付金额</p>
                <p className="text-4xl font-bold text-accent-500">¥{selectedOrder.totalAmount}</p>
              </div>
              <div className="space-y-3 mb-6">
                <p className="text-sm font-medium text-gray-700">选择支付方式</p>
                {['微信支付', '支付宝'].map((method) => (
                  <label
                    key={method}
                    className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors ${
                      paymentMethod === method 
                        ? 'border-primary-500 bg-primary-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-gray-700">{method}</span>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      paymentMethod === method ? 'border-primary-500' : 'border-gray-300'
                    }`}>
                      {paymentMethod === method && <div className="w-3 h-3 bg-primary-500 rounded-full" />}
                    </div>
                    <input
                      type="radio"
                      name="payment"
                      value={method}
                      checked={paymentMethod === method}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="hidden"
                    />
                  </label>
                ))}
              </div>
              <button
                onClick={confirmPay}
                className="w-full py-3 bg-accent-500 text-white rounded-lg hover:bg-accent-600 transition-colors font-medium"
              >
                确认支付
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 退票弹窗 */}
      {showCancelModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">申请退票</h2>
              <button onClick={() => setShowCancelModal(false)} className="p-2 text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-yellow-700 mb-1">退票说明</p>
                <p className="text-sm text-yellow-700">
                  起飞前24小时可全额退款，24小时内收取10%手续费
                </p>
                <p className="text-sm text-yellow-700 mt-1">
                  预计退款金额：<span className="font-bold">¥{Math.floor(selectedOrder.totalAmount * 0.9)}</span>
                </p>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">退票原因</label>
                <select
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">请选择原因</option>
                  <option value="个人原因">个人原因</option>
                  <option value="行程变动">行程变动</option>
                  <option value="天气原因">天气原因</option>
                  <option value="其他原因">其他原因</option>
                </select>
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
                  确认退票
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 改签弹窗 */}
      {showRescheduleModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[80vh] overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b flex items-center justify-between flex-shrink-0">
              <h2 className="text-xl font-bold text-gray-800">选择改签时段</h2>
              <button onClick={() => setShowRescheduleModal(false)} className="p-2 text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              <p className="text-sm text-gray-500 mb-4">当前时段：{selectedOrder.slotDate} {selectedOrder.slotTime}</p>
              <div className="space-y-2">
                {getAvailableSlotsForReschedule(selectedOrder).length === 0 ? (
                  <p className="text-center text-gray-500 py-8">暂无可用时段</p>
                ) : (
                  getAvailableSlotsForReschedule(selectedOrder).map((slot) => (
                    <label
                      key={slot.id}
                      className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedSlot === slot.id 
                          ? 'border-primary-500 bg-primary-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div>
                        <p className="font-medium text-gray-800">{slot.date}</p>
                        <p className="text-sm text-gray-500">{slot.startTime} - {slot.endTime}</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-accent-600 font-medium">¥{slot.price}</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${
                          slot.availableStock <= 2 ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                        }`}>
                          剩余{slot.availableStock}座
                        </span>
                      </div>
                      <input
                        type="radio"
                        name="slot"
                        value={slot.id}
                        checked={selectedSlot === slot.id}
                        onChange={(e) => setSelectedSlot(e.target.value)}
                        className="hidden"
                      />
                    </label>
                  ))
                )}
              </div>
            </div>
            <div className="p-6 border-t flex-shrink-0">
              <button
                onClick={confirmReschedule}
                disabled={!selectedSlot}
                className="w-full py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                确认改签
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 投诉弹窗 */}
      {showComplaintModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">提交投诉</h2>
              <button onClick={() => setShowComplaintModal(false)} className="p-2 text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">投诉类型</label>
                <select
                  value={complaintType}
                  onChange={(e) => setComplaintType(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="服务问题">服务问题</option>
                  <option value="飞行体验">飞行体验</option>
                  <option value="设施设备">设施设备</option>
                  <option value="价格问题">价格问题</option>
                  <option value="其他问题">其他问题</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">投诉内容</label>
                <textarea
                  rows={4}
                  value={complaintContent}
                  onChange={(e) => setComplaintContent(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                  placeholder="请详细描述您遇到的问题..."
                />
              </div>
              <div className="flex space-x-3 pt-2">
                <button
                  onClick={() => setShowComplaintModal(false)}
                  className="flex-1 py-3 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={confirmComplaint}
                  disabled={!complaintContent.trim()}
                  className="flex-1 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  提交投诉
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
