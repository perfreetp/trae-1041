import type { Project, TimeSlot, Insurance, Order, Announcement, Review, ReportOverview, HeatmapData, RevenueData, ProjectRevenue, QueueInfo } from '../../shared/types';

export const projects: Project[] = [
  {
    id: 'p1',
    name: '云端漫步直升机观光',
    type: 'helicopter',
    description: '乘坐专业直升机，从200米高空俯瞰整个景区的壮丽景色。专业飞行员带您领略山脉、湖泊和古老建筑的完美融合，体验前所未有的视觉盛宴。',
    images: [
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=helicopter%20tour%20over%20scenic%20mountains%20and%20lake%20sunny%20day&image_size=landscape_16_9',
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=helicopter%20interior%20with%20passengers%20enjoying%20view&image_size=landscape_16_9',
    ],
    basePrice: 1280,
    duration: 30,
    rating: 4.9,
    salesCount: 3256,
    minAge: 6,
    maxAge: 75,
    minWeight: 20,
    maxWeight: 120,
    safetyNotes: [
      '患有心脏病、高血压等疾病的乘客请勿乘坐',
      '请提前30分钟到达登机点进行安全检查',
      '飞行全程请系好安全带，听从机组人员指挥',
      '禁止携带易燃易爆物品登机',
    ],
    features: ['专业飞行员', '全景玻璃窗', '语音讲解', '免费保险'],
    route: '景区机场 → 主峰观景台 → 天池 → 古镇 → 返回机场',
  },
  {
    id: 'p2',
    name: '浪漫热气球晨曦之旅',
    type: 'balloon',
    description: '在清晨的第一缕阳光中，乘坐色彩斑斓的热气球缓缓升空。飘浮在云海之上，感受360度全景视野，体验宁静而浪漫的空中之旅。',
    images: [
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=colorful%20hot%20air%20balloons%20floating%20at%20sunrise%20over%20valley&image_size=landscape_16_9',
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=couple%20in%20hot%20air%20balloon%20basket%20scenic%20view&image_size=landscape_16_9',
    ],
    basePrice: 980,
    duration: 60,
    rating: 4.8,
    salesCount: 2187,
    minAge: 10,
    maxAge: 70,
    minWeight: 30,
    maxWeight: 110,
    safetyNotes: [
      '热气球受天气影响较大，可能因天气原因取消',
      '请穿着舒适的长裤和运动鞋',
      '升空和降落时请抓稳扶手',
      '建议在日出前1小时到达集合点',
    ],
    features: ['日出体验', '香槟庆祝', '飞行证书', '专业摄影'],
    route: '起飞点 → 山谷草原 → 森林上空 → 湖泊 → 预定降落点',
  },
  {
    id: 'p3',
    name: 'FPV竞速无人机体验',
    type: 'drone',
    description: '戴上VR眼镜，以第一人称视角操控专业竞速无人机，穿越森林、掠过湖面，体验肾上腺素飙升的飞行快感。专业教练全程指导，零基础也能轻松上手。',
    images: [
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=fpv%20drone%20racing%20through%20forest%20trees%20action%20shot&image_size=landscape_16_9',
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=person%20wearing%20vr%20goggles%20flying%20drone%20outdoor&image_size=landscape_16_9',
    ],
    basePrice: 398,
    duration: 20,
    rating: 4.7,
    salesCount: 4521,
    minAge: 12,
    maxAge: 60,
    minWeight: 0,
    maxWeight: 200,
    safetyNotes: [
      '请听从教练指导，勿擅自操控无人机',
      '飞行区域为指定空域，请勿超出范围',
      '患有眩晕症的游客请谨慎选择',
      '设备损坏需照价赔偿',
    ],
    features: ['VR第一视角', '专业教练', '多种赛道', '视频录制'],
    route: '训练场 → 森林赛道 → 湖面上空 → 特技表演区',
  },
  {
    id: 'p4',
    name: '轻奢直升机婚礼包机',
    type: 'helicopter',
    description: '为您的婚礼增添难忘的空中仪式！直升机迎亲、空中求婚、航拍婚礼，让您的特别之日更加与众不同，留下一生难忘的美好回忆。',
    images: [
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=wedding%20helicopter%20with%20flowers%20and%20bride%20groom&image_size=landscape_16_9',
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=aerial%20view%20wedding%20ceremony%20beautiful%20venue&image_size=landscape_16_9',
    ],
    basePrice: 8888,
    duration: 120,
    rating: 5.0,
    salesCount: 156,
    minAge: 18,
    maxAge: 80,
    minWeight: 0,
    maxWeight: 150,
    safetyNotes: [
      '需提前7天预订并确认天气情况',
      '可定制装饰和飞行路线',
      '包含专业摄影师跟拍',
      '提供婚车接送服务',
    ],
    features: ['定制装饰', '专业航拍', '红毯服务', '香槟庆祝'],
    route: '可根据需求定制飞行路线',
  },
  {
    id: 'p5',
    name: '热气球日落晚宴',
    type: 'balloon',
    description: '在金色的夕阳中升空，在云端享受精致的法式晚宴。当夜幕降临，看着城市的灯光渐次亮起，这将是您最浪漫的约会体验。',
    images: [
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=hot%20air%20balloon%20sunset%20dinner%20romantic%20evening&image_size=landscape_16_9',
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=elegant%20dinner%20set%20in%20hot%20air%20balloon%20basket&image_size=landscape_16_9',
    ],
    basePrice: 2580,
    duration: 90,
    rating: 4.9,
    salesCount: 423,
    minAge: 16,
    maxAge: 70,
    minWeight: 40,
    maxWeight: 100,
    safetyNotes: [
      '仅限18:00后日落时段飞行',
      '含精致晚餐和红酒',
      '需提前3天预订',
      '天气不佳可免费改期',
    ],
    features: ['法式晚宴', '红酒香槟', '浪漫音乐', '专属服务'],
    route: '城市上空 → 日落观景点 → 河畔 → 返回起飞点',
  },
  {
    id: 'p6',
    name: '无人机航拍摄影服务',
    type: 'drone',
    description: '专业飞手操控4K高清无人机，为您拍摄震撼的航拍大片。个人写真、家庭合影、活动记录，用上帝视角记录您的美好时光。',
    images: [
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20drone%20aerial%20photography%20scenic%20landscape&image_size=landscape_16_9',
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=drone%20flying%20taking%20photos%20of%20people%20in%20nature&image_size=landscape_16_9',
    ],
    basePrice: 598,
    duration: 30,
    rating: 4.8,
    salesCount: 1876,
    minAge: 0,
    maxAge: 100,
    minWeight: 0,
    maxWeight: 500,
    safetyNotes: [
      '提供所有原始素材和精修照片',
      '可指定拍摄地点和风格',
      '底片全送，无隐形消费',
      '恶劣天气可免费改期',
    ],
    features: ['4K高清', '专业飞手', '后期精修', '即刻交付'],
    route: '根据拍摄需求定制飞行范围',
  },
];

