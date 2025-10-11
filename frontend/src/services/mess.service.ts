// Mess Service - Real backend API calls
import { api } from './api.service';
import { API_ENDPOINTS } from '../constants/api.constants';

export interface Mess {
  id: string;
  name: string;
  address: string;
  monthlyFee: number;
  capacity?: number;
  ownerId: string;
  qrCode?: string;
  qrCodeExpiry?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MessMember {
  id: string;
  userId: string;
  messId: string;
  joinedAt: string;
  status: 'pending' | 'active' | 'inactive';
  user: {
    id: string;
    name: string;
    phone: string;
    email: string;
  };
}

export interface MessStats {
  totalMembers: number;
  activeMembers: number;
  presentToday: number;
  onLeave: number;
  pendingPayments: number;
  totalRevenue: number;
  monthlyRevenue: number;
}

class MessService {
  /**
   * Create a new mess (Manager only)
   */
  async createMess(data: {
    name: string;
    address: string;
    monthlyFee: number;
    capacity?: number;
  }) {
    const response = await api.post(API_ENDPOINTS.MESS.CREATE, data);
    return response.data;
  }

  /**
   * Get mess by ID
   */
  async getMessById(messId: string) {
    const response = await api.get(API_ENDPOINTS.MESS.GET_BY_ID(messId));
    return response.data;
  }

  /**
   * Get all messes
   */
  async getAllMesses(page = 1, limit = 10) {
    const response = await api.get(API_ENDPOINTS.MESS.GET_ALL, { params: { page, limit } });
    return response.data;
  }

  /**
   * Update mess details
   */
  async updateMess(messId: string, data: Partial<Mess>) {
    const response = await api.put(API_ENDPOINTS.MESS.UPDATE(messId), data);
    return response.data;
  }

  /**
   * Delete mess
   */
  async deleteMess(messId: string) {
    const response = await api.delete(API_ENDPOINTS.MESS.DELETE(messId));
    return response.data;
  }

  /**
   * Regenerate QR code
   */
  async regenerateQRCode(messId: string, validityDays = 30) {
    const response = await api.post(API_ENDPOINTS.MESS.REGENERATE_QR(messId), { validityDays });
    return response.data;
  }

  /**
   * Join mess (Member only)
   */
  async joinMess(messId: string) {
    const response = await api.post(API_ENDPOINTS.MESS.REQUEST_JOIN, { messId });
    return response.data;
  }

  /**
   * Get mess members
   */
  async getMessMembers(messId: string): Promise<MessMember[]> {
    const response = await api.get(API_ENDPOINTS.MESS.GET_MEMBERS(messId));
    return response.data.data || [];
  }

  /**
   * Approve or reject join request
   */
  async updateJoinRequest(messId: string, memberId: string, status: 'active' | 'rejected') {
    const response = await api.put(API_ENDPOINTS.MESS.UPDATE_MEMBER_STATUS(messId, memberId), { status });
    return response.data;
  }

  /**
   * Get dashboard statistics (custom aggregation)
   */
  async getDashboardStats(messId: string): Promise<MessStats> {
    try {
      // Get multiple stats in parallel
      const [members, attendance, payments] = await Promise.all([
        api.get(API_ENDPOINTS.MESS.GET_MEMBERS(messId)),
        api.get(API_ENDPOINTS.ATTENDANCE.GET_STATS(messId), {
          params: {
            startDate: new Date().toISOString().split('T')[0],
            endDate: new Date().toISOString().split('T')[0]
          }
        }),
        api.get(API_ENDPOINTS.PAYMENTS.GET_STATS(messId))
      ]);

      const membersData = members.data.data || [];
      const attendanceData = attendance.data.data || {};
      const paymentsData = payments.data.data || {};

      return {
        totalMembers: membersData.length,
        activeMembers: membersData.filter((m: MessMember) => m.status === 'active').length,
        presentToday: attendanceData.presentCount || 0,
        onLeave: attendanceData.onLeaveCount || 0,
        pendingPayments: paymentsData.pendingAmount || 0,
        totalRevenue: paymentsData.totalCollected || 0,
        monthlyRevenue: paymentsData.currentMonthRevenue || 0
      };
    } catch (error: any) {
      console.error('Error fetching dashboard stats:', error);
      // Return default stats if API fails
      return {
        totalMembers: 0,
        activeMembers: 0,
        presentToday: 0,
        onLeave: 0,
        pendingPayments: 0,
        totalRevenue: 0,
        monthlyRevenue: 0
      };
    }
  }
}

export const messService = new MessService();
