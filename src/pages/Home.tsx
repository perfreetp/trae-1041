import { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Filter, Sparkles, Zap, Megaphone, AlertTriangle, Info } from 'lucide-react';
import { useAppStore } from '@/store';
import ProjectCard from '@/components/business/ProjectCard';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const categories = [
  { id: 'all', label: '全部' },
  { id: 'helicopter', label: '直升机' },
  { id: 'balloon', label: '热气球' },
  { id: 'drone', label: '无人机' },
];

const bannerImages = [
  {
    url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=aerial%20view%20beautiful%20mountain%20lake%20landscape%20sunrise%20helicopter%20silhouette&image_size=landscape_16_9',
    title: '探索天空的无限可能',
    subtitle: '专业团队 · 安全保障 · 极致体验',
  },
  {
    url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=colorful%20hot%20air%20balloons%20sunrise%20valley%20romantic%20scene&image_size=landscape_16_9',
    title: '浪漫热气球之旅',
    subtitle: '与心爱的人一起，在云端看日出',
  },
  {
    url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=drone%20flying%20over%20scenic%20forest%20river%20action%20sport&image_size=landscape_16_9',
    title: 'FPV竞速新体验',
    subtitle: '戴上VR眼镜，感受第一人称飞行快感',
  },
];

const announcementIcons: Record<string, React.ReactNode> = {
  weather: <AlertTriangle className="w-4 h-4" />,
  notice: <Info className="w-4 h-4" />,
  emergency: <Megaphone className="w-4 h-4" />,
};

const announcementColors: Record<string, string> = {
  weather: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  notice: 'bg-blue-100 text-blue-700 border-blue-200',
  emergency: 'bg-red-100 text-red-700 border-red-200',
};

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { projects, announcements, categoryFilter, setCategoryFilter, searchQuery } = useAppStore();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const filteredProjects = projects.filter((project) => {
    const matchCategory = categoryFilter === 'all' || project.type === categoryFilter;
    const matchSearch = !searchQuery || 
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = project.status === 'active';
    return matchCategory && matchSearch && matchStatus;
  });

  const recommendedProjects = projects.filter(p => p.status === 'active').slice(0, 3);
  const topAnnouncements = announcements.filter(a => a.isTop).slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Banner */}
      <div className="relative h-[500px] overflow-hidden">
        {bannerImages.map((banner, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img src={banner.url} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/20" />
            <div className="absolute inset-0 flex items-center">
              <div className="container mx-auto px-4">
                <div className="max-w-2xl animate-fade-in">
                  <h1 className="text-5xl font-bold text-white mb-4">{banner.title}</h1>
                  <p className="text-xl text-white/90 mb-8">{banner.subtitle}</p>
                  <button className="px-8 py-3 bg-accent-500 text-white rounded-lg font-semibold hover:bg-accent-600 transition-colors shadow-lg hover:shadow-xl">
                    立即预约体验
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={() => setCurrentSlide((prev) => (prev - 1 + bannerImages.length) % bannerImages.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % bannerImages.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
          {bannerImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide ? 'bg-white w-8' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>

      {/* 公告条 */}
      {topAnnouncements.length > 0 && (
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center space-x-4 overflow-x-auto">
              <span className="flex-shrink-0 flex items-center space-x-1 text-accent-600 font-medium">
                <Megaphone className="w-4 h-4" />
                <span>公告</span>
              </span>
              <div className="flex space-x-4">
                {topAnnouncements.map((announcement) => (
                  <div
                    key={announcement.id}
                    className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm border ${announcementColors[announcement.type]}`}
                  >
                    {announcementIcons[announcement.type]}
                    <span className="whitespace-nowrap">{announcement.title}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-12">
        {/* 特色服务 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-primary-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">专业团队</h3>
            <p className="text-gray-500 text-sm">所有飞行员均持有专业资质，平均飞行经验超过5000小时</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">安全保障</h3>
            <p className="text-gray-500 text-sm">完善的安全体系，设备定期检测，全程保险覆盖</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center mb-4">
              <Filter className="w-6 h-6 text-accent-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">灵活退改</h3>
            <p className="text-gray-500 text-sm">提前24小时免费取消，天气原因全额退款</p>
          </div>
        </div>

        {/* 分类筛选 */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">热门飞行项目</h2>
            <p className="text-gray-500">精选优质项目，为您带来难忘的空中体验</p>
          </div>
          <div className="flex space-x-2 mt-4 md:mt-0">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setCategoryFilter(category.id)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  categoryFilter === category.id
                    ? 'bg-primary-500 text-white shadow-md'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* 项目列表 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">没有找到符合条件的项目</p>
          </div>
        )}

        {/* 推荐专区 */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">精选推荐</h2>
              <p className="text-gray-500">编辑精选，不容错过的热门体验</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recommendedProjects.map((project, index) => (
              <div key={project.id} className="relative">
                <div className="absolute -top-3 -left-3 z-10 w-10 h-10 bg-gradient-to-r from-accent-500 to-accent-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                  {index + 1}
                </div>
                <ProjectCard project={project} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
