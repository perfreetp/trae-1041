import { create } from 'zustand';
import type { Project, Order, TimeSlot, Announcement, Review, QueueInfo, Insurance, Passenger, ReportOverview, HeatmapData, RevenueData, ProjectRevenue } from '../../shared/types';
import { projects, orders, timeSlots, announcements, reviews, queueInfo, insurances, reportOverview, heatmapData, revenueData, projectRevenue } from '../mock/data';

interface AppState {
  projects: Project[];
  orders: Order[];
  timeSlots: TimeSlot[];
  announcements: Announcement[];
  reviews: Review[];
  queueInfo: QueueInfo;
  insurances: Insurance[];
  reportOverview: ReportOverview;
  heatmapData: HeatmapData[];
  revenueData: RevenueData[];
  projectRevenue: ProjectRevenue[];
  selectedProject: Project | null;
  selectedSlot: TimeSlot | null;
  searchQuery: string;
  categoryFilter: string;
  setSelectedProject: (project: Project | null) => void;
  setSelectedSlot: (slot: TimeSlot | null) => void;
  setSearchQuery: (query: string) => void;
  setCategoryFilter: (category: string) => void;
  createOrder: (order: Omit<Order, 'id' | 'orderNo' | 'createTime' | 'status'>) => void;
  cancelOrder: (orderId: string) => void;
  rescheduleOrder: (orderId: string, newSlotId: string, newSlotDate: string, newSlotTime: string) => void;
  callNextNumber: () => void;
  addAnnouncement: (announcement: Omit<Announcement, 'id' | 'createTime'>) => void;
  addReview: (review: Omit<Review, 'id' | 'createTime'>) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  projects,
  orders,
  timeSlots,
  announcements,
  reviews,
  queueInfo,
  insurances,
  reportOverview,
  heatmapData,
  revenueData,
  projectRevenue,
  selectedProject: null,
  selectedSlot: null,
  searchQuery: '',
  categoryFilter: 'all',

  setSelectedProject: (project) => set({ selectedProject: project }),
  setSelectedSlot: (slot) => set({ selectedSlot: slot }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setCategoryFilter: (category) => set({ categoryFilter: category }),

  createOrder: (orderData) => {
    const newOrder: Order = {
      ...orderData,
      id: `o${Date.now()}`,
      orderNo: `FLY${new Date().toISOString().slice(0, 10).replace(/-/g, '')}${String(get().orders.length + 1).padStart(3, '0')}`,
      status: 'pending',
      createTime: new Date().toISOString(),
    };
    set((state) => ({ orders: [...state.orders, newOrder] }));
  },

  cancelOrder: (orderId) => {
    set((state) => ({
      orders: state.orders.map((order) =>
        order.id === orderId
          ? { ...order, status: 'cancelled' as const, refundAmount: Math.floor(order.totalAmount * 0.9) }
          : order
      ),
    }));
  },

  rescheduleOrder: (orderId, newSlotId, newSlotDate, newSlotTime) => {
    set((state) => ({
      orders: state.orders.map((order) =>
        order.id === orderId
          ? { ...order, slotId: newSlotId, slotDate: newSlotDate, slotTime: newSlotTime }
          : order
      ),
    }));
  },

  callNextNumber: () => {
    set((state) => ({
      queueInfo: {
        ...state.queueInfo,
        currentNumber: state.queueInfo.currentNumber + 1,
        waitingCount: Math.max(0, state.queueInfo.waitingCount - 1),
      },
    }));
  },

  addAnnouncement: (announcementData) => {
    const newAnnouncement: Announcement = {
      ...announcementData,
      id: `a${Date.now()}`,
      createTime: new Date().toISOString(),
    };
    set((state) => ({ announcements: [newAnnouncement, ...state.announcements] }));
  },

  addReview: (reviewData) => {
    const newReview: Review = {
      ...reviewData,
      id: `r${Date.now()}`,
      createTime: new Date().toISOString(),
    };
    set((state) => ({ reviews: [...state.reviews, newReview] }));
  },
}));
