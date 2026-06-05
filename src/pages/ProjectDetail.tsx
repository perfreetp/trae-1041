import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Star, Clock, Users, Shield, MapPin, Calendar, Clock as ClockIcon,
  ChevronLeft, ChevronRight, Check, AlertCircle, User, Phone, IdCard,
  Plus, Minus, Info
} from 'lucide-react';
import { useAppStore } from '@/store';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import type { Passenger, TimeSlot } from '../../shared/types';

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { projects, timeSlots, insurances, createOrder } = useAppStore();
  
  const project = projects.find(p => p.id === id);
  const projectSlots = timeSlots.filter(s => s.projectId === id);
  
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [passengers, setPassengers] = useState<Passenger[]>([
    { name: '', idCard: '', phone: '', age: 30, weight: 65 }
  ]);
  const [selectedInsurances, setSelectedInsurances] = useState<string[]>([]);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('details');
  const [showSuccess, setShowSuccess] = useState(false);

  const uniqueDates = [...new Set(projectSlots.map(s => s.date))].sort().slice(0, 7);
  
  useEffect(() => {
    if (uniqueDates.length > 0 && !selectedDate) {
      setSelectedDate(uniqueDates[0]);
    }
  }, [uniqueDates, selectedDate]);

  const dateSlots = projectSlots.filter(s => s.date === selectedDate);

  const totalPrice = passengers.reduce((sum, _, idx) => {
    return sum + (selectedSlot?.price || 0);
  }, 0) + selectedInsurances.reduce((sum, insId) => {
    const ins = insurances.find(i => i.id === insId);
    return sum + (ins?.price || 0) * passengers.length;
  }, 0);

  const addPassenger = () => {
    if (passengers.length < 6) {
      setPassengers([...passengers, { name: '', idCard: '', phone: '', age: 30, weight: 65 }]);
    }
  };

  const removePassenger = (index: number) => {
    if (passengers.length > 1) {
      setPassengers(passengers.filter((_, i) => i !== index));
    }
  };

  const updatePassenger = (index: number, field: keyof Passenger, value: string | number) => {
    const updated = [...passengers];
    updated[index] = { ...updated[index], [field]: value };
    setPassengers(updated);
  };

  const toggleInsurance = (insId: string) => {
    if (selectedInsurances.includes(insId)) {
      setSelectedInsurances(selectedInsurances.filter(id => id !== insId));
    } else {
      setSelectedInsurances([...selectedInsurances, insId]);
    }
  };

  const validatePassengers = (): boolean => {
    if (!project) return false;
    
    for (let i = 0; i < passengers.length; i++) {
      const p = passengers[i];
      if (!p.name || !p.idCard || !p.phone) {
        alert(`请完善第 ${i + 1} 位乘客的信息`);
        return false;
      }
      if (p.age < project.minAge || p.age > project.maxAge) {
        alert(`第 ${i + 1} 位乘客年龄不符合要求（${project.minAge}-${project.maxAge}岁）`);
        return false;
      }
      if (p.weight < project.minWeight || p.weight > project.maxWeight) {
        alert(`第 ${i + 1} 位乘体重不符合要求（${project.minWeight}-${project.maxWeight}kg）`);
        return false;
      }
    }
    return true;
  };

  const handleSubmit = () => {
    if (!selectedSlot) {
      alert('请选择出行时段');
      return;
    }
    if (!validatePassengers()) return;
    if (!agreedToTerms) {
      alert('请阅读并同意乘客须知');
      return;
    }
    if (!project) return;

    createOrder({
      projectId: project.id,
      projectName: project.name,
      projectType: project.type,
      slotId: selectedSlot.id,
      slotDate: selectedSlot.date,
      slotTime: `${selectedSlot.startTime}-${selectedSlot.endTime}`,
      passengers: passengers,
      insuranceIds: selectedInsurances,
      totalAmount: totalPrice,
    });

    setShowSuccess(true);
    setTimeout(() => {
      navigate('/orders');
    }, 2000);
  };

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <p className="text-gray-500">项目不存在</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* 成功提示 */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-2xl p-8 text-center animate-slide-up">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">预约成功</h3>
            <p className="text-gray-500">正在跳转到订单页面...</p>
          </div>
        </div>
      )}

      {/* 返回按钮 */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center text-gray-600 hover:text-primary-600 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>返回列表</span>
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧：项目详情 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 图片画廊 */}
            <div className="bg-white rounded-xl overflow-hidden shadow-sm">
              <div className="relative h-80">
                <img 
                  src={project.images[currentImageIndex]} 
                  alt={project.name}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setCurrentImageIndex((prev) => (prev - 1 + project.images.length) % project.images.length)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center hover:bg-white transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setCurrentImageIndex((prev) => (prev + 1) % project.images.length)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center hover:bg-white transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
              <div className="flex p-4 space-x-2 overflow-x-auto">
                {project.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                      idx === currentImageIndex ? 'border-primary-500' : 'border-transparent'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* 基本信息 */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800 mb-2">{project.name}</h1>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="font-medium text-gray-700">{project.rating}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{project.salesCount}人已体验</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{project.duration}分钟</span>
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm text-gray-500">起</span>
                  <span className="text-3xl font-bold text-accent-500">¥{project.basePrice}</span>
                  <span className="text-sm text-gray-500">/人</span>
                </div>
              </div>

              {/* Tab 切换 */}
              <div className="border-b border-gray-100 mb-4">
                <div className="flex space-x-6">
                  {[
                    { id: 'details', label: '项目详情' },
                    { id: 'route', label: '飞行路线' },
                    { id: 'safety', label: '安全须知' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`pb-3 font-medium transition-colors ${
                        activeTab === tab.id
                          ? 'text-primary-600 border-b-2 border-primary-500'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab 内容 */}
              <div className="text-gray-600">
                {activeTab === 'details' && (
                  <div className="space-y-4">
                    <p className="leading-relaxed">{project.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {project.features.map((feature, idx) => (
                        <span key={idx} className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {activeTab === 'route' && (
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-primary-500 flex-shrink-0" />
                    <p>{project.route}</p>
                  </div>
                )}
                {activeTab === 'safety' && (
                  <ul className="space-y-2">
                    {project.safetyNotes.map((note, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                        <span>{note}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* 年龄体重限制 */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <div className="flex items-start space-x-3">
                <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-amber-800 mb-1">乘坐限制</h4>
                  <p className="text-sm text-amber-700">
                    年龄：{project.minAge}-{project.maxAge}岁 | 
                    体重：{project.minWeight}-{project.maxWeight}kg
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 右侧：预订表单 */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm sticky top-20">
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">在线预订</h3>

                {/* 日期选择 */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    选择日期
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {uniqueDates.map((date) => {
                      const d = new Date(date);
                      const dayNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
                      return (
                        <button
                          key={date}
                          onClick={() => {
                            setSelectedDate(date);
                            setSelectedSlot(null);
                          }}
                          className={`p-2 rounded-lg text-center transition-colors ${
                            selectedDate === date
                              ? 'bg-primary-500 text-white'
                              : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                          }`}
                        >
                          <div className="text-xs">{d.getMonth() + 1}/{d.getDate()}</div>
                          <div className="text-xs">{dayNames[d.getDay()]}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 时段选择 */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <ClockIcon className="w-4 h-4 inline mr-1" />
                    选择时段
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {dateSlots.map((slot) => (
                      <button
                        key={slot.id}
                        onClick={() => slot.status !== 'soldout' && setSelectedSlot(slot)}
                        disabled={slot.status === 'soldout'}
                        className={`p-3 rounded-lg text-center text-sm transition-colors ${
                          selectedSlot?.id === slot.id
                            ? 'bg-primary-500 text-white'
                            : slot.status === 'soldout'
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed line-through'
                            : slot.status === 'limited'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
                            : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        <div className="font-medium">{slot.startTime}</div>
                        <div className="text-xs">
                          {slot.status === 'soldout' ? '已满' : `¥${slot.price}`}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 乘客信息 */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-700">
                      <User className="w-4 h-4 inline mr-1" />
                      乘客信息
                    </label>
                    <button
                      onClick={addPassenger}
                      disabled={passengers.length >= 6}
                      className="text-primary-600 text-sm flex items-center space-x-1 hover:text-primary-700 disabled:text-gray-400"
                    >
                      <Plus className="w-4 h-4" />
                      <span>添加乘客</span>
                    </button>
                  </div>
                  
                  {passengers.map((passenger, idx) => (
                    <div key={idx} className="bg-gray-50 rounded-lg p-4 mb-3">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-gray-700">乘客 {idx + 1}</span>
                        {passengers.length > 1 && (
                          <button
                            onClick={() => removePassenger(idx)}
                            className="text-red-500 text-sm flex items-center space-x-1 hover:text-red-600"
                          >
                            <Minus className="w-4 h-4" />
                            <span>删除</span>
                          </button>
                        )}
                      </div>
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <input
                              type="text"
                              placeholder="姓名"
                              value={passenger.name}
                              onChange={(e) => updatePassenger(idx, 'name', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                            />
                          </div>
                          <div>
                            <input
                              type="tel"
                              placeholder="手机号"
                              value={passenger.phone}
                              onChange={(e) => updatePassenger(idx, 'phone', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                            />
                          </div>
                        </div>
                        <div>
                          <input
                            type="text"
                            placeholder="身份证号"
                            value={passenger.idCard}
                            onChange={(e) => updatePassenger(idx, 'idCard', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <input
                              type="number"
                              placeholder="年龄"
                              value={passenger.age}
                              onChange={(e) => updatePassenger(idx, 'age', parseInt(e.target.value) || 0)}
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                            />
                          </div>
                          <div>
                            <input
                              type="number"
                              placeholder="体重(kg)"
                              value={passenger.weight}
                              onChange={(e) => updatePassenger(idx, 'weight', parseInt(e.target.value) || 0)}
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 保险选择 */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Shield className="w-4 h-4 inline mr-1" />
                    保险选择
                  </label>
                  <div className="space-y-2">
                    {insurances.map((ins) => (
                      <label
                        key={ins.id}
                        className={`flex items-start p-3 rounded-lg border cursor-pointer transition-colors ${
                          selectedInsurances.includes(ins.id)
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedInsurances.includes(ins.id)}
                          onChange={() => toggleInsurance(ins.id)}
                          className="mt-1 mr-3"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-gray-800 text-sm">{ins.name}</span>
                            <span className="text-accent-500 font-medium text-sm">¥{ins.price}/人</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">{ins.coverage}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* 须知确认 */}
                <div className="mb-6">
                  <label className="flex items-start space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                      className="mt-1"
                    />
                    <span className="text-sm text-gray-600">
                      我已阅读并同意<a href="#" className="text-primary-600">《乘客须知》</a>和<a href="#" className="text-primary-600">《安全协议》</a>
                    </span>
                  </label>
                </div>
              </div>

              {/* 价格和提交 */}
              <div className="p-6 bg-gray-50 rounded-b-xl">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-600">总价</span>
                  <span className="text-3xl font-bold text-accent-500">¥{totalPrice}</span>
                </div>
                <button
                  onClick={handleSubmit}
                  disabled={!selectedSlot || !agreedToTerms}
                  className="w-full py-3 bg-gradient-to-r from-accent-500 to-accent-600 text-white font-semibold rounded-lg hover:from-accent-600 hover:to-accent-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                  立即预订
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
