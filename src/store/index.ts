import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { 
  Project, Order, TimeSlot, Announcement, Review, QueueInfo, 
  Insurance, Passenger, ReportOverview, HeatmapData, RevenueData, 
  ProjectRevenue, PaymentRecord, RefundRecord, WaitlistItem, Complaint
} from '../../shared/types';
import { 
  projects as initialProjects, 
  orders as initialOrders, 
  timeSlots as initialTimeSlots, 
  announcements as initialAnnouncements, 
  reviews, 
  queueInfo as initialQueueInfo, 
  insurances, 
  reportOverview, 
  heatmapData, 
  revenueData, 
  projectRevenue,
  paymentRecords as initialPaymentRecords,
  refundRecords as initialRefundRecords,
  waitlistItems as initialWaitlistItems,
  complaints as initialComplaints
} from '../mock/data';

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
  paymentRecords: PaymentRecord[];
  refundRecords: RefundRecord[];
  waitlistItems: WaitlistItem[];
  complaints: Complaint[];
  selectedProject: Project | null;
  selectedSlot: TimeSlot | null;
  searchQuery: string;
  categoryFilter: string;
  
  setSelectedProject: (project: Project | null) => void;
  setSelectedSlot: (slot: TimeSlot | null) => void;
  setSearchQuery: (query: string) => void;
  setCategoryFilter: (category: string) => void;
  
  addProject: (project: Omit<Project, 'id' | 'rating' | 'salesCount' | 'status'>) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  toggleProjectStatus: (id: string) => void;
  
  addTimeSlot: (slot: Omit<TimeSlot, 'id' | 'status'>) => void;
  updateTimeSlot: (id: string, slot: Partial<TimeSlot>) => void;
  deleteTimeSlot: (id: string) => void;
  
  createOrder: (order: Omit<Order, 'id' | 'orderNo' | 'createTime' | 'status' | 'hasWatchedVideo' | 'isCheckedIn'>) => Order | null;
  payOrder: (orderId: string, paymentMethod: string) => boolean;
  cancelOrder: (orderId: string, reason: string) => boolean;
  rescheduleOrder: (orderId: string, newSlotId: string) => boolean;
  
  addToWaitlist: (orderId: string, projectId: string, slotId: string) => void;
  processWaitlist: (slotId: string) => void;
  
  addComplaint: (complaint: Omit<Complaint, 'id' | 'status' | 'createTime'>) => void;
  handleComplaint: (id: string, opinion: string, status: Complaint['status']) => void;
  
  markVideoWatched: (orderId: string) => void;
  checkInOrder: (orderId: string) => boolean;
  canCheckIn: (orderId: string) => { canCheckIn: boolean; reason?: string };
  
  callNextNumber: () => void;
  addAnnouncement: (announcement: Omit<Announcement, 'id' | 'createTime'>) => void;
  addReview: (review: Omit<Review, 'id' | 'createTime'>) => void;
  
  isSlotCancelled: (projectId: string, date: string, startTime?: string) => boolean;
  getAvailableSlots: (projectId: string, date: string) => TimeSlot[];
  
  resetAllData: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      projects: initialProjects,
      orders: initialOrders,
      timeSlots: initialTimeSlots,
      announcements: initialAnnouncements,
      reviews,
      queueInfo: initialQueueInfo,
      insurances,
      reportOverview,
      heatmapData,
      revenueData,
      projectRevenue,
      paymentRecords: initialPaymentRecords,
      refundRecords: initialRefundRecords,
      waitlistItems: initialWaitlistItems,
      complaints: initialComplaints,
      selectedProject: null,
      selectedSlot: null,
      searchQuery: '',
      categoryFilter: 'all',

      setSelectedProject: (project) => set({ selectedProject: project }),
      setSelectedSlot: (slot) => set({ selectedSlot: slot }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      setCategoryFilter: (category) => set({ categoryFilter: category }),

      addProject: (projectData) => {
        const newProject: Project = {
          ...projectData,
          id: `p${Date.now()}`,
          rating: 5.0,
          salesCount: 0,
          status: 'active',
        };
        set((state) => ({ projects: [...state.projects, newProject] }));
      },

      updateProject: (id, projectData) => {
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === id ? { ...p, ...projectData } : p
          ),
        }));
      },

      toggleProjectStatus: (id) => {
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === id
              ? { ...p, status: p.status === 'active' ? 'inactive' : 'active' }
              : p
          ),
        }));
      },

      addTimeSlot: (slotData) => {
        const newSlot: TimeSlot = {
          ...slotData,
          id: `s${Date.now()}`,
          status: slotData.availableStock === 0 ? 'soldout' : slotData.availableStock <= 2 ? 'limited' : 'available',
        };
        set((state) => ({ timeSlots: [...state.timeSlots, newSlot] }));
      },

      updateTimeSlot: (id, slotData) => {
        set((state) => ({
          timeSlots: state.timeSlots.map((s) => {
            if (s.id === id) {
              const updated = { ...s, ...slotData };
              return {
                ...updated,
                status: updated.availableStock === 0 ? 'soldout' : updated.availableStock <= 2 ? 'limited' : 'available',
              };
            }
            return s;
          }),
        }));
        get().processWaitlist(id);
      },

      deleteTimeSlot: (id) => {
        set((state) => ({
          timeSlots: state.timeSlots.filter((s) => s.id !== id),
        }));
      },

      createOrder: (orderData) => {
        const slot = get().timeSlots.find(s => s.id === orderData.slotId);
        if (!slot || slot.availableStock <= 0) return null;
        if (slot.status === 'soldout') return null;
        
        const project = get().projects.find(p => p.id === orderData.projectId);
        if (!project || project.status !== 'active') return null;
        
        if (get().isSlotCancelled(orderData.projectId, orderData.slotDate, orderData.slotTime.split('-')[0])) {
          return null;
        }

        const newOrder: Order = {
          ...orderData,
          id: `o${Date.now()}`,
          orderNo: `FLY${new Date().toISOString().slice(0, 10).replace(/-/g, '')}${String(get().orders.length + 1).padStart(3, '0')}`,
          status: 'pending',
          createTime: new Date().toISOString(),
          hasWatchedVideo: false,
          isCheckedIn: false,
        };
        
        set((state) => ({
          orders: [...state.orders, newOrder],
          timeSlots: state.timeSlots.map((s) =>
            s.id === orderData.slotId
              ? {
                  ...s,
                  availableStock: s.availableStock - 1,
                  status: s.availableStock - 1 === 0 ? 'soldout' : s.availableStock - 1 <= 2 ? 'limited' : 'available',
                }
              : s
          ),
        }));
        
        return newOrder;
      },

      payOrder: (orderId, paymentMethod) => {
        const order = get().orders.find(o => o.id === orderId);
        if (!order || order.status !== 'pending') return false;

        const paymentRecord: PaymentRecord = {
          id: `pay${Date.now()}`,
          orderId,
          amount: order.totalAmount,
          paymentMethod,
          status: 'success',
          transactionId: `${paymentMethod === '微信支付' ? 'WX' : 'ALI'}${Date.now()}`,
          createTime: new Date().toISOString(),
        };

        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === orderId
              ? { ...o, status: 'paid' as const, payTime: new Date().toISOString() }
              : o
          ),
          paymentRecords: [...state.paymentRecords, paymentRecord],
        }));
        
        return true;
      },

      cancelOrder: (orderId, reason) => {
        const order = get().orders.find(o => o.id === orderId);
        if (!order || order.status === 'cancelled' || order.status === 'refunded') return false;

        const refundAmount = order.status === 'paid' ? Math.floor(order.totalAmount * 0.9) : 0;
        
        const refundRecord: RefundRecord = {
          id: `ref${Date.now()}`,
          orderId,
          amount: refundAmount,
          reason,
          status: 'completed',
          createTime: new Date().toISOString(),
          completeTime: new Date().toISOString(),
        };

        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === orderId
              ? { ...o, status: 'refunded' as const, refundAmount }
              : o
          ),
          timeSlots: state.timeSlots.map((s) =>
            s.id === order.slotId
              ? {
                  ...s,
                  availableStock: s.availableStock + 1,
                  status: s.availableStock + 1 === 0 ? 'soldout' : s.availableStock + 1 <= 2 ? 'limited' : 'available',
                }
              : s
          ),
          refundRecords: [...state.refundRecords, refundRecord],
        }));

        get().processWaitlist(order.slotId);
        
        return true;
      },

      rescheduleOrder: (orderId, newSlotId) => {
        const order = get().orders.find(o => o.id === orderId);
        const newSlot = get().timeSlots.find(s => s.id === newSlotId);
        
        if (!order || !newSlot || newSlot.availableStock <= 0) return false;
        if (order.status !== 'paid' && order.status !== 'pending' && order.status !== 'flightCancelled') return false;
        
        if (get().isSlotCancelled(newSlot.projectId, newSlot.date, newSlot.startTime)) {
          return false;
        }

        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === orderId
              ? { 
                  ...o, 
                  slotId: newSlotId, 
                  slotDate: newSlot.date, 
                  slotTime: `${newSlot.startTime}-${newSlot.endTime}`,
                  status: 'paid' as const
                }
              : o
          ),
          timeSlots: state.timeSlots.map((s) => {
            if (s.id === order.slotId) {
              return {
                ...s,
                availableStock: s.availableStock + 1,
                status: s.availableStock + 1 === 0 ? 'soldout' : s.availableStock + 1 <= 2 ? 'limited' : 'available',
              };
            }
            if (s.id === newSlotId) {
              return {
                ...s,
                availableStock: s.availableStock - 1,
                status: s.availableStock - 1 === 0 ? 'soldout' : s.availableStock - 1 <= 2 ? 'limited' : 'available',
              };
            }
            return s;
          }),
        }));

        get().processWaitlist(order.slotId);
        
        return true;
      },

      addToWaitlist: (orderId, projectId, slotId) => {
        const existingWaitlist = get().waitlistItems.filter(w => w.slotId === slotId && w.status === 'waiting');
        const position = existingWaitlist.length + 1;
        
        const waitlistItem: WaitlistItem = {
          id: `w${Date.now()}`,
          orderId,
          projectId,
          slotId,
          position,
          createTime: new Date().toISOString(),
          status: 'waiting',
        };

        set((state) => ({
          waitlistItems: [...state.waitlistItems, waitlistItem],
          orders: state.orders.map((o) =>
            o.id === orderId ? { ...o, status: 'waitlisted' as const } : o
          ),
        }));
      },

      processWaitlist: (slotId) => {
        const waitlist = get().waitlistItems
          .filter(w => w.slotId === slotId && w.status === 'waiting')
          .sort((a, b) => a.position - b.position);
        
        if (waitlist.length === 0) return;

        const firstInLine = waitlist[0];
        const slot = get().timeSlots.find(s => s.id === slotId);
        
        if (slot && slot.availableStock > 0) {
          set((state) => {
            const remainingWaitlist = waitlist.slice(1);
            return {
              waitlistItems: state.waitlistItems.map((w) => {
                if (w.id === firstInLine.id) {
                  return { ...w, status: 'converted' as const };
                }
                if (w.slotId === slotId && w.status === 'waiting') {
                  const newIdx = remainingWaitlist.findIndex(rw => rw.id === w.id);
                  if (newIdx !== -1) {
                    return { ...w, position: newIdx + 1 };
                  }
                }
                return w;
              }),
              orders: state.orders.map((o) =>
                o.id === firstInLine.orderId ? { ...o, status: 'pending' as const } : o
              ),
              timeSlots: state.timeSlots.map((s) =>
                s.id === slotId
                  ? {
                      ...s,
                      availableStock: s.availableStock - 1,
                      status: s.availableStock - 1 === 0 ? 'soldout' : s.availableStock - 1 <= 2 ? 'limited' : 'available',
                    }
                  : s
              ),
            };
          });
        }
      },

      addComplaint: (complaintData) => {
        const newComplaint: Complaint = {
          ...complaintData,
          id: `c${Date.now()}`,
          status: 'pending',
          createTime: new Date().toISOString(),
        };
        set((state) => ({ complaints: [...state.complaints, newComplaint] }));
      },

      handleComplaint: (id, opinion, status) => {
        set((state) => ({
          complaints: state.complaints.map((c) =>
            c.id === id
              ? { ...c, status, handleOpinion: opinion, handleTime: new Date().toISOString() }
              : c
          ),
        }));
      },

      markVideoWatched: (orderId) => {
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === orderId ? { ...o, hasWatchedVideo: true } : o
          ),
        }));
      },

      canCheckIn: (orderId) => {
        const order = get().orders.find(o => o.id === orderId);
        if (!order) return { canCheckIn: false, reason: '订单不存在' };
        if (order.status === 'pending') {
          return { canCheckIn: false, reason: '订单未支付，请先完成支付' };
        }
        if (order.status === 'refunded' || order.status === 'cancelled') {
          return { canCheckIn: false, reason: '订单已退票或取消' };
        }
        if (order.status === 'flightCancelled') {
          return { canCheckIn: false, reason: '航班已停飞，请办理改签或退票' };
        }
        if (order.status === 'waitlisted') {
          return { canCheckIn: false, reason: '订单正在候补中，请等待候补成功' };
        }
        if (order.status !== 'paid' && order.status !== 'waiting' && order.status !== 'boarding') {
          return { canCheckIn: false, reason: '订单状态异常' };
        }
        if (!order.hasWatchedVideo) {
          return { canCheckIn: false, reason: '请先观看安全视频' };
        }
        if (order.isCheckedIn) {
          return { canCheckIn: false, reason: '已完成登机核验' };
        }
        return { canCheckIn: true };
      },

      checkInOrder: (orderId) => {
        const { canCheckIn } = get().canCheckIn(orderId);
        if (!canCheckIn) return false;

        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === orderId ? { ...o, isCheckedIn: true, status: 'boarding' as const } : o
          ),
        }));
        return true;
      },

      canCallNumber: (orderId: string) => {
        const order = get().orders.find(o => o.id === orderId);
        if (!order) return { canCall: false, reason: '订单不存在' };
        if (order.status === 'pending') {
          return { canCall: false, reason: '订单未支付，请先完成支付' };
        }
        if (order.status === 'refunded' || order.status === 'cancelled') {
          return { canCall: false, reason: '订单已退票或取消' };
        }
        if (order.status === 'flightCancelled') {
          return { canCall: false, reason: '航班已停飞，请办理改签或退票' };
        }
        if (order.status === 'waitlisted') {
          return { canCall: false, reason: '订单正在候补中，请等待候补成功' };
        }
        if (!order.hasWatchedVideo) {
          return { canCall: false, reason: '请先观看安全视频' };
        }
        if (order.isCheckedIn) {
          return { canCall: false, reason: '已完成登机核验' };
        }
        if (order.status !== 'paid' && order.status !== 'waiting') {
          return { canCall: false, reason: '订单状态异常' };
        }
        return { canCall: true };
      },

      callNextNumber: (orderId?: string) => {
        set((state) => ({
          queueInfo: {
            ...state.queueInfo,
            currentNumber: state.queueInfo.currentNumber + 1,
            waitingCount: Math.max(0, state.queueInfo.waitingCount - 1),
          },
          orders: orderId 
            ? state.orders.map((o) => 
                o.id === orderId && o.status === 'paid'
                  ? { ...o, status: 'waiting' as const, queueNumber: state.queueInfo.currentNumber + 1 }
                  : o
              )
            : state.orders,
        }));
      },

      addAnnouncement: (announcementData) => {
        const newAnnouncement: Announcement = {
          ...announcementData,
          id: `a${Date.now()}`,
          createTime: new Date().toISOString(),
        };
        set((state) => ({ announcements: [newAnnouncement, ...state.announcements] }));

        if (announcementData.type === 'weather') {
          set((state) => ({
            orders: state.orders.map((o) => {
              if (o.status !== 'paid' && o.status !== 'pending') return o;
              
              if (announcementData.projectId && o.projectId !== announcementData.projectId) {
                return o;
              }
              
              if (announcementData.date && o.slotDate !== announcementData.date) {
                return o;
              }
              
              if (announcementData.startTime) {
                const orderStartTime = o.slotTime.split('-')[0];
                if (orderStartTime !== announcementData.startTime) {
                  return o;
                }
              }
              
              return { ...o, status: 'flightCancelled' as const };
            }),
          }));
        }
      },

      addReview: (reviewData) => {
        const newReview: Review = {
          ...reviewData,
          id: `r${Date.now()}`,
          createTime: new Date().toISOString(),
        };
        set((state) => ({ reviews: [...state.reviews, newReview] }));
      },

      isSlotCancelled: (projectId, date, startTime) => {
        const weatherAnnouncements = get().announcements.filter(
          a => a.type === 'weather'
        );
        
        for (const ann of weatherAnnouncements) {
          if (ann.projectId && ann.projectId !== projectId) continue;
          
          if (ann.date && ann.date !== date) continue;
          
          if (ann.startTime && startTime && ann.startTime !== startTime) continue;
          
          if (!ann.projectId && !ann.date) return true;
          
          if (ann.projectId && !ann.date && ann.projectId === projectId) return true;
          
          if (ann.projectId && ann.date && !ann.startTime && ann.projectId === projectId && ann.date === date) return true;
          
          if (ann.projectId && ann.date && ann.startTime && 
              ann.projectId === projectId && ann.date === date && 
              ann.startTime === startTime) return true;
        }
        return false;
      },

      getAvailableSlots: (projectId, date) => {
        return get().timeSlots.filter(s => 
          s.projectId === projectId && 
          s.date === date && 
          s.availableStock > 0 &&
          !get().isSlotCancelled(projectId, date, s.startTime)
        );
      },

      resetAllData: () => {
        set({
          projects: initialProjects,
          orders: initialOrders,
          timeSlots: initialTimeSlots,
          announcements: initialAnnouncements,
          paymentRecords: initialPaymentRecords,
          refundRecords: initialRefundRecords,
          waitlistItems: initialWaitlistItems,
          complaints: initialComplaints,
          queueInfo: initialQueueInfo,
        });
        localStorage.removeItem('flight-app-storage');
      },
    }),
    {
      name: 'flight-app-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        projects: state.projects,
        orders: state.orders,
        timeSlots: state.timeSlots,
        announcements: state.announcements,
        paymentRecords: state.paymentRecords,
        refundRecords: state.refundRecords,
        waitlistItems: state.waitlistItems,
        complaints: state.complaints,
        queueInfo: state.queueInfo,
      }),
    }
  )
);
