export type ProjectType = 'helicopter' | 'balloon' | 'drone';

export interface Project {
  id: string;
  name: string;
  type: ProjectType;
  description: string;
  images: string[];
  basePrice: number;
  duration: number;
  rating: number;
  salesCount: number;
  minAge: number;
  maxAge: number;
  minWeight: number;
  maxWeight: number;
  safetyNotes: string[];
  features: string[];
  route: string;
}

export interface TimeSlot {
  id: string;
  projectId: string;
  date: string;
  startTime: string;
  endTime: string;
  price: number;
  totalStock: number;
  availableStock: number;
  status: 'available' | 'limited' | 'soldout';
}

export interface Passenger {
  name: string;
  idCard: string;
  phone: string;
  age: number;
  weight: number;
}

export interface Insurance {
  id: string;
  name: string;
  price: number;
  coverage: string;
}

export type OrderStatus = 'pending' | 'paid' | 'waiting' | 'boarding' | 'completed' | 'cancelled' | 'refunded';

export interface Order {
  id: string;
  orderNo: string;
  projectId: string;
  projectName: string;
  projectType: ProjectType;
  slotId: string;
  slotDate: string;
  slotTime: string;
  passengers: Passenger[];
  insuranceIds: string[];
  totalAmount: number;
  status: OrderStatus;
  createTime: string;
  payTime?: string;
  queueNumber?: number;
  refundAmount?: number;
}

export interface QueueInfo {
  currentNumber: number;
  waitingCount: number;
  estimatedWaitTime: number;
}

export type AnnouncementType = 'weather' | 'notice' | 'emergency';

export interface Announcement {
  id: string;
  title: string;
  content: string;
  type: AnnouncementType;
  isTop: boolean;
  createTime: string;
  projectId?: string;
}

export interface Review {
  id: string;
  orderId: string;
  projectId: string;
  projectName: string;
  userName: string;
  rating: number;
  content: string;
  images: string[];
  createTime: string;
  reply?: string;
  replyTime?: string;
}

export interface ReportOverview {
  totalOrders: number;
  totalRevenue: number;
  totalPassengers: number;
  avgRating: number;
  todayOrders: number;
  todayRevenue: number;
}

export interface HeatmapData {
  hour: number;
  day: string;
  value: number;
}

export interface RevenueData {
  date: string;
  revenue: number;
  orders: number;
}

export interface ProjectRevenue {
  name: string;
  value: number;
}
