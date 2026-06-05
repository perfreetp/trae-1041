import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, Plus, Pin, AlertTriangle, Info, 
  Megaphone, Trash2, Edit, Calendar, X
} from 'lucide-react';
import { useAppStore } from '@/store';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import type { AnnouncementType } from '../../../shared/types';

const typeConfig: Record<AnnouncementType, { label: string; icon: React.ReactNode; color: string }> = {
  weather: { label: '天气预警', icon: <AlertTriangle className="w-4 h-4" />, color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  notice: { label: '普通通知', icon: <Info className="w-4 h-4" />, color: 'bg-blue-100 text-blue-700 border-blue-200' },
  emergency: { label: '紧急公告', icon: <Megaphone className="w-4 h-4" />, color: 'bg-red-100 text-red-700 border-red-200' },
};

export default function Announcements() {
  const navigate = useNavigate();
  const { announcements, addAnnouncement } = useAppStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    content: '',
    type: 'notice' as AnnouncementType,
    isTop: false,
  });

  const handleSubmit = () => {
    if (!newAnnouncement.title || !newAnnouncement.content) {
      alert('请填写完整信息');
      return;
    }
    addAnnouncement(newAnnouncement);
    setShowAddModal(false);
    setNewAnnouncement({ title: '', content: '', type: 'notice', isTop: false });
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
            <h1 className="text-2xl font-bold text-gray-800">公告管理</h1>
            <p className="text-gray-500">管理平台公告和天气预警信息</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>发布公告</span>
          </button>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">全部公告</p>
                <p className="text-2xl font-bold text-gray-800">{announcements.length}</p>
              </div>
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <Megaphone className="w-6 h-6 text-primary-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">置顶公告</p>
                <p className="text-2xl font-bold text-gray-800">
                  {announcements.filter(a => a.isTop).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center">
                <Pin className="w-6 h-6 text-accent-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">天气预警</p>
                <p className="text-2xl font-bold text-gray-800">
                  {announcements.filter(a => a.type === 'weather').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* 公告列表 */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-800">公告列表</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {announcements.map((announcement) => (
              <div key={announcement.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      {announcement.isTop && (
                        <span className="px-2 py-0.5 bg-accent-100 text-accent-700 rounded text-xs font-medium flex items-center space-x-1">
                          <Pin className="w-3 h-3" />
                          <span>置顶</span>
                        </span>
                      )}
                      <span className={`px-2 py-0.5 rounded text-xs font-medium flex items-center space-x-1 border ${typeConfig[announcement.type].color}`}>
                        {typeConfig[announcement.type].icon}
                        <span>{typeConfig[announcement.type].label}</span>
                      </span>
                      <h3 className="font-medium text-gray-800">{announcement.title}</h3>
                    </div>
                    <p className="text-sm text-gray-500 mb-2 line-clamp-2">{announcement.content}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-400">
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(announcement.createTime).toLocaleString()}</span>
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <button className="p-2 text-gray-400 hover:text-primary-600 transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 发布公告弹窗 */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full mx-4 animate-slide-up">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-800">发布新公告</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">公告类型</label>
                <div className="flex space-x-2">
                  {(Object.keys(typeConfig) as AnnouncementType[]).map((type) => (
                    <button
                      key={type}
                      onClick={() => setNewAnnouncement({ ...newAnnouncement, type })}
                      className={`flex-1 flex items-center justify-center space-x-1 px-3 py-2 rounded-lg border text-sm transition-colors ${
                        newAnnouncement.type === type
                          ? `${typeConfig[type].color} border-current`
                          : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {typeConfig[type].icon}
                      <span>{typeConfig[type].label}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">公告标题</label>
                <input
                  type="text"
                  value={newAnnouncement.title}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                  placeholder="请输入公告标题"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">公告内容</label>
                <textarea
                  value={newAnnouncement.content}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                  placeholder="请输入公告内容"
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                />
              </div>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newAnnouncement.isTop}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, isTop: e.target.checked })}
                />
                <span className="text-sm text-gray-600">设为置顶公告</span>
              </label>
            </div>
            <div className="p-6 border-t border-gray-100 flex space-x-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
              >
                发布
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
