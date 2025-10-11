import { api } from './api.service';
import { API_ENDPOINTS } from '../constants/api.constants';

export interface Leave {
  id: string;
  messId: string;
  memberId: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  member?: {
    id: string;
    name: string;
    phone: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface LeaveStats {
  totalLeaves: number;
  pendingLeaves: number;
  approvedLeaves: number;
  rejectedLeaves: number;
  totalDays: number;
}

class LeaveService {
  /**
   * Create a new leave request
   */
  async createLeave(data: {
    messId: string;
    startDate: string;
    endDate: string;
    reason: string;
  }): Promise<Leave> {
    const response = await api.post(API_ENDPOINTS.LEAVE.CREATE(data.messId), data);
    return response.data.data;
  }

  /**
   * Get current user's leave requests
   */
  async getMyLeaves(): Promise<Leave[]> {
    const response = await api.get(API_ENDPOINTS.LEAVE.GET_MY_LEAVES);
    return response.data.data || [];
  }

  /**
   * Get all leave requests for a mess (Manager view)
   */
  async getMessLeaves(messId: string, status?: 'pending' | 'approved' | 'rejected'): Promise<Leave[]> {
    const params = status ? { status } : {};
    const response = await api.get(API_ENDPOINTS.LEAVE.GET_MESS_LEAVES(messId), { params });
    return response.data.data || [];
  }

  /**
   * Update leave request status (approve/reject)
   */
  async updateLeaveStatus(
    leaveId: string,
    status: 'approved' | 'rejected'
  ): Promise<Leave> {
    const response = await api.patch(
      API_ENDPOINTS.LEAVE.UPDATE_STATUS(leaveId),
      { status }
    );
    return response.data.data;
  }

  /**
   * Get leave statistics for a mess
   */
  async getLeaveStats(messId: string, startDate?: string, endDate?: string): Promise<LeaveStats> {
    const params: any = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    
    try {
      const response = await api.get(API_ENDPOINTS.LEAVE.GET_STATS(messId), { params });
      return response.data.data || {
        totalLeaves: 0,
        pendingLeaves: 0,
        approvedLeaves: 0,
        rejectedLeaves: 0,
        totalDays: 0
      };
    } catch (error) {
      console.error('Error fetching leave stats:', error);
      return {
        totalLeaves: 0,
        pendingLeaves: 0,
        approvedLeaves: 0,
        rejectedLeaves: 0,
        totalDays: 0
      };
    }
  }

  /**
   * Cancel a leave request (before approval)
   */
  async cancelLeave(leaveId: string): Promise<void> {
    await api.delete(API_ENDPOINTS.LEAVE.CANCEL(leaveId));
  }
}

export const leaveService = new LeaveService();
