import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, Plus, Edit, Trash2, Eye, EyeOff, 
  Plane, Cloud, Camera, Save, X, Calendar
} from 'lucide-react';
import { useAppStore } from '@/store';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import type { ProjectType } from '../../../../shared/types';

const projectTypeMap: Record<ProjectType, { label: string; icon: React.ReactNode; color: string }> = {
  helicopter: { label: '直升机', icon: <Plane className="w-4 h-4" />, color: 'bg-blue-100 text-blue-600' },
  balloon: { label: '热气球', icon: <Cloud className="w-4 h-4" />, color: 'bg-orange-100 text-orange-600' },
  drone: { label: '无人机', icon: <Camera className="w-4 h-4" />, color: 'bg-green-100 text-green-600' },
};

export default function Projects() {
  const navigate = useNavigate();
  const { projects, addProject, updateProject, toggleProjectStatus } = useAppStore();
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'helicopter' as ProjectType,
    description: '',
    basePrice: 0,
    duration: 30,
    minAge: 6,
    maxAge: 75,
    minWeight: 20,
    maxWeight: 120,
    route: '',
    safetyNotes: '',
    features: '',
    images: '',
  });

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'helicopter',
      description: '',
      basePrice: 0,
      duration: 30,
      minAge: 6,
      maxAge: 75,
      minWeight: 20,
      maxWeight: 120,
      route: '',
      safetyNotes: '',
      features: '',
      images: '',
    });
    setEditingProject(null);
  };

  const handleOpenModal = (projectId?: string) => {
    if (projectId) {
      const project = projects.find(p => p.id === projectId);
      if (project) {
        setFormData({
          name: project.name,
          type: project.type,
          description: project.description,
          basePrice: project.basePrice,
          duration: project.duration,
          minAge: project.minAge,
          maxAge: project.maxAge,
          minWeight: project.minWeight,
          maxWeight: project.maxWeight,
          route: project.route,
          safetyNotes: project.safetyNotes.join('\n'),
          features: project.features.join(','),
          images: project.images.join(','),
        });
        setEditingProject(projectId);
      }
    } else {
      resetForm();
    }
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const projectData = {
      name: formData.name,
      type: formData.type,
      description: formData.description,
      basePrice: formData.basePrice,
      duration: formData.duration,
      minAge: formData.minAge,
      maxAge: formData.maxAge,
      minWeight: formData.minWeight,
      maxWeight: formData.maxWeight,
      route: formData.route,
      safetyNotes: formData.safetyNotes.split('\n').filter(n => n.trim()),
      features: formData.features.split(',').map(f => f.trim()).filter(f => f),
      images: formData.images.split(',').map(i => i.trim()).filter(i => i).length > 0 
        ? formData.images.split(',').map(i => i.trim()).filter(i => i)
        : [`https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent(formData.type + ' tour scenic')}&image_size=landscape_16_9`],
    };

    if (editingProject) {
      updateProject(editingProject, projectData);
    } else {
      addProject(projectData);
    }
    
    setShowModal(false);
    resetForm();
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
            <h1 className="text-2xl font-bold text-gray-800">项目管理</h1>
            <p className="text-gray-500">管理所有飞行体验项目</p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>新增项目</span>
          </button>
        </div>

        {/* 项目列表 */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">项目</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">类型</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">价格</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">时长</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">销量</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {projects.map((project) => {
                  const typeInfo = projectTypeMap[project.type];
                  return (
                    <tr key={project.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={project.images[0]}
                            alt={project.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div>
                            <div className="font-medium text-gray-800">{project.name}</div>
                            <div className="text-xs text-gray-500 truncate max-w-xs">{project.description.slice(0, 30)}...</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${typeInfo.color}`}>
                          {typeInfo.icon}
                          <span>{typeInfo.label}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-gray-800">¥{project.basePrice}</span>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{project.duration}分钟</td>
                      <td className="px-6 py-4 text-gray-600">{project.salesCount}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          project.status === 'active' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {project.status === 'active' ? '上架中' : '已下架'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleOpenModal(project.id)}
                            className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                            title="编辑"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => toggleProjectStatus(project.id)}
                            className={`p-2 rounded-lg transition-colors ${
                              project.status === 'active'
                                ? 'text-gray-500 hover:text-orange-600 hover:bg-orange-50'
                                : 'text-gray-500 hover:text-green-600 hover:bg-green-50'
                            }`}
                            title={project.status === 'active' ? '下架' : '上架'}
                          >
                            {project.status === 'active' ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => navigate(`/admin/slots?projectId=${project.id}`)}
                            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="时段管理"
                          >
                            <Calendar className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 新增/编辑弹窗 */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">
                {editingProject ? '编辑项目' : '新增项目'}
              </h2>
              <button
                onClick={() => { setShowModal(false); resetForm(); }}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">项目名称</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="请输入项目名称"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">项目类型</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as ProjectType })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="helicopter">直升机</option>
                    <option value="balloon">热气球</option>
                    <option value="drone">无人机</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">基础价格（元）</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.basePrice}
                    onChange={(e) => setFormData({ ...formData, basePrice: Number(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">体验时长（分钟）</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="30"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">项目介绍</label>
                  <textarea
                    required
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                    placeholder="请详细描述项目内容和特色"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">最小年龄（岁）</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.minAge}
                    onChange={(e) => setFormData({ ...formData, minAge: Number(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">最大年龄（岁）</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.maxAge}
                    onChange={(e) => setFormData({ ...formData, maxAge: Number(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">最小体重（kg）</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.minWeight}
                    onChange={(e) => setFormData({ ...formData, minWeight: Number(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">最大体重（kg）</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.maxWeight}
                    onChange={(e) => setFormData({ ...formData, maxWeight: Number(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">飞行路线</label>
                  <input
                    type="text"
                    required
                    value={formData.route}
                    onChange={(e) => setFormData({ ...formData, route: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="例如：景区机场 → 主峰观景台 → 天池 → 返回机场"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">项目特色（用逗号分隔）</label>
                  <input
                    type="text"
                    value={formData.features}
                    onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="例如：专业飞行员,全景玻璃窗,语音讲解"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">安全须知（每行一条）</label>
                  <textarea
                    rows={4}
                    value={formData.safetyNotes}
                    onChange={(e) => setFormData({ ...formData, safetyNotes: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                    placeholder="请输入安全须知，每行一条"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">图片URL（用逗号分隔，可选）</label>
                  <textarea
                    rows={2}
                    value={formData.images}
                    onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                    placeholder="留空将自动生成默认图片"
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
                  <span>{editingProject ? '保存修改' : '新增项目'}</span>
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
