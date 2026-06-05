import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  ChevronLeft, Plus, Edit, Trash2, Save, X, Clock, Users, DollarSign, ChevronDown
} from 'lucide-react';
import { useAppStore } from '@/store';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function Slots() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const urlProjectId = searchParams.get('projectId') || '';
  
  const { projects, timeSlots, addTimeSlot, updateTimeSlot, deleteTimeSlot } = useAppStore();
  const [selectedProjectId, setSelectedProjectId] = useState(urlProjectId || '');
  const [showProjectDropdown, setShowProjectDropdown] = useState(false);
  
  const project = projects.find(p => p.id === selectedProjectId);
  
  const [showModal, setShowModal] = useState(false);
  const [editingSlot, setEditingSlot] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    date: '',
    startTime: '08:00',
    endTime: '09:00',
    price: 0,
    totalStock: 8,
    availableStock: 8,
  });

  const projectSlots = timeSlots.filter(s => s.projectId === selectedProjectId);

  const resetForm = () => {
    setFormData({
      date: '',
      startTime: '08:00',
      endTime: '09:00',
      price: project?.basePrice || 0,
      totalStock: 8,
      availableStock: 8,
    });
    setEditingSlot(null);
  };

  useEffect(() => {
    if (urlProjectId) {
      setSelectedProjectId(urlProjectId);
    } else if (projects.length > 0 && !selectedProjectId) {
      setSelectedProjectId(projects[0].id);
    }
  }, [urlProjectId, projects, selectedProjectId]);

  useEffect(() => {
    if (project) {
      setFormData(prev => ({ ...prev, price: project.basePrice }));
    }
  }, [project]);

  const handleProjectSelect = (projectId: string) => {
    setSelectedProjectId(projectId);
    setSearchParams({ projectId });
    setShowProjectDropdown(false);
  };

  const handleOpenModal = (slotId?: string) => {
    if (!selectedProjectId) {
      alert('请先选择项目');
      return;
    }
    if (slotId) {
      const slot = timeSlots.find(s => s.id === slotId);
      if (slot) {
        setFormData({
          date: slot.date,
          startTime: slot.startTime,
          endTime: slot.endTime,
          price: slot.price,
          totalStock: slot.totalStock,
          availableStock: slot.availableStock,
        });
        setEditingSlot(slotId);
      }
    } else {
      resetForm();
    }
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedProjectId) return;
    
    const slotData = {
      projectId: selectedProjectId,
      date: formData.date,
      startTime: formData.startTime,
      endTime: formData.endTime,
      price: formData.price,
      totalStock: formData.totalStock,
      availableStock: formData.availableStock,
    };

    if (editingSlot) {
      updateTimeSlot(editingSlot, slotData);
    } else {
      addTimeSlot(slotData);
    }
    
    setShowModal(false);
    resetForm();
  };

  const groupedSlots = projectSlots.reduce((acc, slot) => {
    if (!acc[slot.date]) acc[slot.date] = [];
    acc[slot.date].push(slot);
    return acc;
  }, {} as Record<string, typeof timeSlots>);

  const sortedDates = Object.keys(groupedSlots).sort();

  const getStatusBadge = (slot: typeof timeSlots[0]) => {
    if (slot.availableStock === 0) {
      return <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs">已满</span>;
    }
    if (slot.availableStock <= 2) {
      return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs">紧张</span>;
    }
    return <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">充足</span>;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <button 
            onClick={() => navigate('/admin/projects')}
            className="flex items-center text-gray-600 hover:text-primary-600 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>返回管理后台</span>
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">时段库存管理</h1>
            <p className="text-gray-500">按项目管理起飞时段、库存和票价</p>
          </div>
          <div className="flex items-center space-x-3">
            {/* 项目选择下拉 */}
            <div className="relative">
              <button
                onClick={() => setShowProjectDropdown(!showProjectDropdown)}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-200 rounded-lg bg-white hover:border-gray-300 transition-colors min-w-[200px]"
              >
                <span className="flex-1 text-left text-sm">
                  {project ? project.name : '选择项目'}
                </span>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showProjectDropdown ? 'rotate-180' : ''}`} />
              </button>
              {showProjectDropdown && (
                <div className="absolute right-0 top-full mt-1 w-full bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50 max-h-64 overflow-y-auto">
                  {projects.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => handleProjectSelect(p.id)}
                      className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors ${
                        selectedProjectId === p.id ? 'bg-primary-50 text-primary-600' : 'text-gray-700'
                      }`}
                    >
                      {p.name}
                      <span className="ml-2 text-xs text-gray-400">
                        {p.type === 'helicopter' ? '直升机' : p.type === 'balloon' ? '热气球' : '无人机'}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={() => handleOpenModal()}
              disabled={!selectedProjectId}
              className="flex items-center space-x-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-5 h-5" />
              <span>添加时段</span>
            </button>
          </div>
        </div>

        {project ? (
          <>
            {/* 统计卡片 */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">总时段数</p>
                    <p className="text-xl font-bold text-gray-800">{projectSlots.length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">总库存</p>
                    <p className="text-xl font-bold text-gray-800">
                      {projectSlots.reduce((sum, s) => sum + s.totalStock, 0)}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">剩余库存</p>
                    <p className="text-xl font-bold text-gray-800">
                      {projectSlots.reduce((sum, s) => sum + s.availableStock, 0)}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-accent-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-accent-600" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">最低价格</p>
                    <p className="text-xl font-bold text-gray-800">
                      ¥{projectSlots.length > 0 ? Math.min(...projectSlots.map(s => s.price)) : 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 时段列表 */}
            {sortedDates.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">暂无时段配置</p>
                <p className="text-gray-400 text-sm mt-1">点击右上角按钮添加第一个时段</p>
              </div>
            ) : (
              <div className="space-y-6">
                {sortedDates.map((date) => (
                  <div key={date} className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="px-6 py-4 bg-gray-50 border-b">
                      <h3 className="font-semibold text-gray-800">{date}</h3>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-100">
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">时段</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">价格</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">总库存</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">剩余库存</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">状态</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500">操作</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {groupedSlots[date]
                            .sort((a, b) => a.startTime.localeCompare(b.startTime))
                            .map((slot) => (
                              <tr key={slot.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                  <span className="font-medium text-gray-800">
                                    {slot.startTime} - {slot.endTime}
                                  </span>
                                </td>
                                <td className="px-6 py-4">
                                  <span className="text-accent-600 font-semibold">¥{slot.price}</span>
                                </td>
                                <td className="px-6 py-4 text-gray-600">{slot.totalStock}</td>
                                <td className="px-6 py-4">
                                  <span className={`font-semibold ${
                                    slot.availableStock === 0 ? 'text-red-600' :
                                    slot.availableStock <= 2 ? 'text-yellow-600' : 'text-green-600'
                                  }`}>
                                    {slot.availableStock}
                                  </span>
                                </td>
                                <td className="px-6 py-4">{getStatusBadge(slot)}</td>
                                <td className="px-6 py-4">
                                  <div className="flex items-center justify-end space-x-2">
                                    <button
                                      onClick={() => handleOpenModal(slot.id)}
                                      className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                                      title="编辑"
                                    >
                                      <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => deleteTimeSlot(slot.id)}
                                      className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                      title="删除"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">请先选择项目</p>
          </div>
        )}
      </div>

      {/* 添加/编辑时段弹窗 */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">
                {editingSlot ? '编辑时段' : '添加时段'}
              </h2>
              <button
                onClick={() => { setShowModal(false); resetForm(); }}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="bg-gray-50 rounded-lg p-3 mb-2">
                <p className="text-sm text-gray-600">
                  当前项目：<span className="font-medium text-gray-800">{project?.name}</span>
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">日期</label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">开始时间</label>
                  <input
                    type="time"
                    required
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">结束时间</label>
                  <input
                    type="time"
                    required
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">票价（元）</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">总库存</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.totalStock}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setFormData({ 
                        ...formData, 
                        totalStock: val,
                        availableStock: Math.min(formData.availableStock, val)
                      });
                    }}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">剩余库存</label>
                  <input
                    type="number"
                    required
                    min="0"
                    max={formData.totalStock}
                    value={formData.availableStock}
                    onChange={(e) => setFormData({ ...formData, availableStock: Number(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => { setShowModal(false); resetForm(); }}
                  className="px-6 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="flex items-center space-x-2 px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingSlot ? '保存修改' : '添加时段'}</span>
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
