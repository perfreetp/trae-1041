import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, MessageSquare, Clock, CheckCircle, XCircle, 
  AlertCircle, Send, X
} from 'lucide-react';
import { useAppStore } from '@/store';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import type { ComplaintStatus } from '../../../../shared/types';

const statusConfig: Record<ComplaintStatus, { label: string; color: string; icon: React.ReactNode }> = {
  pending: { label: '待处理', color: 'bg-yellow-100 text-yellow-700', icon: <Clock className="w-4 h-4" /> },
  processing: { label: '处理中', color: 'bg-blue-100 text-blue-700', icon: <MessageSquare className="w-4 h-4" /> },
  resolved: { label: '已解决', color: 'bg-green-100 text-green-700', icon: <CheckCircle className="w-4 h-4" /> },
  rejected: { label: '已驳回', color: 'bg-red-100 text-red-700', icon: <XCircle className="w-4 h-4" /> },
};

export default function Complaints() {
  const navigate = useNavigate();
  const { complaints, handleComplaint } = useAppStore();
  const [filterStatus, setFilterStatus] = useState<ComplaintStatus | 'all'>('all');
  const [showHandleModal, setShowHandleModal] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<string | null>(null);
  const [handleOpinion, setHandleOpinion] = useState('');
  const [handleStatus, setHandleStatus] = useState<ComplaintStatus>('resolved');

  const filteredComplaints = filterStatus === 'all' 
    ? complaints 
    : complaints.filter(c => c.status === filterStatus);

  const openHandleModal = (complaintId: string) => {
    setSelectedComplaint(complaintId);
    setHandleOpinion('');
    setHandleStatus('resolved');
    setShowHandleModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedComplaint) {
      handleComplaint(selectedComplaint, handleOpinion, handleStatus);
      setShowHandleModal(false);
      setSelectedComplaint(null);
    }
  };

  const stats = {
    total: complaints.length,
    pending: complaints.filter(c => c.status === 'pending').length,
    processing: complaints.filter(c => c.status === 'processing').length,
    resolved: complaints.filter(c => c.status === 'resolved').length,
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
            <h1 className="text-2xl font-bold text-gray-800">投诉处理</h1>
            <p className="text-gray-500">处理游客投诉，提升服务质量</p>
          </div>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">全部投诉</p>
                <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-gray-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">待处理</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">处理中</p>
                <p className="text-2xl font-bold text-blue-600">{stats.processing}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">已解决</p>
                <p className="text-2xl font-bold text-green-600">{stats.resolved}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* 筛选 */}
        <div className="bg-white rounded-xl shadow-sm mb-6">
          <div className="p-4 border-b border-gray-100 flex items-center space-x-4">
            <span className="text-sm text-gray-500">状态筛选：</span>
            <div className="flex items-center space-x-2">
              {(['all', 'pending', 'processing', 'resolved', 'rejected'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-4 py-1.5 rounded-full text-sm transition-colors ${
                    filterStatus === status
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {status === 'all' ? '全部' : statusConfig[status].label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 投诉列表 */}
        <div className="space-y-4">
          {filteredComplaints.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">暂无投诉记录</p>
            </div>
          ) : (
            filteredComplaints.map((complaint) => {
              const statusInfo = statusConfig[complaint.status];
              return (
                <div key={complaint.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                          <MessageSquare className="w-5 h-5 text-gray-500" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-800">{complaint.userName}</div>
                          <div className="text-sm text-gray-500">
                            订单号：{complaint.orderId} · 
                            {new Date(complaint.createTime).toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs ${statusInfo.color}`}>
                          {statusInfo.icon}
                          <span>{statusInfo.label}</span>
                        </span>
                        <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                          {complaint.type}
                        </span>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <p className="text-gray-700">{complaint.content}</p>
                    </div>

                    {complaint.handleOpinion && (
                      <div className="border-l-4 border-primary-500 bg-primary-50 rounded-r-lg p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-sm font-medium text-primary-700">处理意见</span>
                          <span className="text-xs text-gray-500">
                            {complaint.handleTime && new Date(complaint.handleTime).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-gray-700 text-sm">{complaint.handleOpinion}</p>
                      </div>
                    )}

                    {(complaint.status === 'pending' || complaint.status === 'processing') && (
                      <div className="flex justify-end mt-4">
                        <button
                          onClick={() => openHandleModal(complaint.id)}
                          className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-sm"
                        >
                          处理投诉
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* 处理投诉弹窗 */}
      {showHandleModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">处理投诉</h2>
              <button
                onClick={() => setShowHandleModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">处理结果</label>
                <select
                  value={handleStatus}
                  onChange={(e) => setHandleStatus(e.target.value as ComplaintStatus)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="processing">标记为处理中</option>
                  <option value="resolved">已解决</option>
                  <option value="rejected">已驳回</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">处理意见</label>
                <textarea
                  required
                  rows={4}
                  value={handleOpinion}
                  onChange={(e) => setHandleOpinion(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                  placeholder="请输入处理意见..."
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowHandleModal(false)}
                  className="px-6 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="flex items-center space-x-2 px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                >
                  <Send className="w-4 h-4" />
                  <span>提交处理</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
