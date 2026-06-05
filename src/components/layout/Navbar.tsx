import { Plane, Search, ShoppingCart, User, Menu, X, ChevronDown, Settings } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { searchQuery, setSearchQuery, orders } = useAppStore();

  const pendingOrders = orders.filter(o => o.status === 'pending').length;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
              <Plane className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-800">低空文旅</span>
          </Link>

          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="搜索飞行项目..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </form>

          <div className="hidden md:flex items-center space-x-6">
            <Link to="/orders" className="relative p-2 text-gray-600 hover:text-primary-500 transition-colors">
              <ShoppingCart className="w-6 h-6" />
              {pendingOrders > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent-500 text-white text-xs rounded-full flex items-center justify-center">
                  {pendingOrders}
                </span>
              )}
            </Link>
            <Link to="/checkin" className="px-4 py-2 text-gray-600 hover:text-primary-500 transition-colors">
              现场核验
            </Link>
            
            {/* 管理后台下拉菜单 */}
            <div className="relative">
              <button
                onClick={() => setIsAdminMenuOpen(!isAdminMenuOpen)}
                className="flex items-center space-x-1 px-4 py-2 text-gray-600 hover:text-primary-500 transition-colors"
              >
                <Settings className="w-5 h-5" />
                <span>管理</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isAdminMenuOpen ? 'rotate-180' : ''}`} />
              </button>
              {isAdminMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-2 animate-fade-in z-50">
                  <Link
                    to="/admin/projects"
                    className="block px-4 py-2 text-sm text-gray-600 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                    onClick={() => setIsAdminMenuOpen(false)}
                  >
                    项目管理
                  </Link>
                  <Link
                    to="/admin/announcements"
                    className="block px-4 py-2 text-sm text-gray-600 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                    onClick={() => setIsAdminMenuOpen(false)}
                  >
                    公告管理
                  </Link>
                  <Link
                    to="/admin/complaints"
                    className="block px-4 py-2 text-sm text-gray-600 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                    onClick={() => setIsAdminMenuOpen(false)}
                  >
                    投诉处理
                  </Link>
                  <Link
                    to="/admin/reviews"
                    className="block px-4 py-2 text-sm text-gray-600 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                    onClick={() => setIsAdminMenuOpen(false)}
                  >
                    评价中心
                  </Link>
                  <Link
                    to="/admin/reports"
                    className="block px-4 py-2 text-sm text-gray-600 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                    onClick={() => setIsAdminMenuOpen(false)}
                  >
                    经营报表
                  </Link>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-1 text-sm">
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-primary-600" />
              </div>
            </div>
          </div>

          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 animate-slide-down">
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="搜索飞行项目..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </form>
            <div className="space-y-2">
              <Link to="/orders" className="block py-2 text-gray-600 hover:text-primary-500">
                我的订单
              </Link>
              <Link to="/checkin" className="block py-2 text-gray-600 hover:text-primary-500">
                现场核验
              </Link>
              <Link to="/admin/projects" className="block py-2 text-gray-600 hover:text-primary-500">
                项目管理
              </Link>
              <Link to="/admin/announcements" className="block py-2 text-gray-600 hover:text-primary-500">
                公告管理
              </Link>
              <Link to="/admin/complaints" className="block py-2 text-gray-600 hover:text-primary-500">
                投诉处理
              </Link>
              <Link to="/admin/reviews" className="block py-2 text-gray-600 hover:text-primary-500">
                评价中心
              </Link>
              <Link to="/admin/reports" className="block py-2 text-gray-600 hover:text-primary-500">
                经营报表
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