const generateTimeSlots = (projectId: string, basePrice: number): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const today = new Date();
  const times = ['08:00', '09:30', '11:00', '13:00', '14:30', '16:00', '17:30'];
  
  for (let day = 0; day < 14; day++) {
    const date = new Date(today);
    date.setDate(date.getDate() + day);
    const dateStr = date.toISOString().split('T')[0];
    
    times.forEach((time, idx) => {
      const stock = Math.floor(Math.random() * 10);
      const endHour = parseInt(time.split(':')[0]) + 1;
      const endTime = `${endHour.toString().padStart(2, '0')}:${time.split(':')[1]}`;
      
      slots.push({
        id: `${projectId}-${dateStr}-${idx}`,
        projectId,
        date: dateStr,
        startTime: time,
        endTime,
        price: basePrice + (idx === 2 || idx === 5 ? 100 : 0),
        totalStock: 8,
        availableStock: stock,
        status: stock === 0 ? 'soldout' : stock <= 2 ? 'limited' : 'available',
      });
    });
  }
  
  return slots;
};

export const timeSlots: TimeSlot[] = [
  ...generateTimeSlots('p1', 1280),
  ...generateTimeSlots('p2', 980),
  ...generateTimeSlots('p3', 398),
  ...generateTimeSlots('p4', 8888),
  ...generateTimeSlots('p5', 2580),
  ...generateTimeSlots('p6', 598),
];

