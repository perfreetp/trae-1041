import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, Users, Clock, Play, Pause, SkipForward, 
  QrCode, Check, AlertCircle, Video, Volume2, VolumeX
} from 'lucide-react';
import { useAppStore } from '@/store';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function Checkin() {
  const navigate = useNavigate();
  const { queueInfo, callNextNumber, orders } = useAppStore();
  const [activeTab, setActiveTab] = useState<'queue' | 'verify' | 'video'>('queue');
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [videoWatched, setVideoWatched] = useState(false);
  const [verifyInput, setVerifyInput] = useState('');
  const [verifyResult, setVerifyResult] = useState<{ success: boolean; message: string } | null>(null);

  const paidOrders = orders.filter(o => o.status === 'paid');

  useEffect(() => {
    if (isPlaying && videoProgress < 100) {
      const timer = setInterval(() => {
        setVideoProgress(prev => {
          if (prev >= 100) {
            setIsPlaying(false);
            setVideoWatched(true);
            return 100;
          }
          return prev + 1;
        });
      }, 300);
      return () => clearInterval(timer);
    }
  }, [isPlaying, videoProgress]);

  const handleVerify = () => {
    const order = paidOrders.find(o => 
      o.orderNo.toLowerCase().includes(verifyInput.toLowerCase()) ||
      o.id.includes(verifyInput)
    );
    
    if (order) {
      setVerifyResult({
        success: true,
        message: `核验成功！乘客：${order.passengers[0].name}，项目：${order.projectName}`
      });
    } else {
      setVerifyResult({
        success: false,
        message: '未找到对应订单，请检查票号是否正确'
      });
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
        <h1 className="text-2xl font-bold text-gray-800 mb-6">现场核验</h1>

        {/* Tab 切换 */}
        <div className="bg-white rounded-xl shadow-sm mb-6">
          <div className="flex p-2">
            {[
              { id: 'queue', label: '叫号系统', icon: <Users className="w-4 h-4" /> },
              { id: 'verify', label: '登机核验', icon: <QrCode className="w-4 h-4" /> },
              { id: 'video', label: '安全视频', icon: <Video className="w-4 h-4" /> },
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

        {/* 叫号系统 */}
        {activeTab === 'queue' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 当前叫号大屏 */}
            <div className="lg:col-span-2">
              <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl p-8 text-white shadow-xl">
                <div className="text-center">
                  <h2 className="text-xl opacity-80 mb-4">当前叫号</h2>
                  <div className="relative">
                    <div className="text-9xl font-bold mb-4 animate-pulse">
                      {String(queueInfo.currentNumber).padStart(3, '0')}
                    </div>
                    <div className="absolute -top-4 -right-4 w-8 h-8 bg-green-400 rounded-full animate-ping opacity-75" />
                  </div>
                  <p className="text-lg opacity-90 mb-8">请听到叫号后前往登机口</p>
                  
                  <button
                    onClick={callNextNumber}
                    className="flex items-center space-x-2 mx-auto px-8 py-4 bg-white text-primary-600 rounded-xl font-semibold hover:bg-gray-100 transition-colors shadow-lg"
                  >
                    <SkipForward className="w-5 h-5" />
                    <span>叫下一号</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 等待信息 */}
            <div className="space-y-4">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">等待信息</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-amber-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-amber-600" />
                      </div>
                      <span className="text-gray-700">等待人数</span>
                    </div>
                    <span className="text-2xl font-bold text-amber-600">{queueInfo.waitingCount}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Clock className="w-5 h-5 text-blue-600" />
                      </div>
                      <span className="text-gray-700">预计等待</span>
                    </div>
                    <span className="text-2xl font-bold text-blue-600">{queueInfo.estimatedWaitTime}分钟</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">即将叫号</h3>
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-lg font-semibold text-gray-600">
                        {String(queueInfo.currentNumber + i).padStart(3, '0')}
                      </span>
                      <span className="text-sm text-gray-400">
                        还有约 {i * 8} 分钟
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 登机核验 */}
        {activeTab === 'verify' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm p-8">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <QrCode className="w-10 h-10 text-primary-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">登机核验</h2>
                <p className="text-gray-500">请扫描票券二维码或输入票号进行核验</p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    输入订单号/票号
                  </label>
                  <div className="flex space-x-3">
                    <input
                      type="text"
                      value={verifyInput}
                      onChange={(e) => setVerifyInput(e.target.value)}
                      placeholder="请输入订单号"
                      className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <button
                      onClick={handleVerify}
                      className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                    >
                      核验
                    </button>
                  </div>
                </div>

                {/* 快速核验 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    快速核验（点击订单）
                  </label>
                  <div className="space-y-2">
                    {paidOrders.slice(0, 3).map((order) => (
                      <button
                        key={order.id}
                        onClick={() => setVerifyInput(order.orderNo)}
                        className="w-full p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-gray-800">{order.orderNo}</div>
                            <div className="text-sm text-gray-500">{order.projectName}</div>
                          </div>
                          <div className="text-sm text-gray-400">{order.passengers[0].name}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 核验结果 */}
                {verifyResult && (
                  <div className={`p-4 rounded-lg ${
                    verifyResult.success 
                      ? 'bg-green-50 border border-green-200' 
                      : 'bg-red-50 border border-red-200'
                  }`}>
                    <div className="flex items-start space-x-3">
                      {verifyResult.success ? (
                        <Check className="w-5 h-5 text-green-600 mt-0.5" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                      )}
                      <div>
                        <p className={`font-medium ${
                          verifyResult.success ? 'text-green-800' : 'text-red-800'
                        }`}>
                          {verifyResult.success ? '核验通过' : '核验失败'}
                        </p>
                        <p className={`text-sm ${
                          verifyResult.success ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {verifyResult.message}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 安全视频 */}
        {activeTab === 'video' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              {/* 视频播放区域 */}
              <div className="relative aspect-video bg-gray-900">
                <img 
                  src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=helicopter%20safety%20video%20thumbnail%20instructional%20professional&image_size=landscape_16_9"
                  alt="安全视频封面"
                  className="w-full h-full object-cover opacity-50"
                />
                
                {!isPlaying && (
                  <button
                    onClick={() => setIsPlaying(true)}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
                      <Play className="w-10 h-10 text-white ml-1" />
                    </div>
                  </button>
                )}

                {isPlaying && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="text-white hover:text-primary-300 transition-colors"
                      >
                        <Pause className="w-6 h-6" />
                      </button>
                      <button
                        onClick={() => setIsMuted(!isMuted)}
                        className="text-white hover:text-primary-300 transition-colors"
                      >
                        {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                      </button>
                      <div className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary-500 transition-all duration-300"
                          style={{ width: `${videoProgress}%` }}
                        />
                      </div>
                      <span className="text-white text-sm">{Math.floor(videoProgress * 2.4)}秒</span>
                    </div>
                  </div>
                )}
              </div>

              {/* 视频信息 */}
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-2">飞行安全须知视频</h2>
                <p className="text-gray-500 mb-6">请认真观看以下安全视频，确保您了解飞行过程中的注意事项和应急处理方法。</p>

                {/* 观看进度 */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">观看进度</span>
                    <span className="text-sm text-gray-500">{videoProgress}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-300 ${
                        videoWatched ? 'bg-green-500' : 'bg-primary-500'
                      }`}
                      style={{ width: `${videoProgress}%` }}
                    />
                  </div>
                  {videoWatched && (
                    <div className="flex items-center space-x-2 mt-3 text-green-600">
                      <Check className="w-4 h-4" />
                      <span className="text-sm">观看完成</span>
                    </div>
                  )}
                </div>

                {/* 观看要点 */}
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">观看要点</h3>
                  <ul className="space-y-2">
                    {[
                      '登机前请出示有效身份证件',
                      '飞行全程请系好安全带',
                      '禁止携带易燃易爆物品登机',
                      '紧急情况下请听从机组人员指挥',
                      '着陆后请在座位上等待飞机完全停稳',
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                          videoWatched ? 'text-green-500' : 'text-gray-300'
                        }`} />
                        <span className={videoWatched ? 'text-gray-700' : 'text-gray-500'}>
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {videoWatched && (
                  <button
                    className="w-full mt-6 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors"
                  >
                    确认已观看，前往登机
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
