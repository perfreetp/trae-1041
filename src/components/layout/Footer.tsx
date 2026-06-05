import { Plane, Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-12 mt-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-primary-400 to-primary-500 rounded-lg flex items-center justify-center">
                <Plane className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">低空文旅</span>
            </div>
            <p className="text-gray-400 text-sm">
              专业的低空文旅飞行服务平台，为您提供安全、优质的空中体验。
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">热门项目</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li className="hover:text-white cursor-pointer transition-colors">直升机观光</li>
              <li className="hover:text-white cursor-pointer transition-colors">热气球体验</li>
              <li className="hover:text-white cursor-pointer transition-colors">无人机竞速</li>
              <li className="hover:text-white cursor-pointer transition-colors">航拍摄影</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">帮助中心</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li className="hover:text-white cursor-pointer transition-colors">预订须知</li>
              <li className="hover:text-white cursor-pointer transition-colors">退改政策</li>
              <li className="hover:text-white cursor-pointer transition-colors">常见问题</li>
              <li className="hover:text-white cursor-pointer transition-colors">安全须知</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">联系我们</h3>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>400-888-8888</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>service@flytour.com</span>
              </li>
              <li className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 mt-0.5" />
                <span>景区游客中心一号门</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-500 text-sm">
          <p>© 2024 低空文旅飞行服务平台 版权所有</p>
        </div>
      </div>
    </footer>
  );
}