export const insurances: Insurance[] = [
  {
    id: 'ins1',
    name: '基础意外险',
    price: 20,
    coverage: '意外伤害保额20万元，医疗费用2万元',
  },
  {
    id: 'ins2',
    name: '尊享意外险',
    price: 50,
    coverage: '意外伤害保额50万元，医疗费用5万元，含紧急救援',
  },
  {
    id: 'ins3',
    name: '豪华全险',
    price: 100,
    coverage: '意外伤害保额100万元，医疗费用10万元，含航班延误、行李丢失',
  },
];

export const orders: Order[] = [
  {
    id: 'o1',
    orderNo: 'FLY20240115001',
    projectId: 'p1',
    projectName: '云端漫步直升机观光',
    projectType: 'helicopter',
    slotId: 'p1-2024-01-20-2',
    slotDate: '2024-01-20',
    slotTime: '11:00-12:00',
    passengers: [
      { name: '张三', idCard: '110101199001011234', phone: '13800138001', age: 34, weight: 70 },
      { name: '李四', idCard: '110101199202022345', phone: '13800138002', age: 32, weight: 55 },
    ],
    insuranceIds: ['ins2'],
    totalAmount: 2760,
    status: 'paid',
    createTime: '2024-01-15T10:30:00Z',
    payTime: '2024-01-15T10:35:00Z',
    queueNumber: 5,
  },
  {
    id: 'o2',
    orderNo: 'FLY20240114002',
    projectId: 'p2',
    projectName: '浪漫热气球晨曦之旅',
    projectType: 'balloon',
    slotId: 'p2-2024-01-18-0',
    slotDate: '2024-01-18',
    slotTime: '08:00-09:00',
    passengers: [
      { name: '王五', idCard: '310101198805053456', phone: '13900139001', age: 36, weight: 75 },
    ],
    insuranceIds: ['ins1'],
    totalAmount: 1000,
    status: 'completed',
    createTime: '2024-01-14T08:00:00Z',
    payTime: '2024-01-14T08:05:00Z',
  },
  {
    id: 'o3',
    orderNo: 'FLY20240113003',
    projectId: 'p3',
    projectName: 'FPV竞速无人机体验',
    projectType: 'drone',
    slotId: 'p3-2024-01-22-4',
    slotDate: '2024-01-22',
    slotTime: '14:30-15:30',
    passengers: [
      { name: '赵六', idCard: '440101199508084567', phone: '13700137001', age: 29, weight: 65 },
      { name: '钱七', idCard: '440101199709095678', phone: '13700137002', age: 27, weight: 58 },
    ],
    insuranceIds: [],
    totalAmount: 796,
    status: 'pending',
    createTime: '2024-01-13T15:20:00Z',
  },
  {
    id: 'o4',
    orderNo: 'FLY20240112004',
    projectId: 'p5',
    projectName: '热气球日落晚宴',
    projectType: 'balloon',
    slotId: 'p5-2024-01-19-6',
    slotDate: '2024-01-19',
    slotTime: '17:30-18:30',
    passengers: [
      { name: '孙八', idCard: '330101199003036789', phone: '13600136001', age: 34, weight: 68 },
      { name: '周九', idCard: '330101199204047890', phone: '13600136002', age: 32, weight: 52 },
    ],
    insuranceIds: ['ins3'],
    totalAmount: 5360,
    status: 'cancelled',
    createTime: '2024-01-12T20:00:00Z',
    payTime: '2024-01-12T20:05:00Z',
    refundAmount: 4824,
  },
];

