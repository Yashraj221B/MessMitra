import { api } from './api.service';
import { API_ENDPOINTS } from '../constants/api.constants';

export interface AttendanceRecord {
  id: string;
  messId: string;
  memberId: string;
  date: string;
  mealType: 'breakfast' | 'lunch' | 'dinner';
  status: 'present' | 'absent' | 'leave';
  scanMethod?: 'qr' | 'manual' | 'nfc';
  scannedAt?: string;
  member?: {
    id: string;
    name: string;
    phone: string;
  };
}

export interface AttendanceStats {
  totalMembers: number;
  presentToday: number;
  absentToday: number;
  onLeaveToday: number;
  attendanceRate: number;
}

export interface MemberAttendanceStats {
  memberId: string;
  memberName: string;
  totalDays: number;
  presentDays: number;
  absentDays: number;
  leaveDays: number;
  attendancePercentage: number;
}

class AttendanceService {
  /**
   * Mark attendance for a member
   */
  async markAttendance(data: {
    messId: string;
    memberId: string;
    date: string;
    mealType: 'breakfast' | 'lunch' | 'dinner';
    scanMethod?: 'qr' | 'manual' | 'nfc';
    status?: 'present' | 'absent';
  }): Promise<AttendanceRecord> {
    const response = await api.post(API_ENDPOINTS.ATTENDANCE.MARK, {
      ...data,
      status: data.status || 'present',
      scanMethod: data.scanMethod || 'manual'
    });
    return response.data.data;
  }

  /**
   * Get attendance report for a mess (date range)
   */
  async getAttendanceReport(
    messId: string,
    startDate?: string,
    endDate?: string
  ): Promise<AttendanceRecord[]> {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const response = await api.get(`${API_ENDPOINTS.ATTENDANCE.GET_REPORT(messId)}?${params.toString()}`);
    return response.data.data;
  }

  /**
   * Get member's attendance history
   */
  async getMemberAttendance(
    messId: string,
    memberId: string,
    startDate?: string,
    endDate?: string
  ): Promise<AttendanceRecord[]> {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const response = await api.get(`${API_ENDPOINTS.ATTENDANCE.GET_MEMBER_ATTENDANCE(messId, memberId)}?${params.toString()}`);
    return response.data.data;
  }

  /**
   * Get attendance statistics for a mess
   */
  async getAttendanceStats(messId: string, date?: string): Promise<AttendanceStats> {
    const params = date ? `?date=${date}` : '';
    const response = await api.get(`${API_ENDPOINTS.ATTENDANCE.GET_STATS(messId)}${params}`);
    return response.data.data;
  }

  /**
   * Get today's attendance for a mess
   */
  async getTodayAttendance(messId: string): Promise<AttendanceRecord[]> {
    const today = new Date().toISOString().split('T')[0];
    return this.getAttendanceReport(messId, today, today);
  }
}

export const attendanceService = new AttendanceService();