export const announcements: Announcement[] = [
  {
    id: 'a1',
    title: '【天气预警】1月18日上午直升机项目暂停',
    content: '受冷空气影响，预计1月18日上午有小雨和大风天气，为确保飞行安全，直升机项目上午时段全部取消。已预约的游客我们将主动联系您办理全额退款或免费改期。给您带来的不便，敬请谅解。',
    type: 'weather',
    isTop: true,
    createTime: '2024-01-17T18:00:00Z',
    projectId: 'p1',
  },
  {
    id: 'a2',
    title: '春节特惠：直升机项目立减200元',
    content: '喜迎新春，1月20日-2月5日期间，预订直升机观光项目可享立减200元优惠！数量有限，先到先得。还可参与幸运抽奖，赢取免费飞行体验。',
    type: 'notice',
    isTop: true,
    createTime: '2024-01-15T10:00:00Z',
  },
  {
    id: 'a3',
    title: '新增无人机夜航体验项目',
    content: '应广大游客要求，我们新增了无人机夜航体验项目！每周五、周六晚开放，欣赏璀璨夜景。夜航体验需提前1天预约，欢迎体验。',
    type: 'notice',
    isTop: false,
    createTime: '2024-01-10T09:00:00Z',
    projectId: 'p3',
  },
  {
    id: 'a4',
    title: '【紧急通知】游客中心临时搬迁',
    content: '因游客中心升级改造，1月16日-1月20日期间，登机手续办理地点临时迁至二号门入口处。请游客朋友提前规划好行程，听从现场工作人员指引。',
    type: 'emergency',
    isTop: false,
    createTime: '2024-01-15T14:00:00Z',
  },
];

export const reviews: Review[] = [
  {
    id: 'r1',
    orderId: 'o2',
    projectId: 'p2',
    projectName: '浪漫热气球晨曦之旅',
    userName: '阳光旅行者',
    rating: 5,
    content: '太浪漫了！在热气球上看日出真的是一生难忘的体验。飞行员很专业，还贴心地为我们准备了香槟。强烈推荐给情侣们！',
    images: [],
    createTime: '2024-01-18T12:00:00Z',
    reply: '感谢您的好评！我们会继续努力，为每一位游客带来难忘的空中体验。期待您再次光临！',
    replyTime: '2024-01-18T14:30:00Z',
  },
  {
    id: 'r2',
    orderId: 'o1',
    projectId: 'p1',
    projectName: '云端漫步直升机观光',
    userName: '山水之间',
    rating: 4,
    content: '景色很震撼，直升机很稳，就是价格有点小贵。建议可以推出家庭套餐，这样更划算。整体体验还是很棒的！',
    images: [],
    createTime: '2024-01-20T15:00:00Z',
  },
  {
    id: 'r3',
    orderId: 'o4',
    projectId: 'p5',
    projectName: '热气球日落晚宴',
    userName: '美食探店家',
    rating: 5,
    content: '纪念日选择了这个项目，太太太惊喜了！日落时分在空中享用晚餐，浪漫到骨子里。菜品也很精致，服务超级贴心。',
    images: [],
    createTime: '2024-01-19T22:00:00Z',
    reply: '祝您们纪念日快乐！很高兴能为您们的特别日子增添美好回忆。',
    replyTime: '2024-01-20T09:00:00Z',
  },
];

export const reportOverview: ReportOverview = {
  totalOrders: 12586,
  totalRevenue: 8652480,
  totalPassengers: 25368,
  avgRating: 4.8,
  todayOrders: 42,
  todayRevenue: 58680,
};

const days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
const hours = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];

export const heatmapData: HeatmapData[] = days.flatMap(day => 
  hours.map(hour => ({
    day,
    hour,
    value: Math.floor(Math.random() * (hour >= 10 && hour <= 16 ? 20 : 8) + (day === '周六' || day === '周日' ? 10 : 0)),
  }))
);

export const revenueData: RevenueData[] = Array.from({ length: 30 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - 29 + i);
  return {
    date: date.toISOString().split('T')[0].slice(5),
    revenue: Math.floor(Math.random() * 80000) + 30000,
    orders: Math.floor(Math.random() * 50) + 15,
  };
});

export const projectRevenue: ProjectRevenue[] = [
  { name: '直升机观光', value: 3580000 },
  { name: '热气球体验', value: 2680000 },
  { name: '无人机体验', value: 1520000 },
  { name: '婚礼包机', value: 580000 },
  { name: '航拍摄影', value: 292480 },
];

export const queueInfo: QueueInfo = {
  currentNumber: 12,
  waitingCount: 8,
  estimatedWaitTime: 25,
};
